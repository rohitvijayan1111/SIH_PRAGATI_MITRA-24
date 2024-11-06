import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import faculty from '../assets/faculty.png';
import dashboard from '../assets/dashboard.png';
import mail from '../assets/mail.png';
import others from '../assets/others.png';
import { getTokenData } from "../Pages/authUtils";

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
  z-index: 100;

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

      {/* Sidebar with toggle for mobile view */}
      <SidebarContainer isOpen={isOpen} ref={sidebarRef}>
        <SidebarList>
          <SidebarItem className={isActive('/dashboard', true)}>
            <SidebarLink 
              to="/dashboard" 
              className={isActive('/dashboard', true) ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={dashboard} width="40px" height="40px" alt="Dashboard" />
              Dashboard
            </SidebarLink>
          </SidebarItem>
          <SidebarItem className={isActive('/dashboard/mail')}>
            <SidebarLink 
              to="/dashboard/mail" 
              className={isActive('/dashboard/mail') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={mail} width="40px" height="40px" alt="Mail" />
              Mail
            </SidebarLink>
          </SidebarItem>
          <SidebarItem className={isActive('/dashboard/forms')}>
            <SidebarLink 
              to="/dashboard/forms" 
              className={isActive('/dashboard/forms') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <SidebarImage src={others} width="40px" height="40px" alt="Other Forms" />
              Forms
            </SidebarLink>
          </SidebarItem>
        </SidebarList>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
