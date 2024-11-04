import React from 'react';
import {Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
