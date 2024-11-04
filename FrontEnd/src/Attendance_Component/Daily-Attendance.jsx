import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Daily-Attendance.css';
import withAuthorization from '../Components/WithAuthorization';
import { getTokenData } from '../Pages/authUtils';

const LeaveTypeDropdown = ({ onLeaveTypeSelect }) => {
  const handleLeaveTypeChange = (event) => {
    const leaveType = event.target.value;
    onLeaveTypeSelect(leaveType);
  };

  return (
    <div>
      <select id="leaveTypeSelect" className='status' onChange={handleLeaveTypeChange} required defaultValue="Informed">
        <option value="Informed">Informed</option>
        <option value="Un-Informed">Un-Informed</option>
      </select>
    </div>
  );
};

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

const Daily_Attendance = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const [selectedLeaveType, setSelectedLeaveType] = useState('Informed');
  const [selectedUserGroup, setSelectedUserGroup] = useState('Student');
  const [rollNumber, setRollNumber] = useState('');
  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const tokendata=getTokenData();
  const dname=tokendata.department;
  const notifysuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
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
  const capitalizeEachWord = (str) => {
    if (typeof str !== 'string') {
      return '';
    }

    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };
  const fetchUserName = async (identifier) => {
    const userType = selectedUserGroup.toLowerCase(); // 'student' or 'staff'
    try {
      const response = await axios.post(`http://localhost:3000/attendance/getname `,{userType:userType,userId:identifier});
      console.log(response.data);
      setName(response.data.data.name);
    } catch (err) {
      if (err.response) {
        setName('NA');
      } else {
        setName("NA");
      }
    }
  };

  const department = capitalizeEachWord(dname);
  useEffect(() => {
    if (rollNumber) {
      fetchUserName(rollNumber);
    } else {
      setName('');
    }
  }, [rollNumber, selectedUserGroup]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeaveType || !selectedUserGroup || !rollNumber || !reason) {
      notifyfailure("Select User Group, Leave Type, provide Roll/Enrollment Number, and Reason");
      return;
    }

    let payload = {
      reason: reason,
      leave_type: selectedLeaveType,
      attendance_date: formattedDate,
      department_name: department
    };

    if (selectedUserGroup === 'Student') {
      payload.student_id = rollNumber;
    } else {
      payload.staff_id = rollNumber;
    }

    try {
      const response = await axios.post("http://localhost:3000/attendance/addabsent", payload);
      console.log(response.data);
      if (response.data.error) {
        notifyfailure(response.data.error);
      } else {
        notifysuccess(response.data.message);
        setRollNumber('');
        setReason('');
      }
    } catch (error) {
      console.error('Axios error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        notifyfailure('Error inserting record: ' + (error.response.data.error || error.response.data.message || error.message));
      } else if (error.request) {
        console.error('Error request:', error.request);
        notifyfailure('No response received from server');
      } else {
        console.error('Error message:', error.message);
        notifyfailure('Error inserting record: ' + error.message);
      }
    }
  };

  return (
    <div>
      <div className='contents'>
        <UserGroupSelector setSelectedUserGroup={setSelectedUserGroup} />
      </div>
      <div className='attendance'>
        <h1>Attendance</h1>
        <h4>{formattedDate}</h4>

        <form>
          <label>{(selectedUserGroup === 'Student') ? "Roll Number" : "Enrollment Number"}</label>
          <input type='number' name='rollNumber' value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
          <label>Name</label>
          <input type='text' name='name' value={name || ''} readOnly required />

          <label>Reason</label>
          <input type='text' name='reason' value={reason} onChange={(e) => setReason(e.target.value)} required />

          <LeaveTypeDropdown onLeaveTypeSelect={setSelectedLeaveType} />

          <div className="bttcnt">
            <button onClick={handleSubmit} className='gh'>Absent</button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default withAuthorization(['Attendance Manager'])(Daily_Attendance);
