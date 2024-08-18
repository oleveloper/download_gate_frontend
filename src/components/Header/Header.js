import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import './Header.css';

const Header = ({ isAuthenticated, username, profileImageUrl }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleProfileClick = () => {
      setShowDropdown(!showDropdown);
    };
    
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <div className="header">
            {isAuthenticated ? (
                <div className="user-profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                    <img src={profileImageUrl} 
                    alt={`${username}'s profile`}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <span>{username}</span>
                    {showDropdown && 
                    <div ref={dropdownRef}>
                        <ProfileDropdown/>
                    </div>}
                </div>
            ) : (
                <div className="auth-links">
                <Link to="/signin" className="auth-link">Sign In</Link>
                <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            )}
      </div>
    );
};

export default Header;
