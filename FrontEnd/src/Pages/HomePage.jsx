import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FormList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FormItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FormName = styled.span`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
  margin:0 auto;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ViewLink = styled(Link)`
  color: white;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #2196f3;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #2196f3;
  margin: 5px;
  flex-grow: 1;
  text-align: center;
  font-size: 0.9rem;

  &:hover {
    background-color: #1565c0;
    color: white;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 5px 0;
  }
`;

const DeleteButton = styled.button`
  color: white;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  background-color: #f44336;
  cursor: pointer;
  margin: 5px;
  flex-grow: 1;
  text-align: center;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 5px 0;
  }
`;

const Button = styled.button`
  display: block;
  margin: 20px auto;
  padding: 8px 15px;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;

  &:hover {
    background-color: #45a049;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 0;
    font-size: 1.1rem;
  }
`;

function HomePage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const response = await axios.get('http://localhost:3000/gform/forms');
    setForms(response.data);
  };

  const handleDelete = async (formId) => {
    try {
      await axios.delete(`http://localhost:3000/gform/forms/${formId}`);
      setForms(forms.filter(form => form.id !== formId)); // Remove deleted form from list
    } catch (error) {
      console.error('Failed to delete form:', error);
    }
  };

  return (
    <Container>
      <Title>Google Forms</Title>
      <Link to="gcreate-form" style={{ textDecoration: 'none' }}>
        <Button>Create New Form</Button>
      </Link>
      <FormList>
        {forms.map(form => (
          <FormItem key={form.id}>
            <FormName>{form.name}</FormName>
            <ActionButtons>
              <ViewLink to={`/dashboard/gforms/render-form/${form.id}`}>View Form</ViewLink>
              <DeleteButton onClick={() => handleDelete(form.id)}>Delete Form</DeleteButton>
            </ActionButtons>
          </FormItem>
        ))}
      </FormList>
    </Container>
  );
}

export default HomePage;
