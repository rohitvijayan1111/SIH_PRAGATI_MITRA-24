import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    margin:10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 1rem;
  overflow: auto;

  thead {
    background-color: #164863;
    color: white;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    display: block;
    width: 90%;
    margin: 0 40px;
    overflow-x: auto;
    white-space: nowrap;
  }
`;


const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
`;

const ActionButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c82333;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
`;

const ManageAssignedUsers = () => {
  const { state } = useLocation();
  const [users, setUsers] = useState([]);
  const [formId, setFormId] = useState(null);
  const department = state?.department;

  useEffect(() => {
    if (state && state.form) {
      const form = state.form;
      setFormId(form.id);

      // Parsing assigned users, handling null/empty
      try {
        const assignedUsers = JSON.parse(form.assigned_to_usergroup || '[]');
        if (Array.isArray(assignedUsers)) {
          setUsers(assignedUsers.map(([email, department]) => ({ email, department })));
        } else {
          throw new Error('Assigned users data is not in the expected format.');
        }
      } catch (error) {
        toast.error('Error processing assigned users', {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Zoom,
        });
      }
    } else {
      toast.error('Form data not found', {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
  }, [state]);

  const handleDeleteUser = async (email) => {
    try {
      const response = await axios.post('http://localhost:3000/tables/deleteFormUser', { formId, email, department });
      if (response.data.success) {
        setUsers(users.filter(user => user.email !== email));
        toast.success('User deleted successfully', {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Zoom,
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Error deleting user: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  return (
    <StyledContainer>
      <Title>Manage Assigned Users</Title>
      <StyledTable>
        <thead>
          <tr>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>
                <ActionButton onClick={() => handleDeleteUser(user.email)}>Delete</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <ToastContainer />
    </StyledContainer>
  );
};

export default ManageAssignedUsers;
