import React from 'react';
import './Attendance_SideBar.css';
import { Link, useLocation } from 'react-router-dom'; 
import dashboard from '../assets/dashboard.png';
import attendance from '../assets/Attendance.png'
import edit from '../assets/edit.png'
import today from '../assets/today.png'
import past from '../assets/past.png'
import analysis from '../assets/analysis.png'
function Attendance_SideBar() {
  const location = useLocation(); 
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul>
        <li className={isActive('/dashboard')}>
          <Link to="/dashboard">
          <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        <li className={isActive('/dashboard/Daily-Attendance')}>
          <Link to="/dashboard/Daily-Attendance">
          <img src={attendance} width="40px" height="40px" alt="Attendance" />
            Daily Attendance
          </Link>
        </li>
        <li className={isActive('/dashboard/Edit_Entry')}>
          <Link to="/dashboard/Edit-Entry">
          <img src={edit} width="40px" height="40px" alt="Edit" />
            Edit Entry
          </Link>
        </li>
        <li className={isActive('/dashboard/Todays-List')}>
          <Link to="/dashboard/Todays-List">
          <img src={today} width="40px" height="40px" alt="Today" />
            Today's List
          </Link>
        </li>
        <li className={isActive('/dashboard/Attendance-Log')}>
          <Link to="/dashboard/Attendance-Log">
          <img src={past} width="40px" height="40px" alt="Past" />
            Attendance Log
          </Link>
        </li>
        <li className={isActive('/dashboard/Attendance-Analysis')}>
          <Link to="/dashboard/Attendance-Analysis">
          <img src={analysis} width="40px" height="40px" alt="Analysis" />
            Student Analysis
          </Link>
        </li>        
      </ul>
    </div>
  );
}

export default Attendance_SideBar;
