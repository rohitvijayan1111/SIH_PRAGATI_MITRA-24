import React from 'react';
import DashBoard_hod from './Dashboard_hod';
import Dashboard_admin from './Dashboard_admin';
import withAuthorization from '../Components/WithAuthorization';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getTokenData } from './authUtils';
import FinanceSummaryTable from './FinanceSummaryTable';
import Dashboard_Infra from './Dashboard_Infra';
import Student_Dashboard from './Student_Dashboard';
import Faculty_Dashboard from './Faculty_Dashboard';


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
      {role === 'Infrastructure Coordinator' && <Dashboard_Infra/>}
      {role === 'Finance Coordinator' && <FinanceSummaryTable/>}
      {role === 'Student' && <Student_Dashboard/>}
      {role === 'Faculty' && <Faculty_Dashboard/>}
      {role !== 'hod' && role !== 'Attendance Manager' && role!=='Event Coordinator' && role!=='Infrastructure Coordinator' && role!=='Finance Coordinator' && role!=='Student' && role!=='Faculty'  && <Dashboard_admin />}
      
    </>
  );
}
export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager','Event Coordinator',"academic_coordinator","IQAC","Finance Coordinator","Infrastructure Coordinator","Student","Faculty"])(DashBoard);
