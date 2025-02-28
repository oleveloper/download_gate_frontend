import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Data, FileTable, Sidebar, Header, SignUp, SignIn, ToastMessage } from './components';
import { SnackbarProvider } from 'notistack';
import UserContext from './context/UserContext';
import Main from './pages/Main';
import axios from './utils/axiosConfig';
import './App.css';

function App() {
  useEffect(() => {
    axios.get('api/csrf/')
      .then(() => {})
      .catch((err) => {});
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<DefaultLayout />}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

function DefaultLayout() {
  const [errorMessage, setErrorMessage] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const { setUser } = useContext(UserContext);

  const [versions, setVersions] = useState([]);
  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch('http://localhost:8000/api/check-auth/', {
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
