import React, { useState } from 'react';
import './ProfileDropdown.css';
import ProfileSetting from '../ProfileSetting/ProfileSetting';
import SignOut from '../SignOut/SignOut';

function ProfileDropdown() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const handleSignOut = SignOut(); 
  const handleProfileSetting = (e) => {
    e.stopPropagation();
    setIsSettingsOpen(true);
  };
  const handleCloseSettings = (e) => {
    e.stopPropagation();
    setIsSettingsOpen(false);
  };

  return (
    <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
      <ul>
        <li onClick={handleProfileSetting}>Account</li>
        <li className="signout" onClick={handleSignOut}>Sign Out</li>
      </ul>

      <ProfileSetting 
      open={isSettingsOpen} 
      onClose={handleCloseSettings} />
    </div>
  );
}

export default ProfileDropdown;
