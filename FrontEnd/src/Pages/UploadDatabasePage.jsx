import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const UploadDatabasePage = () => {
  const [file, setFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to the backend
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the SQL file to the backend
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/db/upload-sql`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImportStatus('File uploaded and data imported successfully.');
      fetchTables();
    } catch (error) {
      console.error('Error uploading the file:', error);
      setImportStatus('Error importing data.');
    }
  };

  // Fetch tables after successful import
  const fetchTables = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/db/tables`);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  // Fetch data for the selected table
  const fetchTableData = async (tableName) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/db/tables/${tableName}`);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // Handle table selection
  const handleTableSelect = (e) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);
    if (tableName) {
      fetchTableData(tableName);
    }
  };

  return (
    <Container>
      <Title>Upload SQL File</Title>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleFileUpload}>Upload and Import</Button>
      <Status>{importStatus}</Status>

      {tables.length > 0 && (
        <>
          <TableSelect onChange={handleTableSelect}>
            <option value="">Select a Table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </TableSelect>

          {selectedTable && (
            <Table>
              <thead>
                <tr>
                  {Object.keys(tableData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
};

export default UploadDatabasePage;

// Styled Components

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #164863;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin: 20px 0;
  padding: 10px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 14px 20px;
  font-size: 1.1rem;
  color: white;
  background-color: #164863;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #007bff;
    transform: scale(1.05);
  }
`;

const Status = styled.p`
  color: green;
  font-size: 1.1rem;
  margin-top: 20px;
`;

const TableSelect = styled.select`
  width: 100%;
  padding: 1rem;
  margin-top: 20px;
  font-size: 1rem;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  border: 1px solid #ddd;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  thead {
    background-color: #164863;
    color: white;
  }
`;

