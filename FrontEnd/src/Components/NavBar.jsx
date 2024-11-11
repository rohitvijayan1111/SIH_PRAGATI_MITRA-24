import React from 'react';
import styled from 'styled-components';
import logo from '../assets/pragati.png';
import { getTokenData } from '../Pages/authUtils';
import { FiMenu } from 'react-icons/fi';

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 1% 10px 1.3%;
  background-color: #164863;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: aliceblue;
  z-index: 100;
`;

const LeftNav = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 480px) {
    margin-left:40px;
  }
`;

const MenuIcon = styled.div`
  display: none;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoImage = styled.img`
  width: 50px;
  height: 70px;

  @media (max-width: 768px) {
    width: 40px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 50px;
  }
`;

const LogoText = styled.a`
  color: aliceblue;
  font-weight: 700;
  font-size: 30px;
  margin-top: -1px;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const SubText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: aliceblue;
  margin-top: -4px;

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const AlignCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  h5 {
    margin: 0;
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`;

const LogoutButton = styled.button`
  background-color: #ff4b5c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #ff1f3a;
    transform: scale(1.05);
  }

  &:active {
    background-color: #d90429;
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 75, 92, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 5px 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 6px;
  }
`;

function NavBar({ onToggleSidebar }) {
  const tokenData = getTokenData();
  const department = tokenData ? tokenData.department : '';

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedIn');
    window.location.href = '/';
  };


  return (
    <Header>
      <LeftNav>
        <LogoImage src={logo} alt="Logo" />
        <div>
          <LogoText href='/dashboard'>PRAGATI MITRA</LogoText>
          <SubText>Simplifying Data, Amplifying Progress</SubText>
        </div>
      </LeftNav>
      <AlignCenter>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </AlignCenter>
    </Header>
  );
}

export default NavBar;
