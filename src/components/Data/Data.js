import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import config from '../../config';
import axios from "axios";
import FileTable from "../Table/FileTable";
import CircularProgress from "@mui/material/CircularProgress";

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

function Data({ setVersions }) {
  const API_BASE_URL = config.API_BASE_URL;
  const { category } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState([]); 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setVersions([]);
    axios.get(`${API_BASE_URL}/api/${category}/`)
      .then((response) => {
        setVersions(response.data.versions || []);
        setFile(response.data.files || []);
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar("Fail to retrieve versions:" + error, { varient: 'error' })
        setLoading(false);
      });
    }, [category]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <GradientCircularProgress />
      </div>
    );
  }

  return (
      <div>
        <FileTable initialFiles={file} />
      </div>
  )
}

export default Data;