import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import HashLoader from 'react-spinners/HashLoader';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Roboto', sans-serif;
  background-color: #f4f6f9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  position: relative;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 2rem;
  color: #164863;
  margin-bottom: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 45%;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  flex: 1;
  margin-left: 10px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 30px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;

  th, td {
    padding: 15px;
    border: 1px solid #ddd;
    text-align: left;
    transition: background-color 0.2s ease, color 0.3s ease;
  }

  th {
    background-color: #164863;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }

  td {
    font-size: 1rem;
    color: #555;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;

  }

  @media (max-width: 768px) {
    th, td {
      padding: 12px;
      font-size: 0.9rem;
    }
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 10px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const RenderFormPage = () => {
  const { id } = useParams();
  const [formDetails, setFormDetails] = useState(null);
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gform/forms/${id}`);
        setFormDetails(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch form details. Please try again.');
        setIsLoading(false);
      }
    };
    fetchFormDetails();
  }, [id]);

  useEffect(() => {
    if (!formDetails) return;

    function initClient() {
      gapi.client
        .init({
          apiKey: formDetails.apiKey,
          clientId: formDetails.clientId,
          scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        })
        .then(() => gapi.client.load('sheets', 'v4'))
        .then(() => {
          setIsApiLoaded(true);
          fetchData();
        })
        .catch(error => {
          setErrorMessage('Invalid credentials. Please check your API key, client ID, and sheet ID.');
          setIsLoading(false);
          console.error('Error initializing gapi client:', error);
        });
    }

    const fetchData = () => {
      if (!isApiLoaded) return;
      gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: formDetails.sheetId,
          range: formDetails.sheetRange,
        })
        .then(response => {
          const data = response.result.values || [];
          setFormData(data);
          setFilteredData(data); 
          setIsLoading(false); 
        })
        .catch(error => {
          setErrorMessage('Error fetching data from the sheet. Please check your credentials.');
          setIsLoading(false);
          console.error('Error fetching data:', error);
        });
    };

    gapi.load('client:auth2', initClient);
  }, [formDetails, isApiLoaded]);

  useEffect(() => {
    if (!selectedColumn || !searchQuery) {
      setFilteredData(formData);
      return;
    }
    const columnIndex = formData[0]?.indexOf(selectedColumn);
    if (columnIndex === -1) return;

    const filtered = formData.filter((row, index) => 
      index === 0 || (row[columnIndex] && row[columnIndex].toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [selectedColumn, searchQuery, formData]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedColumn('');
    setFilteredData(formData);
  };

  return (
    <Container>
      <Title>Google Form Data</Title>

      {isLoading && (
        <LoadingOverlay>
          <LoaderContainer>
            <HashLoader color="#164863" size={90} />
          </LoaderContainer>
        </LoadingOverlay>
      )}

      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}

      {isApiLoaded && !errorMessage && (
        <SearchContainer>
          <Select value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)}>
            <option value="">Select Column</option>
            {formData[0] && formData[0].map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </Select>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={!selectedColumn}
          />
          <ResetButton onClick={handleReset}>Reset</ResetButton>
        </SearchContainer>
      )}

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {formData[0] && formData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </Container>
  );
};

export default RenderFormPage;
