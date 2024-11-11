import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Attendance_DB_Dept.css';
import LineCharts from './LineCharts';
import Attendance_BC from './Attendance_BC';
import Attendance_BC_Admin from '../Components/Admin-Component/Attendance_BC_Admin';
import withAuthorization from '../Components/WithAuthorization';
import dayjs from 'dayjs';
import { getTokenData } from '../Pages/authUtils';
const BatchSelector = ({ onBatchSelect }) => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchChange = (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    onBatchSelect(batch);
  };

  return (
    <div>
      <select id="batchSelect" className='status-yr' value={selectedBatch} onChange={handleBatchChange}>
        <option value="Student">Student</option>
        <option value="Faculty">Faculty</option>
      </select>
    </div>
  );
};
const DepartmentSelector = ({ setSelectedDepartment }) => {
  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
  };

  return (
    <div>
      <select id="departmentSelect" className='status-yr' onChange={handleDepartmentChange} required>
        <option value="">Select Department</option>
        <option value="All">All</option>
        <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Computer Science and Business Systems">Computer Science and Business Systems</option>
        <option value="Computer Science and Design">Computer Science and Design</option>
        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
        <option value="Electronics and Instrumentation Engineering">Electronics and Instrumentation Engineering</option>
        <option value="Information Technology">Information Technology</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
      </select>
    </div>
  );
};



const TypeSelector = ({ onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState('All');

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    onTypeSelect(type);
  };

  return (
    <div>
      <select id="typeSelect" className='status-yr' value={selectedType} onChange={handleTypeChange}>
        <option value="All">All</option>
        <option value="Hostel">Hosteller</option>
        <option value="Day Scholar">Day Scholar</option>
      </select>
    </div>
  );
};

const GridItem = ({ title, children }) => {
  return (
    <div className="grid-item-db">
      <h3 className="grid-item-db-title">{title}</h3>
      {children}
    </div>
  );
};

export function Attendance_DB_Dept() {
  const [selectedYearGroup, setSelectedYearGroup] = useState('Student');
  const [selectedType, setSelectedType] = useState('All');
  const [data, setData] = useState([]);
  const [countdata, setCountData] = useState(null);
  const [linedata, setLineData] = useState([]);
  const todayDate = dayjs().format('DD-MM-YYYY');
  const tokendata=getTokenData();
  const department=tokendata.department;
  const notifyFailure = (error) => {
    toast.error(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.post("http://localhost:3000/attendance/attendance-summary", { department: department,type: selectedType});
        console.log('Attendance summary data:', response.data);
        setData(response.data);

        const response2 = await axios.post("http://localhost:3000/attendance/attendance-count-summary", { department: department, user: selectedYearGroup, type: selectedType });
        console.log('Attendance count summary data:', response2.data);
        setCountData(response2.data);

        const response3 = await axios.post("http://localhost:3000/attendance/attendance-graph", { department: department, user: selectedYearGroup,type: selectedType });
        console.log('Attendance graph data:', response3.data);
        setLineData(response3.data);
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          notifyFailure(new Error(error.response.data.error || 'Server Error'));
        } else if (error.request) {
          console.error('Network Error:', error.request);
          notifyFailure(new Error('Network Error'));
        } else {
          console.error('Request Error:', error.message);
          notifyFailure(new Error('Request Error'));
        }
      }
    }
    getData();
  }, [selectedYearGroup, selectedType]);

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
    setLineData([]);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setLineData([]);
  };

  return (
    <div>
      <div className='content'>
        <BatchSelector onBatchSelect={handleYearGroupSelect} />
      <TypeSelector onTypeSelect={handleTypeSelect} />
      </div>
      
      <div className='component'>
        <h1>{todayDate}</h1>
        <div className='home-grid-db'>
          <div className="grid-containers">
            <div className='home-grid-db'>
              <GridItem title="Attendance">
                <Attendance_BC data={data} />
              </GridItem>
              <GridItem title="Data">
                <div className='content-container'>
                  {countdata !== null && (
                    <>
                      <p>Total No of students: {countdata.Total_students}</p>
                      <p>Present: {countdata.Student_Present}</p>
                      <p>Absent: {countdata.Student_Absent}</p>
                      <p>Total No of Teachers: {countdata.Total_staff}</p>
                      <p>Present: {countdata.Staff_Present}</p>
                      <p>Absent: {countdata.Staff_Absent}</p>
                    </>
                  )}
                </div>
              </GridItem>
              <GridItem title="Analysis">
                <LineCharts data={linedata} />
              </GridItem>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export function Attendance_DB_Admin() {
  const [selectedYearGroup, setSelectedYearGroup] = useState('Student');
  const [selectedType, setSelectedType] = useState('All');
  const [data, setData] = useState([]);
  const [countdata, setCountData] = useState(null);
  const [linedata, setLineData] = useState([]);
  const user = window.localStorage.getItem('userType');
  const todayDate = dayjs().format('DD-MM-YYYY');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const departmentMapping = {
    'Artificial Intelligence and Data Science': 'AI',
    'Civil Engineering': 'CE',
    'Computer Science and Business Systems': 'CB',
    'Computer Science and Design': 'CD',
    'Computer Science and Engineering': 'CS',
    'Electrical and Electronics Engineering': 'EE',
    'Electronics and Communication Engineering': 'EC',
    'Electronics and Instrumentation Engineering': 'EI',
    'Information Technology': 'IT',
    'Mechanical Engineering': 'ME',
  };
  const transformData = (data) => {
    return data.map((item) => ({
      name: departmentMapping[item.name] || item.name,
      present: item.present,
      absent: item.absent
    }));
  };

  const notifyFailure = (error) => {
    toast.error(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.post("http://localhost:3000/attendance/admin-attendance-summary", { user: selectedYearGroup, type: selectedType });
        console.log('Attendance summary data:', response.data);
        setData(transformData(response.data));
        console.log(data);
        const response2 = await axios.post("http://localhost:3000/attendance/admin-attendance-count-summary", { type: selectedType });
        console.log('Attendance count summary data:', response2.data);
        setCountData(response2.data);

        const response3 = await axios.post("http://localhost:3000/attendance/admin-attendance-graph", { user: selectedYearGroup, type: selectedType });
        console.log('Attendance graph data:', response3.data);
        setLineData(response3.data);
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
          notifyFailure(new Error(error.response.data.error || 'Server Error'));
        } else if (error.request) {
          console.error('Network Error:', error.request);
          notifyFailure(new Error('Network Error'));
        } else {
          console.error('Request Error:', error.message);
          notifyFailure(new Error('Request Error'));
        }
      }
    }
    getData();
  }, [selectedYearGroup, selectedDepartment, selectedType]);

  const handleYearGroupSelect = (yearGroup) => {
    setSelectedYearGroup(yearGroup);
    setLineData([]);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setLineData([]);
  };

  return (
    <div>
      <div className='selector'>
        <BatchSelector onBatchSelect={handleYearGroupSelect} />
        <TypeSelector onTypeSelect={handleTypeSelect} />
        {(user !== 'hod' && user !== 'Attendance Manager') && (
          <DepartmentSelector setSelectedDepartment={setSelectedDepartment} />
        )}
      </div>
      <div className='component'>
        <h1>{todayDate}</h1>
        <div className='home-grid-db'>
          <div className="grid-containers">
            <div className='home-grid-db'>
              <GridItem title="Attendance">
                <Attendance_BC_Admin data={data} />
              </GridItem>
              <GridItem title="Data">
                <div className='content-container'>
                  {countdata !== null && (
                    <>
                      <p>Total No of students: {countdata.Total_students}</p>
                      <p>Present: {countdata.Student_Present}</p>
                      <p>Absent: {countdata.Student_Absent}</p>
                      <p>Total No of Teachers: {countdata.Total_staff}</p>
                      <p>Present: {countdata.Staff_Present}</p>
                      <p>Absent: {countdata.Staff_Absent}</p>
                    </>
                  )}
                </div>
              </GridItem>
              <GridItem title="Analysis">
                <LineCharts data={linedata} />
              </GridItem>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

const Attendance_Dashboard = () => {
  const tokendata=getTokenData();
  const user=tokendata.role;
  return (
    (user==="hod" || user==="Attendance Manager") ? <Attendance_DB_Dept /> : <Attendance_DB_Admin />
  );

}

export default withAuthorization(['hod','Principal','VC','Dean','Attendance Manager'])(Attendance_Dashboard);
