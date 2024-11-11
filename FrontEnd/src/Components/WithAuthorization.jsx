import React from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenData } from '../Pages/authUtils';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
  return (props) => {
    const tokenData = getTokenData();
    if (!tokenData) {
      return <Navigate to="/" />;
    }
    const {role} = tokenData;
    if (allowedRoles.includes(role)) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/invalidpage" />;
    }
  };
};

export default withAuthorization;
