import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastMessage from './ToastMessage';
import UserContext from '../../context/UserContext';

const ProtectedLink = ({ to, children }) => {
  const { user } = useContext(UserContext);
  const [showToast, setShowToast] = useState(false);

  const handleClick = (e) => {
    if (!user.is_authenticated || user.is_pending) {
      setShowToast(true); 
      e.preventDefault(); 
      setTimeout(() => setShowToast(false), 3000); 
    }
  };

  return (
    <>
      {showToast && <ToastMessage message={'You do not have permission to access this link.'} />}
      <Link to={to} onClick={handleClick}>
        {children}
      </Link>
    </>
  );
};

export default ProtectedLink;