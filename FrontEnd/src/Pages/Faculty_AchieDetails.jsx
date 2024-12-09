import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const AchievementDetailsContainer = styled.div`
    margin: 20px;
`;

const TableContainer = styled.div`
    padding: 20px;
    display: flex;
    justify-content: center;
`;

const AchievementTable = styled.table`
    max-width: 1400px;
    width: 100%;
    border-collapse: collapse;
    margin: 20px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: center;
    background-color: #002b5b;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
`;

const TableCell = styled.td`
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: center;

    &:nth-child(even) {
        background-color: #f7f9fc;
    }

    &:hover {
        background-color: #e2e6ea;
        cursor: pointer;
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
`;

const Faculty_AchieDetails = () => {
    const { type } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(type)
    const tableConfig = {
        "Research Papers": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Paper Title", field: "title" },
            { header: "Authors Name", field: "authors" },
            { header: "Journal Name", field: "journal" },
            { header: "Publication Date", field: "publication_date" },
            { header: "Research Area", field: "research_area" },
            { header: "Paper Details", field: "paper_type" },
           
            { header: "Conference Details", field: "conference_details" },
            { header: "Document", field: "document_path" }
        ],
        "Patents": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Patent Number", field: "patent_number" },
            { header: "Title", field: "title" },
            { header: "Inventors", field: "inventors" }, 
            { header: "Patent Type", field: "patent_type" },
            { header: "Filed Date", field: "filed_date" },
            { header: "Patent Status", field: "patent_status" },
            { header: "Issue Date", field: "issue_date" },
            { header: "Document", field: "document_path" }
        ],
        "Award Received": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Award Title", field: "award_title" },
            { header: "Awarding Body", field: "awarding_body" },
            { header: "Date", field: "date" },
            { header: "Category", field: "award_category" },
            { header: "Description", field: "award_description" },
            { header: "Recipient", field: "recipient" },
            { header: "Recognition Level", field: "recognition_level" },
            { header: "Award Image", field: "document_path" }
        ],
        "Conference": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Conference Title", field: "conference_title" },
            { header: "Presenter", field: "presenter" },
            { header: "Location", field: "location" },
            { header: "Date Presented", field: "date_presented" },
            { header: "Topic", field: "topic" },
            { header: "Organizer", field: "organizer" },
            { header: "Certificate", field: "document_path" }
        ],
        "Book Published": [
            { header: "S.No", field: "id" },
            { header: "Department", field: "department" },
            { header: "Book Title", field: "book_title" },
            { header: "Author", field: "author_name" },  
            { header: "Publication Date", field: "publication_date" },
            { header: "Publisher", field: "publisher" },
            { header: "ISBN", field: "isbn" },
            { header: "Category", field: "book_category" },  
            { header: "Document", field: "document_path" }
        ]
    };
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/achievements/${type}`);
                const result = await response.json();
                setData(result);
                setLoading(false);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const headers = tableConfig[type] || [];

    return (
        <AchievementDetailsContainer>
            <Title>{type} Achievements</Title>
            <TableContainer>
                <AchievementTable>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <TableHeader key={index}>{header.header}</TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
    {data.map((item, rowIndex) => (
        <tr key={item.id}>
            {headers.map((header, colIndex) => (
                <TableCell key={colIndex}>
                    {header.field === "document_path" ? (
                        <a
                            href={`http://localhost:3000/${item[header.field]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Document
                        </a>
                    ) : header.field === "id" ? (
                        <div>{rowIndex + 1}</div> 
                    ) : ["date", "publication_date", "filed_date", "issue_date", "date_presented"].includes(header.field) ? (
                        item[header.field]
                            ? new Date(item[header.field]).toLocaleDateString('en-CA') 
                            : "N/A" 
                    ) : (
                        item[header.field]
                    )}
                </TableCell>
            ))}
        </tr>
    ))}
</tbody>



                </AchievementTable>
            </TableContainer>
        </AchievementDetailsContainer>
    );
};

export default Faculty_AchieDetails;
