import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileTable.css'

function FileTable() {
  const { version } = useParams();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const columns = [
    { field: 'type', headerName: 'OS', flex:0.5, minWidth: 50, headerAlign: 'center', align: 'center', renderCell: (params) => getIcon(params.value) },
    { field: 'name', headerName: 'File Name', flex: 3, minWidth: 200},
    { field: 'size', headerName: 'File Size', flex: 1, minWidth: 100, valueFormatter: ({ value }) => `${(value / 1024).toFixed(2)} KB` },
    { field: 'upload_date', headerName: 'Upload Date', minWidth: 100, flex: 1 },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = files.filter((row) => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.age && row.age.toString().includes(searchTerm)) ||
      (row.country && row.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );
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
    if (location.pathname.includes('/patch/files')) {
      setType('patch');
    } else if (location.pathname.includes('/jdk/files')) {
      setType('jdk');
    } else if (location.pathname.includes('/install/version')) {
      setType('install');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchFiles = async () => {
      let url = '';

      if (type === 'install') {
        url = `http://localhost:8000/api/install/version/${version}/files/`;
      } else if (type === 'patch') {
        url = `http://localhost:8000/api/patch/files/`;
      } else if (type === 'jdk') {
        url = `http://localhost:8000/api/jdk/files/`;
      }

      try {
        const response = await axios
        .get(url, { withCredentials: true, });
        const files = response.data.files.map((file, index) => ({
          ...file,
          id: index + 1,
          type: file.name,
        }));
        setFiles(files);
      } catch (err) {
        setFiles([]);
      } finally {
      }
    };

    if (type && (type !== 'install' || (type === 'install' && version))) {
      fetchFiles();
    }
  }, [type, version]);

  const getIcon = (fileName) => {
    if (fileName.toLowerCase().includes('linux')) {
      return <i className="bi-tencent-qq"></i>;
    } 
    if (fileName.toLowerCase().includes('win')) {
      return <i className="bi bi-windows"></i>;
    }
    return '';
  };

  const handleDownload = () => {
    alert('Download button clicked');
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
