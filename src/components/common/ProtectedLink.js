import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useSnackbar } from 'notistack';

const ProtectedLink = ({ to, children }) => {
  const { user } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (e) => {
    if (!user || !user.is_authenticated || user.is_pending) {
      enqueueSnackbar('You do not have permission to access this link.', { variant: 'info' });
      e.preventDefault(); 
    }
  };

  return (
    <>
      <Link to={to} onClick={handleClick}>
        {children}
      </Link>
    </>
  );
};

export default ProtectedLink;