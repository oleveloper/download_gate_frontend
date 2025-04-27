import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useParams, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileTable.css';

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

function FileTable({ setVersions }) {
  const API_BASE_URL = config.API_BASE_URL;
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { category, version } = useParams();
  const rows = files;
  const ticketColumn = { 
    field: 'ticket'
    , headerName: 'Issue'
    , flex: 1
    , minWidth: 200
    , renderCell: (params) => {
      const url = params.value;
      if (!url) return '';
      const label = url.substring(url.lastIndexOf('/') + 1);
      const description = params.row.description;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="issue-link">
            {label}
          </a>
          <Tooltip title={description}>
            <SearchIcon fontSize="small" style={{ cursor: 'pointer' }} />
          </Tooltip>
        </div>
      )
    }
  }

  const extraColumnsByCategory = {
    hotfix: [ticketColumn],
  }
  const extraColumns = extraColumnsByCategory[category] || [];
  const columns = [
    { field: 'os', headerName: 'OS', flex:0.5, minWidth: 50, headerAlign: 'center', align: 'center'
      , sortable: true
      , valueFormatter: (params) => params.value?.toLowerCase() || ''
      , renderCell: (params) => getIcon(params) },
    { field: 'name', headerName: 'File Name', flex: 3, minWidth: 200},
    ...extraColumns,
    { field: 'size', headerName: 'File Size', flex: 1, minWidth: 100
      , valueFormatter: (value) => {
        if (!value || isNaN(value)) return "N/A";
        const sizeInMB = value / (1024 * 1024);
        const sizeInKB = value / 1024;

        if (sizeInMB < 1) {
          return `${sizeInKB.toFixed(2)} KB`;
        } else {
          return `${sizeInMB.toFixed(2)} MB`;
        }
      },
    },
    { field: 'upload_date', headerName: 'Upload Date', minWidth: 100, flex: 1 },
    { field: 'key', headerName: '', minWidth: 0, flex: 0, hide: true },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
    setFiles([]);
    setLoading(true);
    setSearchTerm('');

    let url = version
      ? `${API_BASE_URL}/api/${category}/versions/${version}/`
      : `${API_BASE_URL}/api/${category}/`;

    axios.get(url, { withCredentials: true })
    .then((response) => {
      if (setVersions) setVersions(response.data.versions || []);
      setFiles(response.data.files.map((file, idx) => ({
        id: idx + 1,
        ...file
      })) || []);
      setLoading(false);
    })
    .catch((error) => {
      enqueueSnackbar('Fail to retrieve files: ' + error, { variant: 'error' });
      setLoading(false);
    });

  }, [API_BASE_URL, category, version]);

  const getIcon = (params) => {
    const os = params.value?.toLowerCase();
    if (!os) 
      return '';
    if (os === 'linux') {
      return <i className="bi-tencent-qq"></i>;
    } 
    if (os === 'windows') {
      return <i className="bi bi-windows"></i>;
    }
    return '';
  };

  const handleCopy = async () => {
    const selectedFiles = files.filter(file => selectedFile.includes(file.id));
    if (selectedFiles.length === 0) {
      enqueueSnackbar("Please select at least one file", { variant: "warning" });
      return;
    }
  
    try {
      const curlCommands = await Promise.all(
        selectedFiles.map(async ({ key, name }) => {
          const response = await axios.get(`${API_BASE_URL}/api/presign/?key=${encodeURIComponent(key)}`);
          const url = response.data.url;
          return `curl -L -o "${name}" "${url}"`;
        })
      );
  
      const command = curlCommands.join("\n");
  
      await navigator.clipboard.writeText(command);
      enqueueSnackbar("Download command copied to clipboard", { variant: "success" });
    } catch (error) {
      console.error("Error fetching presigned URLs", error);
      enqueueSnackbar("There was an error generating the command", { variant: "error" });
    }
  };  

  const handleDownload = (() => {
    const selectedFiles = files.filter(file => selectedFile.includes(file.id));
    if (!selectedFiles || selectedFiles.length === 0) {
      enqueueSnackbar("Please select a file to download", { variant: "warning" });
      return;
    }

    selectedFiles.forEach(async ({ key, name }, index) => {
      var url = '';
      axios.get(`${API_BASE_URL}/api/presign/?key=${encodeURIComponent(key)}`)
      .then(response => {
        url = response.data.url;

        setTimeout(() => {
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          enqueueSnackbar("Starting the download of the selected file(s)", { variant: "success" });
        }, index * 2000);
      })
      .catch(error => {
          enqueueSnackbar("There was an error fetching the data: " + error
          , { varient: 'error' })
      });
    });
  });

  const filteredRows = rows.filter((row) => {
    return row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <GradientCircularProgress />
      </div>
    );
  }

  return (
    <div>
      <input 
      type="text" 
      className="search-bar" 
      placeholder="File name search"
      value={searchTerm}
      onChange={handleSearchChange} />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        columnVisibilityModel={{ key: false }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
        }}
        pageSizeOptions={[10, 15, 25, 50, 100]}
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
            CURL
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
