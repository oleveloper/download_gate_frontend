import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Avatar } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function ProfileSetting({ open, onClose }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setError('File size should be less than 2MB');
    } else {
      setProfileImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    if (newName.length < 3) {
      setError('Name must be at least 3 characters long');
    } else {
      setName(newName);
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters long and contain at least two of the following: letters, numbers, special characters');
    } else {
      setPassword(newPassword);
      setError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    if (confirmPassword !== password) {
      setError('Passwords do not match');
    } else {
      setConfirmPassword(confirmPassword);
      setError('');
    }
  };

  const handleSave = () => {
    if (!error) {
      console.log('Profile updated:', { name, password, profileImage });
      onClose();
    }
  };

  const handleClose = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Account Settings</DialogTitle>
      <DialogContent onMouseDown={(e) => e.stopPropagation()}>
        <div  style={{ textAlign: 'center' }}>
          <Avatar alt="Profile Image" src={profileImage} style={{ width: 100, height: 100, margin: '0 auto' }} />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-profile-image"
            type="file"
            onChange={handleProfileImageChange}
          />
          <label htmlFor="upload-profile-image">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </div>

        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={handleNameChange}
          error={!!error && name.length < 3}
          helperText={name.length < 3 && error}
        />

        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          error={!!error && !password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)}
          helperText={!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) && error}
        />

        <TextField
          margin="dense"
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!error && confirmPassword !== password}
          helperText={confirmPassword !== password && error}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={!!error}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileSetting;