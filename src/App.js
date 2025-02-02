import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Data, FileTable, Sidebar, Header, SignUp, SignIn, ToastMessage } from './components';
import { SnackbarProvider, useSnackbar } from 'notistack';
import UserContext from './context/UserContext';
import Main from './pages/Main';
import './App.css';

function App() {
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
  const { user, setUser } = useContext(UserContext);

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
          username: username,
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
                  setIsAuthenticated={setIsAuthenticated}
                  username={username}
                  profileImageUrl={profileImageUrl}/>
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
