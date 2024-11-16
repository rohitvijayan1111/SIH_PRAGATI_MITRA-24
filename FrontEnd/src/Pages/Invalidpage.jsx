import React from 'react';
import styled from 'styled-components';

const NotFoundPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
`;

const Heading = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  margin: 20px;
  border-radius: 50%;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #3e8e41;
  }
`;

const Invalidpage = () => {
  return (
    <NotFoundPage>
      <Heading>404: Page Not Found</Heading>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Image src="https://i.imgur.com/qIufhof.png" alt="404 astronaut" />
      <p>But don't worry, you can still explore the galaxy!</p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
      <Button onClick={() => (window.location.href = '/dashboard')}>Go Home</Button>
    </NotFoundPage>
  );
};

export default Invalidpage;
