import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenData } from '../Pages/authUtils';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f5f5f5;
`;

const Container = styled.div`
  max-width: 500px;
  width: 90%;
  margin: auto;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const FieldContainer = styled.div`
  margin-bottom: 1rem;
`;

const AssignButton = styled.button`
  background-color: #008CBA;
  border: none;
  font-size: 1rem;
  padding: 10px 0;
  color: white;
  width: 150px;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  align-self: center;

  &:hover {
    background-color: #0074A2;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AssignTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, title, form } = location.state || {};
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
        form_title: form.form_title,
        deadline: form.deadline,
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
    <PageWrapper>
      <Container>
        <Title>Assign User for {title}</Title>
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <TextField
              label="Email ID of User"
              variant="outlined"
              fullWidth
              value={emailId}
              onChange={handleEmailIdChange}
              required
              error={emailError}
              helperText={emailError ? "Please enter a valid email address" : ""}
            />
          </FieldContainer>
          <AssignButton type="submit" style={{marginLeft:"15px"}}>Assign User</AssignButton>
        </Form>
        <ToastContainer />
      </Container>
    </PageWrapper>
  );
};

export default AssignTask;
