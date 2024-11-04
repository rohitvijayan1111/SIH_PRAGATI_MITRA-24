import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';

const SetDeadlinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, title, usersgroup = '' } = location.state || {};

  const [deadline, setDeadline] = useState(null);
  

  const handleDeadlineChange = (date) => {
    setDeadline(date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '');
  };

  
 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/tables/deadline', {
        id: formId,
        deadline: deadline,
      });

      toast.success(response.data.message, {
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

      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error setting deadline', {
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
    }
  };


  return (
    <div className="cnt">
      <h2>Set Deadline for {title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="frm">
          <label htmlFor="deadline">Deadline:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Deadline"
              value={deadline ? dayjs(deadline) : null}
              onChange={handleDeadlineChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="cntr"
                  id="deadline"
                  required
                />
              )}
            />
          </LocalizationProvider>
        </div>
        
        <div className="holder">
          <input type="submit" value="Set Deadline" className="btt" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SetDeadlinePage;
