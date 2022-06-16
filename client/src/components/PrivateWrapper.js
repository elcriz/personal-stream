import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';

const PrivateWrapper = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateWrapper;
