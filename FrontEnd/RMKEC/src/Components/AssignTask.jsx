import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { getTokenData } from '../Pages/authUtils';

const AssignTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, title,form } = location.state || {};
  const [emailId, setEmailId] = useState('');
  const [emailError, setEmailError] = useState(false);
  const tokendata = getTokenData();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailIdChange = (e) => {
    const value = e.target.value;
    setEmailId(value);
    setEmailError(!emailRegex.test(value)); // Validate email format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (emailError) {
      toast.error("Invalid email format", {
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
      return;
    }

    try {
      await axios.post('http://localhost:3000/tables/create-shadow-user', {
        form_id: formId,
        emailId,
        assigned_by: tokendata.role,
        department: tokendata.department,
        form_title:form.form_title,
        deadline:form.deadline,
        role: "Form editor"
      });

      toast.success("Task assigned successfully!", {
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

      setTimeout(() => {
        navigate(-1);
      }, 1000);
       
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error(error.response?.data?.error || "Error Assigning task", {
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
      <h2>Assign User for {title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="frm">
          <TextField
            label="Email ID of User"
            variant="outlined"
            fullWidth
            value={emailId}
            onChange={handleEmailIdChange}
            required
            style={{ marginTop: '10px' }}
            error={emailError} 
            helperText={emailError ? "Please enter a valid email address" : ""}
          />
        </div>
        <div className="holder">
          <Button type="submit" className="btt">Assign User</Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AssignTask;
