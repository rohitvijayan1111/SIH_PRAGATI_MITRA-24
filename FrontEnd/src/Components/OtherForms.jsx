import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { getTokenData } from '../Pages/authUtils';
import dayjs from 'dayjs';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const AddButton = styled.button`
  background-color: #008CBA;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 10px auto;

  &:hover {
    background-color: #0074A2;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    td, th {
      padding: 8px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ViewButton = styled.button`
  background-color: #008CBA; /* Blue */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #0074A2;
  }
`;

const ActionButton = styled.button`
  background-color: #FFD700; /* Yellow */
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #FFC107;
  }
`;

const OtherForms = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [lockedStatus, setLockedStatus] = useState({});
    const tokendata = getTokenData();
    const role = tokendata.role;

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

    const handleAdd = () => {
        navigate("create-form");
    };

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.post('http://localhost:3000/forms/getformlist', {});
                const formsData = response.data;
                setForms(formsData);
                const initialLockStatus = formsData.reduce((acc, form) => {
                    acc[form.id] = form.is_locked;
                    return acc;
                }, {});
                setLockedStatus(initialLockStatus);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, []);

    const handleLock = async (formId) => {
        Swal.fire({
            title: 'Do you want to change the lock status of this form?',
            showCancelButton: true,
            confirmButtonText: lockedStatus[formId] ? 'Unlock' : 'Lock',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post('http://localhost:3000/tables/locktable', { id: formId, lock: !lockedStatus[formId] });
                    setLockedStatus(prevState => ({ ...prevState, [formId]: !lockedStatus[formId] }));
                    Swal.fire(`${lockedStatus[formId] ? 'Unlocked' : 'Locked'}!`, '', 'success');
                } catch (error) {
                    console.error('Error locking form:', error);
                    Swal.fire('Error!', 'There was an error changing the lock status', 'error');
                }
            }
        });
    };

    const handleDeadline = (formId) => {
        const form = forms.find(f => f.id === formId);
        if (form) {
            navigate("deadline", {
                state: {
                    formId: formId,
                    title: form.form_title,
                    usersgroup: form.usergroup
                }
            });
        } else {
            notifyfailure("Form not found");
        }
    };

    const handleTask = (formId) => {
        const form = forms.find(f => f.id === formId);
        if (form) {
            navigate("assign-task", {
                state: {
                    formId: formId,
                    title: form.form_title,
                    usersgroup: form.usergroup,
                    form: form
                }
            });
        } else {
            notifyfailure("Could not navigate to that page");
        }
    };

    const handleDeleteForm = (formId, formName, tableName) => {
        Swal.fire({
            title: `Do you want to delete the ${formName} form?`,
            text: `Please type "delete ${formName}" to confirm.`,
            input: 'text',
            inputPlaceholder: `delete ${formName}`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            preConfirm: (inputValue) => {
                if (inputValue !== `delete ${formName}`) {
                    Swal.showValidationMessage(`You need to type "delete ${formName}" to confirm.`);
                }
                return inputValue === `delete ${formName}`;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost:3000/tables/delete', { formId, tableName })
                    .then(() => {
                        Swal.fire('Deleted!', `The form "${formName}" has been deleted.`, 'success');
                        setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'There was an issue deleting the form. Please try again.', 'error');
                    });
            }
        });
    };

    const handleView = (form) => {
        navigate("form-records", { state: { form: form } });
    };

    const handleUsers = (form) => {
        navigate("Manage-Assigned-Users", { state: { form: form, department: tokendata.department } });
    };

    return (
        <Container>
            <Title>Form List</Title>
            {role === 'IQAC' && <AddButton onClick={handleAdd}>Add Form</AddButton>}
            <StyledTable>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Form Title</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form, index) => (
                        <tr key={form.id}>
                            <td>{index + 1}</td>
                            <td>{form.form_title}</td>
                            <td>{form.deadline ? dayjs(form.deadline).format("HH:mm DD-MM-YYYY") : "No deadline"}</td>
                            <td>
                                <ButtonGroup>
                                    <ViewButton onClick={() => handleView(form)}>View</ViewButton>
                                    {role === "hod" && (
                                        <>
                                            <ActionButton onClick={() => handleTask(form.id)}>Assign Task</ActionButton>
                                            <ActionButton onClick={() => handleUsers(form)}>Manage Users</ActionButton>
                                        </>
                                    )}
                                    {role === 'IQAC' && (
                                        <>
                                            <ActionButton onClick={() => handleLock(form.id)}>
                                                {lockedStatus[form.id] ? 'Unlock Form' : 'Lock Form'}
                                            </ActionButton>
                                            <ActionButton onClick={() => handleDeadline(form.id)}>Set Deadline</ActionButton>
                                            <ActionButton onClick={() => handleDeleteForm(form.id, form.form_title, form.form_table_name)}>Delete Form</ActionButton>
                                        </>
                                    )}
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
            <ToastContainer />
        </Container>
    );
};

export default OtherForms;
