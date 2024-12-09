import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import styled from 'styled-components';

// Styled Components
const MainContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    padding: 30px;
    background: linear-gradient(135deg, #ece9e6, #ffffff);
    min-height: 100vh;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ChartContainer = styled.div`
    width: 45%;
    background: #ffffff;
    height: 500px;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        width: 90%;
    }
`;

const Title = styled.h2`
    color: #34495e;
    font-family: 'Roboto', sans-serif;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 1px 2px 5px rgba(0, 0, 0, 0.15);
`;


const DropdownContainer = styled.div`
    margin-bottom: 20px;
    text-align: center;
`;

const DropdownLabel = styled.label`
    font-size: 18px;
    color: #34495e;
    margin-right: 10px;
    font-weight: bold;
`;

const Dropdown = styled.select`
    padding: 10px;
    font-size: 16px;
    border: 2px solid #3498db;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:hover {
        border-color: #1abc9c;
    }
`;

// Pie Chart Colors
const colors = [
    '#4CAF50', 
    '#F44336', 
    '#FFC107', 
    '#2196F3', 
    '#9C27B0', 
];

// Bar Chart Component
const BarGraph = ({ title, data, isSemesterGraph, selectedBatch, setSelectedBatch }) => (
    <ChartContainer>
        <Title>{title}</Title>
        {isSemesterGraph && (
            <DropdownContainer>
                <DropdownLabel htmlFor="batch-select">Select Batch:</DropdownLabel>
                <Dropdown
                    id="batch-select"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                >
                    <option value="2021-2025">2021-2025</option>
                    <option value="2022-2026">2022-2026</option>
                    <option value="2023-2027">2023-2027</option>
                    <option value="2024-2028">2024-2028</option>
                </Dropdown>
            </DropdownContainer>
        )}
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const PieGraph = ({ title, data, selectedFilter, setSelectedFilter, filterOptions, filterLabel }) => (
    <ChartContainer>
        <Title>{title}</Title>
        <DropdownContainer>
            <DropdownLabel htmlFor="filter-select">{filterLabel}:</DropdownLabel>
            <Dropdown
                id="filter-select"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
            >
                {filterOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </Dropdown>
        </DropdownContainer>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) => entry.name}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const Faculty_Std_Analysis = () => {
    const [selectedBatch, setSelectedBatch] = useState('2021-2025');
    const [selectedStudentDepartment, setSelectedStudentDepartment] = useState();
    const [selectedFacultyDepartment, setSelectedFacultyDepartment] = useState();
    const [semesterData, setSemesterData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [facultyData, setFacultyData] = useState([]);

    const fetchGraphData = (batch) => {
        const data = {
            '2021-2025': [
                { name: 'Sem 1', value: 65 },
                { name: 'Sem 2', value: 70 },
                { name: 'Sem 3', value: 72 },
                { name: 'Sem 4', value: 75 },
                { name: 'Sem 5', value: 77 },
                { name: 'Sem 6', value: 80 },
                { name: 'Sem 7', value: 0 },
                { name: 'Sem 8', value: 0 },
            ],
            '2022-2026': [
                { name: 'Sem 1', value: 60 },
                { name: 'Sem 2', value: 65 },
                { name: 'Sem 3', value: 67 },
                { name: 'Sem 4', value: 70 },
                { name: 'Sem 5', value: 0 },
                { name: 'Sem 6', value: 0 },
                { name: 'Sem 7', value: 0 },
                { name: 'Sem 8', value: 0 },
            ],
            '2023-2027': [
                { name: 'Sem 1', value: 55 },
                { name: 'Sem 2', value: 60 },
                { name: 'Sem 3', value: 62 },
                { name: 'Sem 4', value: 0 },
                { name: 'Sem 5', value: 0 },
                { name: 'Sem 6', value: 0 },
                { name: 'Sem 7', value: 0 },
                { name: 'Sem 8', value: 0 },
            ],
            '2024-2028': [
                { name: 'Sem 1', value: 50 },
                { name: 'Sem 2', value: 0 },
                { name: 'Sem 3', value: 0 },
                { name: 'Sem 4', value: 0 },
                { name: 'Sem 5', value: 0 },
                { name: 'Sem 6', value: 0 },
                { name: 'Sem 7', value: 0 },
                { name: 'Sem 8', value: 0 },
            ],
        };
        return data[batch];
    };

    const fetchStudentData = async (department) => {
        try {
            const response = await fetch(
                `http://localhost:3000/facultystdAnalysis/student-achievements-count?department=${department}`
            );
            const data = await response.json();
            return data.map((item) => ({ name: item.achievementType, value: item.count }));
        } catch (error) {
            console.error("Error fetching student data:", error);
            return [];
        }
    };

    const fetchFacultyData = async (department) => {
        try {
            const response = await fetch(
                `http://localhost:3000/facultystdAnalysis/faculty-achievements-count?department=${department}`
            );
            const data = await response.json();
            return data.map((item) => ({ name: item.achievement_type, value: item.count }));
        } catch (error) {
            console.error("Error fetching faculty data:", error);
            return [];
        }
    };

    useEffect(() => {
        setSemesterData(fetchGraphData(selectedBatch));
    }, [selectedBatch]);

    useEffect(() => {
        fetchStudentData(selectedStudentDepartment).then((data) => setStudentData(data));
    }, [selectedStudentDepartment]);

    useEffect(() => {
        fetchFacultyData(selectedFacultyDepartment).then((data) => setFacultyData(data));
    }, [selectedFacultyDepartment]);

    return (
        <MainContainer>
            <BarGraph 
                title="Semester Average" 
                data={semesterData}
                 isSemesterGraph={true}
                  selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch} 
                   />
            <PieGraph 
                title="Student Achievements Analysis" 
                data={studentData} 
                selectedFilter={selectedStudentDepartment} 
                setSelectedFilter={setSelectedStudentDepartment} 
                filterOptions={["IT", "CSE", "ECE", "EEE"]} 
                filterLabel="Select Branch" 
            />
            <PieGraph 
                title="Faculty Achievements Analysis" 
                data={facultyData} 
                selectedFilter={selectedFacultyDepartment} 
                setSelectedFilter={setSelectedFacultyDepartment} 
                filterOptions={["IT", "CSE", "ECE", "EEE"]} 
                filterLabel="Select Branch" 
            />
        </MainContainer>
    );
};

export default Faculty_Std_Analysis;
