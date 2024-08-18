import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FileTable, Sidebar, Header, SignUp, SignIn, ToastMessage } from './components';
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
  const { user, setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImageUrl, setprofileImageUrl] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch('http://localhost:8000/api/check-auth/', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.is_authenticated) {
          setIsAuthenticated(true);
          setUsername(data.username);
          setprofileImageUrl(data.profile_image_url);
        } else {
          setIsAuthenticated(false);
          setUsername('');
          setprofileImageUrl('');
        }
        setUser({
          is_authenticated: data.is_authenticated,
          is_pending: data.is_pending,
          username: username,
        });
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setprofileImageUrl('');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="app-container">
      {errorMessage && <ToastMessage message={errorMessage} />}
      <Sidebar/>
      <div className="main">
        <Header isAuthenticated={isAuthenticated} 
                username={username}
                profileImageUrl={profileImageUrl}/>
        <div className="main-content">
          <Routes>
            <Route path="/install/version/:version/files" element={<FileTable/>}/>
            <Route path="/patch/files" element={<FileTable/>}/>
            <Route path="/jdk/files" element={<FileTable/>}/>
            <Route path="/" element={<Main />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
