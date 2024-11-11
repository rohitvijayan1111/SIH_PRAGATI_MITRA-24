import React, { useState, useEffect, useRef } from 'react';
import './SideBar.css';
import { Link, useLocation } from 'react-router-dom';
import faculty from '../assets/faculty.png';
import dashboard from '../assets/dashboard.png';
import mail from '../assets/mail.png';
import att from '../assets/Attendance.png';
import statistics from '../assets/statistics.png';
import today from '../assets/today.png';
import past from '../assets/past.png';
import analysis from '../assets/analysis.png';
import reserve from '../assets/reserve.png';
import upcoming from '../assets/upcoming.png';
import Status from '../assets/Status.png';
import Available from '../assets/Available.png';
import others from '../assets/others.png';
import outingIcon from '../assets/outing.png'; 
import RequestList from '../assets/request-list.png'; 
import { getTokenData } from "../Pages/authUtils";

function SideBar() {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const tokenData = getTokenData();
  let user = tokenData.role;
  
  const [showAttendanceLinks, setShowAttendanceLinks] = useState(false);
  const [showHallBookingLinks, setShowHallBookingLinks] = useState(false);
  const [showOutingLinks, setShowOutingLinks] = useState(false); // New state for Outing Form

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowAttendanceLinks(false);
        setShowHallBookingLinks(false);
        setShowOutingLinks(false); // Close outing form links when clicked outside
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowAttendanceLinks(false);
    setShowHallBookingLinks(false);
    setShowOutingLinks(false); // Reset outing links when location changes
  }, [location]);

  const handleMouseEnterAttendanceLinks = () => {
    setShowAttendanceLinks(true);
  };

  const handleMouseLeaveAttendanceLinks = () => {
    setShowAttendanceLinks(false);
  };

  const handleMouseEnterHallBookingLinks = () => {
    setShowHallBookingLinks(true);
  };

  const handleMouseLeaveHallBookingLinks = () => {
    setShowHallBookingLinks(false);
  };

  const handleMouseEnterOutingLinks = () => {
    setShowOutingLinks(true);
  };

  const handleMouseLeaveOutingLinks = () => {
    setShowOutingLinks(false);
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <ul>
        <li className={isActive('/dashboard', true)}>
          <Link to="/dashboard">
            <img src={dashboard} width="40px" height="40px" alt="Dashboard" />
            Dashboard
          </Link>
        </li>
        {user !== "IQAC" && (
          <>
            <li className='drop-down'>
              <p onMouseEnter={handleMouseEnterAttendanceLinks} onMouseLeave={handleMouseLeaveAttendanceLinks}>
                <img src={att} width="40px" height="40px" alt="Attendance" />
                Attendance
              </p>
              {showAttendanceLinks && (
                <div className="extra-links-container-att" onMouseEnter={handleMouseEnterAttendanceLinks} onMouseLeave={handleMouseLeaveAttendanceLinks}>
                  <li className={isActive('/dashboard/Attendance_DB_Dept')}>
                    <Link to="/dashboard/Attendance_DB_Dept">
                      <img src={statistics} width="30px" height="30px" alt="Statistics" />
                      Statistics
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Todays-List')}>
                    <Link to="/dashboard/Todays-List">
                      <img src={today} width="30px" height="30px" alt="Absentees" />
                      Absentees
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Attendance-Log')}>
                    <Link to="/dashboard/Attendance-Log">
                      <img src={past} width="30px" height="30px" alt="Lecture" />
                      Attendance<br/> Log
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Attendance-Analysis')}>
                    <Link to="/dashboard/Attendance-Analysis">
                      <img src={analysis} width="30px" height="30px" alt="Analysis" />
                      Analysis
                    </Link>
                  </li>
                </div>
              )}
            </li>
            <li className='drop-down' onMouseEnter={handleMouseEnterHallBookingLinks} onMouseLeave={handleMouseLeaveHallBookingLinks}>
              <p>
                <img src={reserve} width="40px" height="40px" alt="Hall Booking" />
                Hall Booking
              </p>
              {showHallBookingLinks && (
                <div className="extra-links-container" onMouseEnter={handleMouseEnterHallBookingLinks} onMouseLeave={handleMouseLeaveHallBookingLinks}>
                  <li className={isActive('/dashboard/DashBoard-Hall')}>
                    <Link to="/dashboard/DashBoard-Hall">
                      <img src={upcoming} width="30px" height="30px" alt="Upcoming" />
                      Upcoming
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Request-Status')}>
                    <Link to="/dashboard/Request-Status">
                      <img src={Status} width="30px" height="30px" alt="Request Status" />
                      Req Status
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Past-Events')}>
                    <Link to="/dashboard/Past-Events">
                      <img src={past} width="30px" height="30px" alt="Past Events" />
                      Past Events
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Available-Halls')}>
                    <Link to="/dashboard/Available-Halls">
                      <img src={Available} width="30px" height="30px" alt="Available Halls" />
                      Halls
                    </Link>
                  </li>
                </div>
              )}
            </li>
            <li className='drop-down' onMouseEnter={handleMouseEnterOutingLinks} onMouseLeave={handleMouseLeaveOutingLinks}>
              <p>
                <img src={outingIcon} width="40px" height="40px" alt="Outing Form" />
                Outing Form
              </p>
              {showOutingLinks && (
                <div className="extra-links-container-outing" onMouseEnter={handleMouseEnterOutingLinks} onMouseLeave={handleMouseLeaveOutingLinks}>
                  <li className={isActive('/dashboard/Request-Outing')}>
                    <Link to="/dashboard/outing-request">
                      <img src={reserve} width="30px" height="30px" alt="Request Outing" />
                      Request Outing
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Outing-Status')}>
                    <Link to="/dashboard/Outing-approval">
                      <img src={Status} width="30px" height="30px" alt="Outing Status" />
                      Outing Status
                    </Link>
                  </li>
                  <li className={isActive('/dashboard/Outing-Status')}>
                    <Link to="/dashboard/request-list">
                      <img src={RequestList} width="30px" height="30px" alt="Outing Status" />
                      Request List
                    </Link>
                  </li>
                </div>
              )}
            </li>
          </>
        )}
        <li className={isActive('/dashboard/faculty-details')}>
          <Link to="/dashboard/faculty-details">
            <img src={faculty} width="40px" height="40px" alt="Faculty Details" />
            Faculty Details
          </Link>
        </li>
        <li className={isActive('/dashboard/mail')}>
          <Link to="/dashboard/mail">
            <img src={mail} width="40px" height="40px" alt="Mail" />
            Mail
          </Link>
        </li>
        <li className={isActive('/dashboard/forms')}>
          <Link to="/dashboard/forms">
            <img src={others} width="40px" height="40px" alt="Other Forms" />
            Forms
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
