import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import './Todays_List.css';
import './Attendance_Analysis.css';
import withAuthorization from '../Components/WithAuthorization';
import analysis from '../assets/student_analysis.png';
import errorImage from '../assets/no-results.png';
import { getTokenData } from '../Pages/authUtils';

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

const Attendance_Analysis = () => {
  const [selectedUserGroup, setSelectedUserGroup] = useState('Student');
  const [data, setData] = useState([]);
  const [attributeNames, setAttributeNames] = useState([]);
  const [rollNumber, setRollNumber] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const tokendata = getTokenData();
  const user = tokendata.role;
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [studentType, setStudentType] = useState('');
  const [error, setError] = useState(false); // Track if there's an error

  const fetchData = async () => {
    try {
      const departmentToFetch = (user === 'hod' || user === 'Attendance Manager') ? tokendata.department : selectedDepartment;
      const response = await axios.post('http://localhost:3000/attendance/getindividual', {
        userGroup: selectedUserGroup,
        rollnumber: rollNumber,
        department: departmentToFetch
      });

      const { name, year, studentType, attendanceRecords } = response.data;
      setName(name);
      setYear(year);
      setStudentType(studentType);
      setData(attendanceRecords);
      setError(false); // Reset error state if data fetch is successful

      if (attendanceRecords.length > 0) {
        const keys = Object.keys(attendanceRecords[0]).filter(key => key !== 'id' && (selectedUserGroup === 'Student' ? key !== 'staff_id' : key !== 'student_id'));
        setAttributeNames(keys);
      } else {
        setName("No Absentees On That Day");
        setAttributeNames([]);
      }
    } catch (error) {
      setError(true); // Set error state
      setName(error.response?.data?.error || 'Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  const handleFetchClick = () => {
    setData([]);
    setName("");
    setYear('');
    setStudentType('');
    setAttributeNames([]);
    setError(false); // Reset error state before fetching
    fetchData();
  };

  const handleRollNumberChange = (event) => {
    setRollNumber(event.target.value);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  useEffect(() => {
    setData([]);
    setName("");
    setYear('');
    setStudentType('');
    setError(false); // Reset error state when user group or department changes
  }, [selectedDepartment, selectedUserGroup]);

  return (
    <div>
      <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
      <div className='bb'>
        <form className='aa'>
          <input
            type='number'
            placeholder='Enter Roll Number'
            value={rollNumber}
            onChange={handleRollNumberChange}
          />
        </form>
        <input type='submit' className='bmt' value="Fetch" onClick={handleFetchClick} />
      </div>

      {name && !error && (
        <div className="student-info">
          <h2>Student Information</h2>
          <ul>
            <li>
              <span>Name:</span> {name}
            </li>
            {year && (
              <li>
                <span>Year:</span> {year}
              </li>
            )}
            {studentType && (
              <li>
                <span>Student Type:</span> {studentType}
              </li>
            )}
          </ul>
        </div>
      )}

      {data.length > 0 && attributeNames.length > 0 && (
        <Card className="mt-4">
          <Card.Header as="h5">Attendance Records</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>S.No</th>
                  {attributeNames.map((attribute, index) => (attribute==="attendance_date")?<th key={index}>{"Absent Date"}</th>:(
                    <th key={index}>{attribute.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {attributeNames.map((attribute, idx) => (
                      <td key={idx}>
                        {attribute.toLowerCase().includes('date')
                          ? formatDate(item[attribute])
                          : item[attribute]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {name==="No Absent Record Exists For The Given Roll Number" && !data.length && error && (
              <div className='image'>
                <img src={analysis} width="80%" height="80%" alt="Analysis" />
              </div>
            )}
      {name!=="No Absent Record Exists For The Given Roll Number" && error && (
        <div className='error-section'>
          <img src={errorImage} width="20%" height="20%" alt="Error" className='error-image' />
          <div className="error-message">
            <h3>No Result Found</h3>
            <p>{name}</p>
          </div>
        </div>
      )}

      

      <ToastContainer />
    </div>
  );
};

export default withAuthorization(['hod', 'Principal', 'VC', 'Dean', 'Attendance Manager'])(Attendance_Analysis);
