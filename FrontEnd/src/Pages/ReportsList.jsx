import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TitleC = styled.h2`
  text-align: center;
  color: #fff;
  background-color: #164863;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ReportCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportInfo = styled.div`
  flex: 1;
`;

const StyledButton = styled.button`
  text-align: center;
  padding: 10px 15px;
  background-color: #164863;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/report/getall');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleViewClick = (reportId) => {
    navigate(`/dashboard/report-generation`,{state:reportId}); // Navigate to the report generation page
  };

  return (
    <Container>
      <TitleC>Reports List</TitleC>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <ReportCard key={report.id}>
              <ReportInfo>
                <strong>{report.name}</strong>
                <p>Deadline: {new Date(report.deadline).toLocaleDateString()}</p>
              </ReportInfo>
              <StyledButton onClick={() => handleViewClick(report.id)}>View</StyledButton>
            </ReportCard>
          ))}
 
        </ul>
      )}
    </Container>
  );
};

export default ReportsList;