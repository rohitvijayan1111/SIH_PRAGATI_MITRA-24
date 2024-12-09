import React, { useState, useEffect } from 'react';
import PrincipalBC from '../Components/Admin-Component/PrincipalBC';
import axios from 'axios';
import PrincipalFPC from '../Components/Admin-Component/PrincipalFPC';
import PrincipalSPC from '../Components/Admin-Component/PrincipalSPC';
import DepartmentList from '../Components/Admin-Component/DepartmentList';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Dashboard_admin = () => {
  const [adminacademicYears, setadminAcademicYears] = useState([]);
  const [adminselectedYear, setadminSelectedYear] = useState('');
  const [adminstudentDetails, setadminStudentDetails] = useState([]);
  const [adminfacultyDetails, setadminFacultyDetails] = useState([]);
  const [adminstudentYrsDetails, setadminStudentYrsDetails] = useState([]);
  const [adminshowGraphs, setadminShowGraphs] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/graphs/academicyear`);
        const years = response.data;
        setadminAcademicYears(years);
        const defaultYear = years[years.length - 1];
        setadminSelectedYear(defaultYear);
        fetchadminStudentData(defaultYear);
        fetchadminStaffData();
        fetchadminStudentyrsData();
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    }

    fetchData();

    return () => {
      setadminAcademicYears([]);
      setadminSelectedYear('');
      setadminStudentDetails([]);
      setadminFacultyDetails([]);
      setadminStudentYrsDetails([]);
      setadminShowGraphs(false);
    };
  }, []);

  useEffect(() => {
    setadminShowGraphs(true);
  }, [adminselectedYear]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setadminSelectedYear(year);
    fetchadminStudentData(year);
  };

  const fetchadminStudentData = async (year) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/graphs/adminstudentsgraph`, { academic_year: year });
      setadminStudentDetails(transformData(response.data));
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const departmentMapping = {
    'Artificial Intelligence and Data Science': 'AD',
    'Computer Science and Business Systems': 'CB',
    'Computer Science and Design': 'CD',
    'Civil Engineering': 'CE',
    'Computer Science and Engineering': 'CS',
    'Electronics and Communication Engineering': 'EC',
    'Electrical and Electronics Engineering': 'EE',
    'Electronics and Instrumentation Engineering': 'EI',
    'Information Technology': 'IT',
    'Mechanical Engineering': 'ME',
  };

  const transformData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department, 
      Placed: item.placed_students,
      NotPlaced: item.yet_placed_students,
      HS: item.higher_studies_students,
    }));
  };

  const fetchadminStaffData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/graphs/adminstaffgraph`, {});
      console.log(response.data);
      const transformedData = transformadminstaffData(response.data);
      console.log('Transformed Staff Data:', transformedData); 
      setadminFacultyDetails(transformedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  
  const transformadminstaffData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department, 
      value: item.Professor + item.Associate_Professor + item.Assistant_Professor,
      Professor: item.Professor,
      Associate_Professor: item.Associate_Professor,
      Assistant_Professor: item.Assistant_Professor
    }));
  };

  const fetchadminStudentyrsData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/graphs/adminstudentsyrsgraph`, {});
      setadminStudentYrsDetails(transformadminyrsData(response.data));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const transformadminyrsData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.department] || item.department,
      value: item.firstyearcount + item.secondyearcount + item.thirdyearcount + item.fourthyearcount,
      First_year: item.firstyearcount,
      Second_year: item.secondyearcount,
      Third_year: item.thirdyearcount,
      Fourth_year: item.fourthyearcount,
    }));
  };

  return (
    <div>
      <DropDownButton value={adminselectedYear} onChange={handleYearChange}>
        {adminacademicYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </DropDownButton>
      <GridContainer>
        <GridWrapper>
          <GridItem title="Faculty">
          <Title>Faculty</Title>
            <PrincipalFPC data={adminfacultyDetails} />
          </GridItem>
          <GridItem title="Placement">
          <Title>Placement</Title>
            <PrincipalBC data={adminstudentDetails} />
          </GridItem>
          <GridItem title="Student">
          <Title>Student</Title>
            <PrincipalSPC data={adminstudentYrsDetails} />
          </GridItem>
        </GridWrapper>
      </GridContainer>
      <DepartmentList />
    </div>
  );
};

const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    width: 90%;
  }
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;  /* Default to a single column for small screens */
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);  /* Two columns for medium screens */
    gap: 30px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);  /* Three columns for large screens */
    gap: 40px;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  height: auto;
  min-height: 350px;
  max-width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    min-width: 100%;  /* Ensure the grid item fills the available space on smaller screens */
    padding: 12px;
    min-height: 300px;  /* Reduce height on mobile to avoid overflow */
  }

  @media (min-width: 1024px) {
    min-width: 320px;
  }


  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1d6ca3;
    margin-bottom: 15px;
  }

  /* Add Title Style */
  ${({ title }) => title && `
    h3 {
      font-size: 1.6rem;
      margin-bottom: 20px;
    }
  `}
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
`;

const DropDownButton = styled.select`
  margin: 10px;
  background-color: #4d4d4d;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3b3b3b;
  }

  &:focus {
    outline: none;
  }

  option:hover {
    background-color: #f0a0a0;
  }
`;

const CuteButton = styled.button`
  margin-top: 10px;
  background-color: #164863;
  border: none;
  border-radius: 12px;
  color: white;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f6f98;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #164863;
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export default Dashboard_admin;
