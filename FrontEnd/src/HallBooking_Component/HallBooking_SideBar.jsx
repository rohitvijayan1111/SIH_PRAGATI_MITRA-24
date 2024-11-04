import React from 'react';
import './HallBooking_SideBar.css';
import { Link, useLocation } from 'react-router-dom'; 
import dashboard from '../assets/dashboard.png';
import attendance from '../assets/Attendance.png'
import edit from '../assets/edit.png'
import today from '../assets/today.png'
import past from '../assets/past.png'
import analysis from '../assets/analysis.png'
import Hall from '../assets/Hall.png'
import Status from '../assets/Status.png'
import Available from '../assets/Available.png'
function HallBooking_SideBar() {
  const location = useLocation(); 
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebarhb">
      <ul>
        <li className={isActive('/dashboard/DashBoard-Hall')}>
          <Link to="/dashboard/DashBoard-Hall">
          <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        <li className={isActive('/dashboard/Hall-Request')}>
          <Link to="/dashboard/Hall-Request">
          <img src={Hall} width="50px" height="50px" alt="Hall Request" />
            Hall Request
          </Link>
        </li>
        <li className={isActive('/dashboard/Request-Status')}>
          <Link to="/dashboard/Request-Status">
          <img src={Status} width="40px" height="40px" alt="Request Status" />
            Request Status
          </Link>
        </li>
        <li className={isActive('/dashboard/Past-Events')}>
          <Link to="/dashboard/Past-Events">
          <img src={past} width="40px" height="40px" alt="Past Events" />
            Past Events
          </Link>
        </li>
        <li className={isActive('/dashboard/Available-Halls')}>
          <Link to="/dashboard/Available-Halls">
          <img src={Available} width="40px" height="40px" alt="Available Hall" />
            Available Halls
          </Link>
        </li>     
      </ul>
    </div>
  );
}

export default HallBooking_SideBar;
