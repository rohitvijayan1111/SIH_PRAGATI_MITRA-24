import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaDatabase } from 'react-icons/fa';

const TablesPage = () => {
  const { database } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableContent, setTableContent] = useState([]);

  // Fetch tables when the database is changed
  useEffect(() => {
    axios.get(`http://localhost:3002/api/tables/${database}`)
      .then(response => setTables(response.data))
      .catch(error => console.error('Error fetching tables:', error));
  }, [database]);

  const handleTableChange = table => {
    setSelectedTable(table);
    // Fetch table content when a table is selected
    axios.get(`http://localhost:3002/api/table-content/${database}/${table}`)
      .then(response => setTableContent(response.data))
      .catch(error => console.error('Error fetching table content:', error));
  };

  return (
    <Container>
      <Header>
        <FaDatabase size={30} color='#164863' />
        <h1>Tables in {database}</h1>
      </Header>
      <TableSelect onChange={e => handleTableChange(e.target.value)} value={selectedTable}>
        <option value="">Select a table</option>
        {tables.map(table => (
          <option key={table} value={table}>{table}</option>
        ))}
      </TableSelect>
      <TableContent data={tableContent} />
    </Container>
  );
};

const TableContent = ({ data }) => {
  if (!data || data.length === 0) return <NoData>No data available</NoData>;

  const headers = Object.keys(data[0]);

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

// Styled Components

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  max-width: 100%;
  padding: 1rem;
  height:88%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.8rem;
    color: #333;
    margin: 0;
  }

  svg {
    color: #007BFF;
  }
`;

const TableSelect = styled.select`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  margin-bottom: 2rem;
  outline: none;
  transition: border-color 0.3s;
  &:hover, &:focus {
    border-color: #007BFF;
  }

  option {
    padding: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  border-radius: 8px;
  margin-top: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;

  thead {
    background-color: #164863;
    color: white;
    text-align: left;
    font-weight: 600;
  }

  th, td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const NoData = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

export default TablesPage;
