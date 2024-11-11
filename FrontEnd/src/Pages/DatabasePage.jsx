import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components for the page
const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  height: auto;
  background: #f4f7fb;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  color: #164863;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 800px;

  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #164863;
  color: white;
  text-align: left;
  font-size: 1.2rem;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableData = styled.td`
  padding: 12px;
  text-align: left;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  color: white;
  background-color: #164863;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #006bb3;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DatabasePage = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of databases on component mount
    axios.get('http://localhost:3002/api/databases')
      .then(response => setDatabases(response.data))
      .catch(error => console.error('Error fetching databases:', error));
  }, []);

  const handleDatabaseSelection = (dbName) => {
    axios.post('http://localhost:3002/api/select-database', { dbName })
      .then(() => navigate(`/dashboard/dynamic/tables/${dbName}`))
      .catch(error => console.error('Error selecting database:', error));
  };

  return (
    <Container>
      <Heading>Select a Database</Heading>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Database Name</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {databases.map(db => (
              <TableRow key={db}>
                <TableData>{db}</TableData>
                <TableData>
                  <Button onClick={() => handleDatabaseSelection(db)}>
                    View
                  </Button>
                </TableData>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DatabasePage;
