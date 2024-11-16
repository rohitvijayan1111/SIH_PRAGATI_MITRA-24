import React from 'react';
import DashBoard_hod from './Dashboard_hod';
import Dashboard_admin from './Dashboard_admin';
import withAuthorization from '../Components/WithAuthorization';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getTokenData } from './authUtils';


const DashBoard = () => {
  const tokenData = getTokenData();
    if (!tokenData) {
      return <Navigate to="/" />;
    }
    const {role} = tokenData;

  return (
    <>
      {role === 'hod' && <DashBoard_hod />}
      {role === 'Attendance Manager' && <Attendance_DB_Dept />}
      {role !== 'hod' && role !== 'Attendance Manager' && role!=='Event Coordinator' && <Dashboard_admin />}
    </>
  );
}
export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager','Event Coordinator',"academic_coordinator","IQAC"])(DashBoard);
