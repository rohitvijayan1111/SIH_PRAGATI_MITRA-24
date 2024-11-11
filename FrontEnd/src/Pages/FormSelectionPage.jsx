import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFileAlt, FaGoogle, FaDatabase } from 'react-icons/fa';

const FormSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Select a Form Type</Title>
      <CardWrapper>
        <FormCard onClick={() => navigate('/dashboard/forms')}>
          <IconContainer>
            <FaFileAlt />
          </IconContainer>
          <CardTitle>Ordinary Form</CardTitle>
          <CardDescription>
            Use this form for manual entry or import from Excel.
          </CardDescription>
        </FormCard>

        <FormCard onClick={() => navigate('/dashboard/gforms')}>
          <IconContainer>
            <FaGoogle />
          </IconContainer>
          <CardTitle>Google Forms Link</CardTitle>
          <CardDescription>
            Link an existing Google Form for data collection.
          </CardDescription>
        </FormCard>

        <FormCard onClick={() => navigate('/dashboard/dynamic')}>
          <IconContainer>
            <FaDatabase />
          </IconContainer>
          <CardTitle>Database Integration</CardTitle>
          <CardDescription>
            Integrate details from an existing database for automated data collection.
          </CardDescription>
        </FormCard>
      </CardWrapper>
    </Container>
  );
};

export default FormSelectionPage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #f4f7fc;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #164863;
  margin-bottom: 40px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const CardWrapper = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1200px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FormCard = styled.div`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  width: 350px;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const IconContainer = styled.div`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.5px;
`;
