import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Data, FileTable, Sidebar, Header, SignUp, SignIn, ToastMessage } from './components';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import UserContext from './context/UserContext';
import Main from './pages/Main';
import axiosInstance from './utils/axiosConfig';
import config from './config';
import './App.css';

function App() {
  const [csrfReady, setCsrfReady] = useState(false);

  useEffect(() => {
    async function initCsrf() {
      try {
        await axiosInstance.get('/api/csrf/');
        setCsrfReady(true);
      } catch (error) {
        console.error('CSRF init error:', error);
      }
    }
    initCsrf();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Routes>
          <Route path="/*" element={<DefaultLayout />}/>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

function DefaultLayout() {
  const API_BASE_URL = config.API_BASE_URL;
  const [errorMessage, setErrorMessage] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const { setUser } = useContext(UserContext);

  const [versions, setVersions] = useState([]);
  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch(`${API_BASE_URL}/api/check-auth/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.is_authenticated);
        setUsername(data.username);
        setProfileImageUrl(data.profile_image_url);
        setUser({
          is_authenticated: data.is_authenticated,
          is_pending: data.is_pending,
          username: data.username,
          email: data.email,
          image: data.profile_image_url
        });
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setProfileImageUrl('');
        setUser(null);
      }
    };
    checkAuthStatus();
  }, [setUser]);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <div className="app-container">
        {errorMessage && <ToastMessage message={errorMessage} />}
        <Sidebar versions={versions}/>
        <div className="main">
          <Header isAuthenticated={isAuthenticated} 
                  setIsAuthenticated={setIsAuthenticated}/>
          <div className="main-content">
            <Routes>
              <Route path="/install/versions/:version" element={<FileTable/>}/>
              <Route path="/patch/versions/:version" element={<FileTable/>}/>
              <Route path="/:category" element={<Data setVersions={setVersions}/>}/>
              <Route path="/" element={<Main />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </SnackbarProvider>

  );
}

export default App;
