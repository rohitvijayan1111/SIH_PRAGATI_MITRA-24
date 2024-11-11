import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hall_Request.css';
import dayjs from 'dayjs'; 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from '../Pages/authUtils';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Zoom } from 'react-toastify';

const Hall_Request = () => {
  const [halls, setHalls] = useState([]);
  const [fvalue, setFvalue] = useState(null); 
  const [tvalue, setTvalue] = useState(null);
  const navigate = useNavigate();
  const tokendata = getTokenData();
  const [formData, setFormData] = useState({
    name: '',
    speaker: '',
    speaker_description: '',
    event_date: null,
    start_time: null,
    end_time: null,
    hall_name: 'Hall A', 
    participants: '',
    incharge_faculty: '',
    facility_needed: '',
    emails: '',
    department: tokendata.department || ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/hall/halls')
      .then(response => setHalls(response.data))
      .catch(error => console.error('Error fetching hall details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const capitalizeEachWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const notifysuccess = (msg) => {
    toast.success(msg, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.event_date || !formData.start_time || !formData.end_time || !formData.hall_name) {
      notifyfailure('Please fill in all required fields.');
      return;
    }

    const formattedDate = dayjs(formData.event_date).format('YYYY-MM-DD');
    const formattedStartTime = formData.start_time ? dayjs(formData.start_time).format('HH:mm:ss') : null;
    const formattedEndTime = formData.end_time ? dayjs(formData.end_time).format('HH:mm:ss') : null;

    const requestData = {
      ...formData,
      event_date: formattedDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime
    };

    try {
      await axios.post('http://localhost:3000/hall/hall-request', requestData)
        .then(response => notifysuccess(response.data))
        .catch(error => notifyfailure(error.response.data.error));

      const formattedDate2 = dayjs(formData.event_date).format('MMMM DD, YYYY');
      const formContent = `
        You have a new hall booking approval request for the event "${formData.name}" scheduled on ${formattedDate2} from ${formattedStartTime} to ${formattedEndTime} at ${formData.hall_name}.
        Event Name: ${formData.name}
        Speaker: ${formData.speaker}
        Speaker Description: ${formData.speaker_description}
        Department: ${formData.department}
        Participants: ${formData.participants}
        In-charge Faculty: ${formData.incharge_faculty}
        Facilities Needed: ${formData.facility_needed}
        `;

      await axios.post('http://localhost:3000/mail/notifyHOD', {
        formSubject: formContent,
        department: capitalizeEachWord(formData.department),
        emails: formData.emails
      });  
      notifysuccess('Notification sent to HOD!');
      navigate("/dashboard");
    } catch (error) {
      console.error('Error submitting request:', error);
      notifyfailure('Error submitting request');
    }
  };

  return (
    <form className="Attendance_request">
      <h5>Name Of the Event</h5>
      <input type='text' name='name' value={formData.name} onChange={handleChange} required />
      <h5>Speaker</h5>
      <input type='text' name='speaker' value={formData.speaker} onChange={handleChange} required />
      <h5>Description of the Speaker</h5>
      <textarea style={{resize:'none'}} name='speaker_description' value={formData.speaker_description} onChange={handleChange} required></textarea>
      <h5>Date</h5>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Date"
            value={formData.event_date}
            onChange={(newValue) => setFormData({ ...formData, event_date: newValue })}
            renderInput={(params) => <TextField {...params} className="custom-date-picker" />}
            required
          />
        </DemoContainer>
      </LocalizationProvider>
      <h5>Time</h5>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker', 'TimePicker']}>
          <TimePicker
            label="From"
            value={fvalue}
            onChange={(newValue) => {
              setFvalue(newValue);
              setFormData({ ...formData, start_time: newValue });
            }}
            required
          />
          <TimePicker
            label="To"
            value={tvalue}
            onChange={(newValue) => {
              setTvalue(newValue);
              setFormData({ ...formData, end_time: newValue });
            }}
            required
          />
        </DemoContainer>
      </LocalizationProvider>
      <h5>Hall Name</h5>
      <select className='status' name="hall_name" value={formData.hall_name} onChange={handleChange} required>
        <option value="" disabled>Select a hall</option>
        {halls.map(hall => (
          <option key={hall.hall_name} value={hall.hall_name}>{hall.hall_name}</option>
        ))}
      </select>
      <h5>Participants</h5>
      <input type='text' name='participants' value={formData.participants} onChange={handleChange} required />
      <h5>Incharge Faculty</h5>
      <input type='text' name='incharge_faculty' value={formData.incharge_faculty} onChange={handleChange} required />
      <h5>Facility Needed</h5>
      <textarea style={{resize:'none'}} name='facility_needed' value={formData.facility_needed} onChange={handleChange} required></textarea>
      <h5>Event Co-Ordinator Mail ID</h5>
      <input type='email' name='emails' value={formData.emails} onChange={handleChange} required />
      <div className="send-button-container">
        <button onClick={handleSubmit}>Request Hall</button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default Hall_Request;
