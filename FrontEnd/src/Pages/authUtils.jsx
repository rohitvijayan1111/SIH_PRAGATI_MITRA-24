import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';
export const getTokenData = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const decodedToken = jwtDecode(token);
    return {
      ...decodedToken,
      id: decodedToken.id,
      role: decodedToken.role,
      department: decodedToken.department,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
