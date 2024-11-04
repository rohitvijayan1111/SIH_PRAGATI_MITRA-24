import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './Attendance_Log.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import withAuthorization from '../Components/WithAuthorization';
import { getTokenData } from '../Pages/authUtils';
import log from '../assets/log.png';

const UserGroupSelector = ({ setSelectedUserGroup }) => {
  const [selectedUserGroup, setSelectedUserGroupState] = useState('Student');

  const handleUserGroupChange = (event) => {
    const userGroup = event.target.value;
    setSelectedUserGroupState(userGroup);
    setSelectedUserGroup(userGroup);
  };

  return (
    <div>
      <select id="userGroupSelect" className='status-yr' onChange={handleUserGroupChange} value={selectedUserGroup} required>
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
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

const HostellerDayScholarSelector = ({ setSelectedHostellerDayScholar }) => {
  const handleHostellerDayScholarChange = (event) => {
    const hostellerDayScholar = event.target.value;
    setSelectedHostellerDayScholar(hostellerDayScholar);
  };

  return (
    <div>
      <select id="hostellerDayScholarSelect" className='status-yr' onChange={handleHostellerDayScholarChange} required>
        <option value="All">All</option>
        <option value="Hostel">Hosteller</option>
        <option value="Day Scholar">Day Scholar</option>
      </select>
    </div>
  );
};

const notifyfailure = (error) => {
  toast.error(error, {
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

const Attendance_Log = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedHostellerDayScholar, setSelectedHostellerDayScholar] = useState('All');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentYrsDetails, setStudentYrsDetails] = useState([]);
  const tokendata=getTokenData();
  const user=tokendata.role;
  const department=tokendata.department;
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get('http://localhost:3000/graphs/academicyear'); // Replace with your API endpoint
        const years = response.data;
        setAcademicYears(years);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    };

    fetchAcademicYears();
  }, []);

  const fetchData = async () => {
    try {
      const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
      const formattedDate2 = selectedDate ? selectedDate.format('DD-MM-YYYY') : null;
      const departmentToFetch = (user === 'hod' || user === 'Attendance Manager') ? department : selectedDepartment;
      console.log('Fetching data with department:', departmentToFetch);

      const response = await axios.post('http://localhost:3000/attendance/fetchdatedata', {
        selectedUserGroup,
        date: formattedDate,
        department: departmentToFetch,
        date2: formattedDate2,
        hostellerDayScholar: selectedHostellerDayScholar
      });
      console.log('Response data:', response.data);
      setData(response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        const keys = extractAttributeNames(response.data.data[0]);
        setAttributeNames(keys);
      } else {
        setName("No Absent Record Found on " + formattedDate2);
        setAttributeNames([]);
      }
    } catch (error) {
      setName(error.response?.data?.error);
      console.error('Error fetching data:', error);
    }
  };

  const fetchStudentData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsgraph", { dept: department, academic_year: year });
      setStudentDetails(transformData(response.data));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  const fetchStudentyrsData = async (year) => {
    try {
      const response = await axios.post("http://localhost:3000/graphs/studentsyrsgraph", { dept: department, academic_year: year });
      setStudentYrsDetails(transformYrsData(response.data));
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

  const transformYrsData = (data) => {
    return [
      { name: "1st Year", value: data.firstyear },
      { name: "2nd Year", value: data.secondyear },
      { name: "3rd Year", value: data.thirdyear },
      { name: "4th Year", value: data.fourthyear }
    ];
  };

  const extractAttributeNames = (object) => {
    return Object.keys(object);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    fetchStudentData(year);
    fetchStudentyrsData(year);
  };

  const handleFetchClick = () => {
    setData([]);
    setName("");
    setAttributeNames([]);

    if (!selectedDate) {
      notifyfailure("Please select a date before fetching data.");
      return;
    }
  
    if ((user !== 'hod' && user !== 'Attendance Manager') && !selectedDepartment) {
      notifyfailure("Please select a department before fetching data.");
      return;
    }
    fetchData();
  };
  

  useEffect(() => {
    setData([]);
    setName("");
  }, [selectedDepartment, selectedUserGroup, selectedHostellerDayScholar]);

  return (
    <div className='hon'>
      <div className='ddbtt'>
        <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
        {(user !== 'hod' && user !== 'Attendance Manager') && <DepartmentSelector setSelectedDepartment={setSelectedDepartment} />}
        {selectedUserGroup === "Student" && <HostellerDayScholarSelector setSelectedHostellerDayScholar={setSelectedHostellerDayScholar} />}
        <select className='dropbutton' value={selectedYear} onChange={handleYearChange}> 
        {academicYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))} 
      </select>
      </div>
      <div className='conte'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <input type='submit' value="Fetch" className='btm' onClick={handleFetchClick} />
      </div>
      {name && 
        <div className='image'>
          <img src={log} width="70%" height="80%"/>
        </div>}
      {data.length > 0 && (
        <div className='ta'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              {attributeNames.map((attribute, index) => (
                 <th key={index}>{attribute.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {selectedUserGroup==="Student" && data.filter(item => selectedHostellerDayScholar === "All" || item.studentType === selectedHostellerDayScholar).map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {attributeNames.map((attribute, idx) => (
                  <td key={idx}>{item[attribute]}</td>
                ))}
              </tr>
            ))}
            {selectedUserGroup!=="Student" && data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {attributeNames.map((attribute, idx) => (
                  <td key={idx}>{item[attribute]}</td>
                ))}
              </tr>
            ))}

          </tbody>
        </Table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager'])(Attendance_Log);
