import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 576px) {
    padding: 15px;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #343a40;
  text-align: center;
  margin-bottom: 20px;
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

const Label = styled.label`
  font-size: 1rem;
  color: #343a40;
  margin-bottom: 8px;
  display: block;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled.input`
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
  @media (max-width: 576px) {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
`;

const ErrorMessage = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
  font-size: 1rem;
`;

const SetDeadlinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, title, usersgroup = '' } = location.state || {};

  const [deadline, setDeadline] = useState(null);
  const [error, setError] = useState('');

  const handleDeadlineChange = (date) => {
    setDeadline(date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deadline) {
      setError('Please select a valid deadline.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/tables/deadline', {
        id: formId,
        deadline: deadline,
      });

      toast.success(response.data.message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Zoom,
      });

      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error setting deadline', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Zoom,
      });
    }
  };

  return (
    <Container>
      <Title>Set Deadline for {title}</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="deadline">Deadline:</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Deadline"
              value={deadline ? dayjs(deadline) : null}
              onChange={handleDeadlineChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ marginBottom: '15px' }}
                />
              )}
            />
          </LocalizationProvider>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" value="Set Deadline" />
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default SetDeadlinePage;
