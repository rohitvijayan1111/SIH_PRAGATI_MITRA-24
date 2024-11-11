import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1] || 'Dashboard';

  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <NavContainer>
      <Header>{capitalizeWords(lastPart.replaceAll("-", " "))}</Header>
      <Breadcrumbs>
        {capitalizeWords(location.pathname.replace("/", "").replaceAll("-", " ").replaceAll("/", " > "))}
      </Breadcrumbs>
    </NavContainer>
  );
};

export default Navigation;

const NavContainer = styled.div`
  margin-top: 91px;
  height: 50px;
  background-color: #D0E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  color: #808080;
  width:100%;
  @media (max-width: 768px) {
    width:100%;
    flex-direction: row;
    align-items: flex-start;
    height: auto;
    padding: 10px;
    margin-top:71px;
  }
`;

const Header = styled.p`
  font-weight: 500;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Breadcrumbs = styled.p`
  font-size: 16px;
  color: #707070;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
