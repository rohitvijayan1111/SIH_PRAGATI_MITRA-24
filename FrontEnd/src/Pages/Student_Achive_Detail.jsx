import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';


const PageContainer = styled.div`

    padding-top: 25px;
    margin: 0;
    background-color: #f0f4f8;
    font-family: Arial, sans-serif;

    @media (max-width: 768px) {
        padding-top: 15px;
    }
`;

const TableContainer = styled.div`
    padding: 20px;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const AchievementTable = styled.table`
    max-width: 1400px;
    width: 100%;
    border-collapse: collapse;
    margin: 20px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        margin: 10px auto;
        box-shadow: none;
        border: 1px solid #ddd;
    }
`;

const TableHeader = styled.th`
    padding: 12px 15px;
    background-color: #002b5b;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    border: 1px solid #ddd;
    text-align: left;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 10px;
    }
`;

const TableCell = styled.td`
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 10px;
    }
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f7f9fc;
    }

    &:hover {
        background-color: #f1f5f9;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        &:hover {
            background-color: #f7f9fc;
        }
    }
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.8rem;
    color: #004080;
    margin-bottom: 20px;
    font-weight: bold;
    position: relative;

    &::after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background-color: #004080;
        margin: 8px auto 0;
        border-radius: 2px;
    }

    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-bottom: 15px;

        &::after {
            width: 40px;
        }
    }
`;


const Student_Achive_Detail = () => {
    const { type } = useParams();
    const [achievementData, setAchievementData] = useState([]);
    const [error, setError] = useState(null);

    const tableConfig = {
        Symposium: [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Event Name", field: "title" },
            { header: "Team Members", field: "teamMembers" },
            { header: "Location", field: "location" },
            { header: "Organizer(s)", field: "organizer" },
            { header: "Event Type", field: "event_type" },
            { header: "Achievement", field: "achievement" },
            { header: "Start Date", field: "startDate" },
            { header: "End Date", field: "endDate" },
            { header: "Outcomes", field: "outcomes" },
            { header: "Document", field: "documentLink" },
        ],
        Patent: [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Patent Number", field: "patentnumber" },
            { header: "Title of Invention", field: "title" },
            { header: "Inventors' Names", field: "teamMembers" }, 
            { header: "Start Date", field: "startDate" },
            { header: "End Date", field: "endDate" },
            { header: "Outcomes", field: "outcomes" },
            { header: "Document", field: "documentLink" },
        ],
        "Paper Publication": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Paper Title", field: "title" },
            { header: "Authors Name", field: "teamMembers" },
            { header: "Journal Name", field: "conferenceDetails" },
            { header: "Publication Date", field: "startDate" },
            { header: "Research Area", field: "research_area" }, 
            { header: "Start Date", field: "startDate" },
            { header: "End Date", field: "endDate" },
            { header: "Paper Details", field: "paperDetails" },
            { header: "Outcomes", field: "outcomes" },
            { header: "Document", field: "documentLink" },
        ],
        "Hackathon": [
            { header: "S.No", field: "id" },
              { header: "Department", field: "department" },
            { header: "Project Title", field: "title" },
            { header: "Team Members", field: "teamMembers" },
            { header: "Technology Used", field: "technologyUsed" },
            { header: "Start Date", field: "startDate" },
            { header: "End Date", field: "endDate" },
            { header: "Outcomes", field: "outcomes" },
            { header: "Document", field: "documentLink" },
        ],
    };

    const headers = tableConfig[type] || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/studentAchievements/details/${type}`);
                setAchievementData(response.data || []);
            } catch (error) {
                console.error("Error fetching achievements:", error);
                setError("Unable to load data. Please try again later.");
            }
        };

        fetchData();
    }, [type]);

    return (
        <PageContainer>
            <Title>{type} Details</Title>
            {error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : (
                <TableContainer>
                    <AchievementTable>
                    <thead>
  <tr>
    {headers.map((col) => (
      <TableHeader key={col.field}>{col.header}</TableHeader>
    ))}
  </tr>
</thead>
<tbody>
  {achievementData.length > 0 ? (
    achievementData.map((item, index) => (
      <TableRow key={item.id}>
        {headers.map((col) => (
       <TableCell key={col.field}>
  {col.field === "documentLink" ? (
    <a
      href={`http://localhost:3000/${item[col.field]}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Document
    </a>
  ) : col.field === "id" ? (
    <div>{index + 1}</div>
  ) : col.field === "startDate" || col.field === "endDate" ? (
    new Date(item[col.field]).toLocaleDateString('en-CA') // Formats as YYYY-MM-DD
  ) : (
    item[col.field]
  )}
</TableCell>

       
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={headers.length} style={{ textAlign: 'center', color: '#666' }}>
        No achievements found.
      </TableCell>
    </TableRow>
  )}
</tbody>

                    </AchievementTable>
                </TableContainer>
            )}
        </PageContainer>
    );
};

export default Student_Achive_Detail;
