import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';

const ManageAssignedUsers = () => {
  const { state } = useLocation();
  const [users, setUsers] = useState([]);
  const [formId, setFormId] = useState(null);
  const department=state.department;
  useEffect(() => {
    if (state && state.form) {
      const form = state.form;
      setFormId(form.id);
  
      // Ensure parsing assigned users correctly, and handle if null or empty
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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Zoom,
        });
      }
    } else {
      toast.error('Form data not found', {
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
  }, [state]);
  

  const handleDeleteUser = async (email) => {
    try {
      const response = await axios.post('http://localhost:3000/tables/deleteFormUser', { formId, email ,department:department});
      if (response.data.success) {
        setUsers(users.filter(user => user.email !== email));
        toast.success('User deleted successfully', {
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
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Error deleting user: ${error.message}`, {
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
    <Container>
      <h1>Manage Assigned Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user.email)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
    </Container>
  );
};

export default ManageAssignedUsers;
