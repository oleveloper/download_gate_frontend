import React, { useEffect, useMemo, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import { Button, Box, IconButton } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import { useSnackbar } from 'notistack';
import signOut from '../SignOut/SignOut'; 
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileSetting from '../ProfileSetting/ProfileSetting';
import axios from '../../utils/axiosConfig';
import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: user?.username || "Guest", // For mui
    username: user?.username || "Guest",
    email: user?.email || "",
    image: user?.image || undefined,
  });

  const userSession = useMemo(() => ({
    user: userData,
  }), [userData]);

  useEffect(() => {
    if (user) {
      setUserData((prev) => ({
        ...prev
        , name: user.username || "Guest"
        , username: user.username || "Guest"
        , email: user.email || ""
        , image: user.image || undefined
      }));
    }
  }, [user]);

  const [session, setSession] = React.useState(userSession);
  useEffect(() => {
    setSession(userSession);
  }, [userSession]);

  const handleSignOut = () => {
    signOut(setUser);
    setIsAuthenticated(false);
  };

  const authentication = useMemo(() => ({
    signIn: () => setIsAuthenticated(true),
    signOut: handleSignOut,
  }), []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append("username", data.name);
    formData.append("password", data.password);
    if (data.profileImage instanceof File) {
      formData.append("profile_image", data.profileImage); 
    }

    try {
      const response = await axios.post(
        "/api/update/",
        formData, 
      );

      if (response.status !== 200) {
          throw new Error("Failed to update profile");
      }
      const data = response.data;
      setUserData((prev) => ({
        ...prev,
        username: data.username,
        name: data.username,
        image: data.profile_image_url,
      }));

      setUser((prev) => ({
        ...prev,
        username: data.username,
        image: data.profile_image_url,
      }));

      enqueueSnackbar("Profile updated successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("Error updating profile", { variant: "error" })
    }
  };

  const handleProfileSettings = () => {
    handleOpen()
  };

  return (
  <div className="header">
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>
        {isAuthenticated && (
          <>
          <Account slotProps={{
            AccountPreview: {
              avatarProps: {
                src: typeof session?.user?.image === 'string' ? session.user.image : undefined,
                children: !session?.user?.image ? <PersonIcon /> : null,
              },
              primaryText: session?.user?.name || "Guest",
            },
          }}/>

          <IconButton onClick={handleProfileSettings}>
            <SettingsIcon/>
          </IconButton>

          <ProfileSetting 
            open={open} 
            onClose={handleClose} 
            onSave={handleSave} 
            user={userData}
            />
          </>
        )}

        {!isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{ 
                bgcolor: '#7B7F9E',
                color: 'white',
                '&:hover': { bgcolor: '#4C51BF' }
              }}
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              sx={{ 
                borderColor: '#7B7F9E',
                color: '#7B7F9E',
                '&:hover': { borderColor: '#4C51BF', color: '#4C51BF' }
              }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
</div>
  );
};

export default Header;
