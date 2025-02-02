import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileTable.css'

function FileTable({ initialFiles = [] }) {
  const { version } = useParams();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [type, setType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState([]);
  const rows = files.map((file, index) => ({
    id: index + 1
    , ...file,
  }));

  const columns = [
    { field: 'type', headerName: 'OS', flex:0.5, minWidth: 50, headerAlign: 'center', align: 'center'
      , renderCell: (params) => getIcon(params.row) },
    { field: 'name', headerName: 'File Name', flex: 3, minWidth: 200},
    { field: 'size', headerName: 'File Size', flex: 1, minWidth: 100
      , valueFormatter: (value) => {
        if (!value || isNaN(value)) return "N/A";
        return `${(value / (1024 * 1024)).toFixed(2)} MB`;
      },
    },
    { field: 'upload_date', headerName: 'Upload Date', minWidth: 100, flex: 1 },
    { field: 'url', headerName: 'Presigned URL', minWidth: 100, flex: 1},
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (location.pathname.includes('/install/')) {
      setType('install-version');
    } else if (location.pathname.includes('/patch/')) {
      setType('patch-version');
    } else if (location.pathname.includes('/install')) {
      setType('install');
    } else if (location.pathname.includes('/patch')) {
      setType('patch');
    }  else if (location.pathname.includes('/jdk')) {
      setType('jdk');
    } else if (location.pathname.includes('/license')) {
      setType('license');
    } 
  }, [location.pathname, type]);

  useEffect(() => {
    const fetchFiles = async () => {
      let url = '';
      if (type === 'install') {
        url = `http://localhost:8000/api/install/`;
      } else if (type === 'patch') {
        url = `http://localhost:8000/api/patch/`;
      } if (type === 'install-version') {
        url = `http://localhost:8000/api/install/versions/${version}/`;
      } else if (type === 'patch-version') {
        url = `http://localhost:8000/api/patch/versions/${version}/`;
      } else if (type === 'jdk') {
        url = `http://localhost:8000/api/jdk/`;
      } else if (type === 'license') {
        url = `http://localhost:8000/api/license/`;
      }

      try {
        const response = await axios
        .get(url, { withCredentials: true, });
        const files = response.data.files.map((file, index) => ({
          ...file,
          id: index + 1
        }));
        setFiles(files);
      } catch (err) {
        setFiles([]);
      } finally {
      }
    };

    fetchFiles();
  }, [type, version]);

  const getIcon = (file) => {
    if (!file || !file.name) return '';
    if (file.name.toLowerCase().includes('linux')) {
      return <i className="bi-tencent-qq"></i>;
    } 
    if (file.name.toLowerCase().includes('win')) {
      return <i className="bi bi-windows"></i>;
    }
    return '';
  };

  const handleDownload = () => {
    const selectedFiles = files.filter(file => selectedFile.includes(file.id));
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select a file to download.");
      return;
    }
    selectedFiles.forEach((row) => {
      alert('Download button clicked :' + row.url);
      // TODO
    });
  };

  return (
    <div>
      <input 
      type="text" 
      className="search-bar" 
      placeholder="File name search"
      onChange={handleSearchChange} />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        columnVisibilityModel={{ url: false }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        style={{ width: '100%' }}
        key={windowWidth}
        getRowClassName={(params) => 'custom-data-grid-row'}
        selectionModel={selectedFile}
        onRowSelectionModelChange={(selection) => {
          setSelectedFile(selection);
        }}
      />
      <div className="table-footer">
        <button className="download-btn" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

export default FileTable;
