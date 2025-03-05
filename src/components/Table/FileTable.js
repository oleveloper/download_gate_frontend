import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useParams, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileTable.css'

function FileTable({ initialFiles = [] }) {
  const API_BASE_URL = config.API_BASE_URL;
  const { version } = useParams();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [type, setType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

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
    { field: 'url', headerName: 'Presigned URL', minWidth: 0, flex: 0, hide: true },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    setSelectedFile([]);
  }, [location.pathname, files]);

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
    setFiles([]);
    const fetchFiles = async () => {
      let url = '';
      if (type === 'install') {
        url = `${API_BASE_URL}/api/install/`;
      } else if (type === 'patch') {
        url = `${API_BASE_URL}/api/patch/`;
      } if (type === 'install-version') {
        url = `${API_BASE_URL}/api/install/versions/${version}/`;
      } else if (type === 'patch-version') {
        url = `${API_BASE_URL}/api/patch/versions/${version}/`;
      } else if (type === 'jdk') {
        url = `${API_BASE_URL}/api/jdk/`;
      } else if (type === 'license') {
        url = `${API_BASE_URL}/api/license/`;
      }

      if (url === '') return;
      try {
        const response = await axios
        .get(url, { withCredentials: true, });
        const files = response.data.files.map((file, index) => ({
          id: index + 1
          , ...file
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

  const handleCopy = (() => {
    const selectedFiles = files.filter(file => selectedFile.includes(file.id));
    let command = '';
    if (selectedFiles.length === 1) {
      command = `curl -O ${selectedFiles[0].url}`;
    } else if (selectedFiles.length > 1) {
      command =  selectedFiles.map((file) => `curl -O ${file.url}`).join(" && ");
    }

    if (!command) {
      enqueueSnackbar("Please select at least one file", { variant: "warning" });
    } else {
      navigator.clipboard.writeText(command).then(() => {
        enqueueSnackbar("Download command copied to clipboard", { variant: "success" });
      });
    }
  })


  const handleDownload = (() => {
    const selectedFiles = files.filter(file => selectedFile.includes(file.id));
    if (!selectedFiles || selectedFiles.length === 0) {
      enqueueSnackbar("Please select a file to download", { variant: "warning" });
      return;
    }

    selectedFiles.forEach(async ({ url, name }, index) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 2000);
    });
  });

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
        key={`${location.key}-${windowWidth}`}
        getRowClassName={(params) => 'custom-data-grid-row'}
        rowSelectionModel={selectedFile || []}
        onRowSelectionModelChange={(selection) => {
          setSelectedFile(selection);
        }}
      />
      <div className="table-footer">
        <>
          <button className="download-btn" style={{ margin: '0 8px' }} onClick={() => {
            handleCopy();
            setSelectedFile(null);
            setTimeout(() => setSelectedFile([]), 100);
          }}>
            Copy
          </button>
        </>

        <button className="download-btn" onClick={() => {
          handleDownload();
          setSelectedFile(null);
          setTimeout(() => setSelectedFile([]), 100);
        }}>
          Download
        </button>
      </div>

    </div>
  );
}

export default FileTable;
