import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProtectedLink from '../common/ProtectedLink';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [versions, setVersions] = useState([]);
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/install/version/`)
      .then(response => setVersions(response.data))
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/install')) {
      setActiveMenu('install_files');
    } else if (location.pathname.startsWith('/patch')) {
      setActiveMenu('patch_files');
    } else if (location.pathname.startsWith('/jdk')) {
      setActiveMenu('jdk_files');
    } else {
      setActiveMenu('');
    }
  }, [location.pathname]);


return (
<div className="sidebar">
  <div className="logo">
    <div className="logo-icon"></div>
    <span onClick={handleClick} style={{ cursor: 'pointer' }}>APP</span>
  </div>
  <nav className="menu">
    <p>DOWNLOAD</p>
    <div className='menu-label'>
      <ProtectedLink to={`/install/version/${versions[0]}/files`}>
          Install Files
      </ProtectedLink>
      {activeMenu === 'install_files' && (
        <div className="submenu" >
          {versions.map((v, index) => (
            <ProtectedLink 
              key={index}
              to={`/install/version/${v}/files`}
              onClick={(e) => e.stopPropagation()}
            >
              {v}
            </ProtectedLink>
          ))}
        </div>
      )}
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/patch/files`}>
          Patch Files
      </ProtectedLink>
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/jdk/files`}>
          JDK Files
      </ProtectedLink>
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/license/files`}>
          License (Trial)
      </ProtectedLink>
    </div>
    </nav>
    <nav className="others">
      <p>OTHERS</p>
      <a href="" target="_blank" rel="noreferrer">
        Manual
      </a>
      <a href="#">
        <span className="menu-icon">✉️</span>
        Contact Us
      </a>
    </nav>
  </div>
  );
}

export default Sidebar;
