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
  const clientId = "598907744656-hqnn5lp4b253gg89qifscbd6f9o0reo2.apps.googleusercontent.com";
  const apiKey = "AIzaSyD2X85pKzFNcGWhDcZ9ZjbA-D3M0GfRgAY";
  const [sheetUrl, setSheetUrl] = useState('');
  const navigate = useNavigate();

  // Function to extract sheet ID from Google Sheets URL
  const extractSheetId = (url) => {
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Generate the dynamic range based on form name
  const generateSheetRange = (formName) => {
    return `${formName}!B1:C100`; // Automatically appends '!B2:C100' to the form name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract the sheet ID from the provided URL
    const extractedSheetId = extractSheetId(sheetUrl);
    if (!extractedSheetId) {
      alert("Invalid Google Sheets URL. Please provide a valid URL.");
      return;
    }

    // Generate the sheet range dynamically
    const sheetRange = generateSheetRange(name);

    // Make API request
    await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/gform/forms`, { 
      name, 
      clientId, 
      apiKey, 
      sheetId: extractedSheetId, 
      sheetRange 
    });

    // Navigate to the forms dashboard
    navigate('/dashboard/gforms');
  };

  return (
    <Container>
      <Title>Create New Form</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Form Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Google Sheets URL"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          required
        />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default CreateFormPage;
