import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import google from '../assets/googleform.png';
import dashboard from '../assets/dashboard.png';
import mail from '../assets/mail.png';
import others from '../assets/others.png';
import chat from '../assets/chat.png';
import { getTokenData } from "../Pages/authUtils";
import dashboardIcon from '../assets/dashboard.png'; // Import your dashboard image
import achievementsIcon from '../assets/achievementss.png'; // Import your achievements image
import analysisIcon from '../assets/analysis.png'; // Import your analysis image


// Styled Components

const Container = styled.div`
  position: relative;
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 10px;
  z-index: 1000;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 15px;
    left: 5px;
  }
`;

const SidebarContainer = styled.div`
  background-color: white;
  min-height: 100vh; 
  width: 85px;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  left: 0;
  z-index: 10;
  transition: transform 0.3s ease-in-out;
  padding-top: 20px;
  overflow-y: auto;
  position: fixed;
  will-change: transform;
  
  @media (max-width: 768px) {
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    top: 0;
    left: 0;
    height: 100vh;
    width: 70px;
    z-index: 15;
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0px;
`;

const SidebarItem = styled.li`
  margin-bottom: 10px;
`;

const SidebarLink = styled(Link)`
  font-size: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px 5px;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  font-weight: 200;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    text-decoration: none; 
  }

  &:hover {
    background-color: #D0E8F0;
  }

  &.active {
    background-color: #D0E8F0;
    font-weight: bold;
  }
`;

const SidebarImage = styled.img`
  margin-bottom: 5px;
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const tokenData = getTokenData();
  let user = tokenData.role;

  const isActive = (path, exact = false) => {
    return exact
      ? location.pathname === path
        ? 'active'
        : ''
      : location.pathname.startsWith(path)
      ? 'active'
      : '';
  };

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeSidebar = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', closeSidebar);
    } else {
      document.removeEventListener('mousedown', closeSidebar);
    }
    return () => {
      document.removeEventListener('mousedown', closeSidebar);
    };
  }, [isOpen]);

  return (
    <Container>
      {/* Menu Icon for mobile view */}
      <MenuIcon onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </MenuIcon>

      {/* Overlay for capturing clicks outside the sidebar */}
      <Overlay isOpen={isOpen} onClick={handleOverlayClick} />


      <SidebarContainer isOpen={isOpen} ref={sidebarRef}>

        <SidebarList>

          <SidebarItem className={isActive('/dashboard', true)}>
            <SidebarLink 
              to="" 
              className={isActive('/dashboard', true) ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={dashboardIcon} width="40px" height="40px" alt="Dashboard" />
              Dashboard
            </SidebarLink>
          </SidebarItem>

          <SidebarItem className={isActive('/dashboard/faculty_Achievement')}>
            <SidebarLink 
              to="/dashboard/faculty_Achievement" 
              className={isActive('/dashboard/faculty_Achievement') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={achievementsIcon} width="40px" height="40px" alt="Mail" />
              Achievement
            </SidebarLink>
          </SidebarItem>

	<SidebarItem className={isActive('/dashboard/faculty_std_analysis')}>
            <SidebarLink 
              to="/dashboard/faculty_std_analysis" 
              className={isActive('/dashboard/faculty_std_analysis') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={analysisIcon} width="40px" height="40px" alt="Mail" />
              Analysis
            </SidebarLink>
          </SidebarItem>
          
          
        </SidebarList>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
