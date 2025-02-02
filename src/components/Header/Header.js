import React, { useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import { Button, Box } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import signOut from '../SignOut/SignOut'; 
import PersonIcon from '@mui/icons-material/Person';

import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated, username, profileImageUrl }) => {
  const navigate = useNavigate();
  const userSession = React.useMemo(() => ({
    user: {
      name: username,
      email: '',
      image: profileImageUrl && typeof profileImageUrl === 'string' ? profileImageUrl : undefined, 
    },
  }), [username, profileImageUrl]);
  const [session, setSession] = React.useState(userSession);
  const { setUser } = useContext(UserContext);

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

  const handleProfileSettings = () => {
    alert("Profile Settings Clicked!"); // TODO
  };

  return (
  <div className="header">
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>
        {isAuthenticated && (
          <Account slotProps={{
            AccountPreview: {
              avatarProps: {
                src: typeof session?.user?.image === 'string' ? session.user.image : undefined,
                children: !session?.user?.image ? <PersonIcon /> : null,
              },
              primaryText: session?.user?.name || "Guest",
            },
            SignOutButton: {
              endAdornment: (
                <Button variant="outlined" size="small" onClick={handleProfileSettings}>
                  Profile Settings
                </Button>
              ),
            }
          }}/>
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
