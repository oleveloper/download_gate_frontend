import React, { useState, useEffect, useRef } from "react";
import { Modal, Box, Button, Avatar, IconButton, Divider, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import "./ProfileSetting.css";

const ProfileSetting = ({ open, onClose, onSave, user }) => {
  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.image || null);
  const [profileImage, setProfileImage] = useState(user?.image || "");
  const [nightMode, setNightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const nameInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setEmail(user.email || "");
      setProfileImage(user.image || "");
    }
  }, [user]); 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleSubmit = () => {
    const name = nameInput.current.value;
    const password = passwordInput.current.value;

    if (password) {
      const errors = validatePassword(password, name);
      if (errors.length > 0) {
        enqueueSnackbar("Password Error: " + errors.join(" "), { variant: "error" });
        return;
      }
    }
    onSave({ name, email, password, profileImage, nightMode });
    onClose();
  };

  const handleToggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  function validatePassword(password, username) {
    const errors = [];
  
    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
  
    if (/^\d+$/.test(password)) {
      errors.push("Password cannot be entirely numeric.");
    }
  
    const commonPasswords = ["password", "12345678", "qwerty", "letmein"];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common.");
    }
  
    if (username && password.toLowerCase().includes(username.toLowerCase())) {
      errors.push("Password is too similar to your username.");
    }
  
    return errors;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="profile-modal">
        <IconButton className="close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Box className="profile-avatar-container">
          <Avatar src={previewImage || user?.image} className="profile-avatar" />
          <IconButton className="profile-camera-btn" component="label">
            <CameraAltIcon fontSize="small" />
            <input type="file" 
            hidden accept="image/*" 
            onChange={handleImageChange} />
          </IconButton>
        </Box>

        <FormControl className="form-control" disabled variant="standard">
          <InputLabel htmlFor="component-disabled">EMAIL</InputLabel>
          <Input id="component-disabled" defaultValue={user.email} />
        </FormControl>

        <FormControl className="form-control" variant="standard">
          <InputLabel htmlFor="component-simple">NAME</InputLabel>
          <Input 
          id="component-simple" 
          defaultValue={user.username}
          inputRef={nameInput} />
        </FormControl>

        <FormControl className="form-control" variant="standard">
          <InputLabel htmlFor="component-simple">PASSWORD</InputLabel>
          <Input 
          id="component-simple" 
          defaultValue=""
          inputRef={passwordInput}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleVisibility}
                edge="end"
                style={{ marginRight: 'auto' }}
              >
                {showPassword 
                ? <VisibilityOff fontSize="small"/> 
                : <Visibility fontSize="small"/>}
              </IconButton>
            </InputAdornment>
          }/>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* <Box className="switch-container">
          <Typography>NIGHT MODE</Typography>
          <Switch checked={nightMode} onChange={(e) => setNightMode(e.target.checked)} />
        </Box> */}

        <Button className="save-btn" variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileSetting;