import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: Arial, sans-serif;

  @media (max-width: 600px) {
    margin: 20px;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

function CreateFormPage() {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [sheetRange, setSheetRange] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/gform/forms`, { name, clientId, apiKey, sheetId, sheetRange });
    navigate('/dashboard/gforms');
  };

  return (
    <Container>
      <Title>Create New Form</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="text" placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} required />
        <Input type="text" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
        <Input type="text" placeholder="Sheet ID" value={sheetId} onChange={(e) => setSheetId(e.target.value)} required />
        <Input type="text" placeholder="Sheet Range" value={sheetRange} onChange={(e) => setSheetRange(e.target.value)} required />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default CreateFormPage;
