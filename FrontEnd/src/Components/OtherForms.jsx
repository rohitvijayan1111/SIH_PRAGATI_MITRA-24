import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { getTokenData } from '../Pages/authUtils';
import './OtherForms.css'
import dayjs from 'dayjs';
const OtherForms = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [lockedStatus, setLockedStatus] = useState({});
    const tokendata=getTokenData();
    const role = tokendata.role;
    console.log(forms);
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
                console.log(response.data);
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
                    const response = await axios.post('http://localhost:3000/tables/locktable', { id: formId, lock: !lockedStatus[formId] });
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
                    form:form
                }
            });
        } else {
            notifyfailure("Could not Navigate to that page");
        }
    };
    function handleDeleteForm(formId, formName,tableName) {
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
            console.log("From is going to be deleted");
            axios.post('http://localhost:3000/tables/delete', {formId,tableName})
              .then((response) => {
                Swal.fire('Deleted!', `The form "${formName}" has been deleted.`, 'success');
                setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
              })
              .catch((error) => {
                Swal.fire('Error!', 'There was an issue deleting the form. Please try again.', 'error');
              });
          }
        });
        
      }
   function handleView(form){
    navigate("form-records", { state: { form: form} });
   }
   function handleUsers(form){
    navigate("Manage-Assigned-Users", { state: { form: form,department:tokendata.department} });
   }

    return (
        <>
        <h1>Form List</h1>
        <Container>
                {role === 'IQAC' && (  
                    <div className="below" onClick={handleAdd} >Add Form</div>
                )}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>S.No</th>
                        <th style={{ width: '30%' }}>Form Title</th>
                        <th style={{ width: '20%' }}>Deadline</th>
                        <th style={{ width: '40%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form, index) => (
                        <tr key={form.id}>
                            <td>{index + 1}</td>
                            <td>{form.form_title}</td>
                            <td>{form.deadline ? dayjs(form.deadline).format("HH:mm DD-MM-YYYY") : "No deadline"}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleView(form)}>View</Button>
                                {' '}
                                {role==="hod" && (
                                    <>
                                    <Button variant="warning" onClick={()=>handleTask(form.id)}>Assign Task</Button>
                                    <Button variant="warning" onClick={()=>handleUsers(form)}>Manage Users</Button>
                                    </>
                                )}
                                {role === 'IQAC'&& (
                                    <>
                                    <Button variant="danger" onClick={() => handleLock(form.id)}>
                                        {lockedStatus[form.id] ? 'Unlock Form' : 'Lock Form'}
                                    </Button>
                                    <Button variant="warning" onClick={()=>handleDeadline(form.id)}>Set Deadline</Button>
                                    <Button variant="danger" onClick={() => handleDeleteForm(form.id,form.form_title,form.form_table_name)}>
                                        Delete Form
                                    </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </Container>
        </>
    );
};

export default OtherForms;
