import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Dashboard_hod.css';
import PieChartComponent from '../Components/Department-Component/FacultyCountPieChart';
import StudentCountPieChart from '../Components/Department-Component/StudentsCountPieChart';
import PlacementBarGraph from '../Components/Department-Component/PlacementBarGraph';
import {Link} from 'react-router-dom'; 
import { getTokenData } from './authUtils';
import CustomBar from './CustomBar';
import CustomPie from './CustomPie';

function DashBoard_hod() {
  const tokenData = getTokenData();
    if (!tokenData) {
      return <Navigate to="/" />;
    }
    const {department, userId} = tokenData;
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [studentDetails, setStudentDetails] = useState([]);
  const [facultyDetails, setFacultyDetails] = useState([]);
  const [studentYrsDetails, setStudentYrsDetails] = useState([]);
  const [customGraphs, setCustomGraphs] = useState([]);
  useEffect(() => {
    fetchAcademicYears();
    fetchCustomGraphs(userId);
  }, []);
  const customTransformData = (data) => {
    // Assuming custom data is an array of objects with a name and value
    return data.map(item => ({
      name: item.name,
      value: item.value
    }));
  };
  
  const fetchAcademicYears = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/academicyear");
      const years = response.data;
      setAcademicYears(years);
      const defaultYear = years[years.length - 1];
      setSelectedYear(defaultYear);
      fetchStudentData(defaultYear);
      fetchStaffData();
      fetchStudentyrsData(defaultYear);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchCustomGraphs = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/dashboard/getgraphs/${userId}`);
      console.log("response received");
      console.log(response.data);
      setCustomGraphs(response.data.graphs);
    } catch (error) {
      console.error("Error fetching custom graphs:", error);
    }
  };
  const renderGraph = (graph) => {
    console.log("The graph is "+graph.graph_type);
    switch (graph.graph_type) {
      case 'pie':
        return <CustomPie data={customTransformData(graph.data)} colorSettings={graph.colorSettings} />;
      case 'bar':
        return <CustomBar data={customTransformData(graph.data)} colorSettings={graph.colorSettings} />;
      // Additional cases as needed
      default:
        return <p>Unsupported graph type: {graph.graph_type}</p>;
    }
  };
  

  
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    fetchStudentData(year);
    fetchStudentyrsData(year);
  };

  const fetchStudentData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsgraph", { dept: department, academic_year: year });
      setStudentDetails(transformData(response.data));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const transformData = (data) => {
    return [
      { status: 'Placed', students: data.placed_students },
      { status: 'Yet Placed', students: data.yet_placed_students },
      { status: 'HS', students: data.higher_studies_students },
    ];
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/staffgraph", { dept: department });
      const transformedData = transformStaffData(response.data);
      setFacultyDetails(transformedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  //TO FIX HERE
  const transformStaffData = (data) => {
    return [
      { name: "Professor", value: data.Assistant_Professor},
      { name: "Associate Professor", value: data.Associate_Professor},
      { name: "Assistant Professor", value: data.Assistant_Professor},
    ];
  };

  const fetchStudentyrsData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsyrsgraph", { dept: department, academic_year: year });
      setStudentYrsDetails(transformYrsData(response.data));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const transformYrsData = (data) => {
    return [
      { name: "1st Year", value: data.firstyear },
      { name: "2nd Year", value: data.secondyear },
      { name: "3rd Year", value: data.thirdyear },
      { name: "4th Year", value: data.fourthyear }
    ];
  };

  return (
    <div>
      <select className='dropbutton' value={selectedYear} onChange={handleYearChange}> 
        {academicYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))} 
      </select>

      <div className="grid-container">
        <div className='home-grid-db'>
          <GridItem title="Faculty">
            <PieChartComponent data={facultyDetails} />
          </GridItem>
          <GridItem title="Placement">
            <PlacementBarGraph Details={studentDetails} />
            <Link to="Placements">
                <button className="cute-button">View</button>
            </Link>
          </GridItem>
          <GridItem title="Student">
            <StudentCountPieChart data={studentYrsDetails} />
          </GridItem>
          {customGraphs.map((graph, index) => (
          <GridItem key={index} title={graph.config_name}>
            {renderGraph(graph)}
          </GridItem>
        ))}
        </div>
      </div>
    </div>
  );
}

function GridItem({ title, children }) {
  return (
    <div className="grid-item-db">
      <h3 className="grid-item-db-title">{title}</h3>
      {children}
    </div>
  );
}

export default DashBoard_hod;
