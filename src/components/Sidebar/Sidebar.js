import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProtectedLink from '../common/ProtectedLink';
import './Sidebar.css';

const Sidebar = ({versions = []}) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  const sortedVersions = [...versions].sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;
      if (aNum !== bNum) return bNum - aNum;
    }
    return 0;
  })

  useEffect(() => {
    if (location.pathname.startsWith('/install')) {
      setActiveMenu('install_files');
    } else if (location.pathname.startsWith('/patch')) {
      setActiveMenu('patch_files');
    } else if (location.pathname.startsWith('/hotfix')) {
      setActiveMenu('hotfix_files');
    } else if (location.pathname.startsWith('/jdk')) {
      setActiveMenu('jdk_files');
    } else if (location.pathname.startsWith('/license')){
      setActiveMenu('license_files');
    } else {
      setActiveMenu('');
    }
  }, [location.pathname]);


return (
<div className="sidebar">
  <div className="logo">
    <div className="logo-icon"></div>
    <span onClick={handleClick} style={{ cursor: 'pointer' }}>LENA LAB</span>
  </div>
  <nav className="menu">
    <p>DOWNLOAD</p>
    <div className='menu-label'>
      <ProtectedLink to={`/install`}>
          Install Files
      </ProtectedLink>
      {activeMenu === 'install_files' && (
        <div className="submenu" >
          <div className="install-list-scroll">
          {sortedVersions.map((v) => (
            <ProtectedLink 
              key={v}
              to={`/install/versions/${v}`}
              onClick={
                (e) => {e.stopPropagation(); 
              }}
            >
              {v}
            </ProtectedLink>
          ))}
          </div>
        </div>
      )}
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/patch`}>
          Patch Files
      </ProtectedLink>
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/hotfix`}>
          Hotfix Files
      </ProtectedLink>
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/jdk`}>
          JDK Files
      </ProtectedLink>
    </div>
    <div className='menu-label'>
      <ProtectedLink to={`/license`}>
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
        {/* <span className="menu-icon">✉️</span> */}
        Contact Us
      </a>
    </nav>
  </div>
  );
}

export default Sidebar;
