import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { getTokenData } from '../Pages/authUtils';
import dayjs from 'dayjs';

const Shadow_OtherForms = () => {
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

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/forms/getformlist`, {});
                const formsData = response.data
                .map(row => {
                    // Parse the assigned_to_usergroup string into a nested array
                    const assignedToUsergroup = JSON.parse(row.assigned_to_usergroup || '[]');
                    // Check if tokendata.email is in the assignedToUsergroup nested array
                    const isAssigned = assignedToUsergroup.some(user => user[0] === tokendata.email);
                    return isAssigned ? row : null;
                })
                .filter(row => row !== null);

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
    }, [tokendata.email]);

    const handleView = (form) => {
        console.log(form);
        navigate("/dashboard/forms/form-records", { state: { form: form } });
    };

    const handleAdd = () => {
        // Your implementation for handleAdd
    };

    const handleTask = (formId) => {
        // Your implementation for handleTask
    };

    const handleLock = (formId) => {
        // Your implementation for handleLock
    };

    const handleDeadline = (formId) => {
        // Your implementation for handleDeadline
    };

    const handleDeleteForm = (formId, formTitle, formTableName) => {
        // Your implementation for handleDeleteForm
    };

    return (
        <>
            <h1>Form List</h1>
            <Container>
                {role === 'IQAC' && (
                    <div className="below" onClick={handleAdd}>Add Form</div>
                )}
                <Table striped bordered hover>
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
                                    <Button variant="primary" onClick={() => handleView(form)}>View</Button>
                                    {' '}
                                    {role === "hod" && (
                                        <Button variant="warning" onClick={() => handleTask(form.id)}>Assign Task</Button>
                                    )}
                                    {role === 'IQAC' && (
                                        <>
                                            <Button variant="danger" onClick={() => handleLock(form.id)}>
                                                {lockedStatus[form.id] ? 'Unlock Form' : 'Lock Form'}
                                            </Button>
                                            <Button variant="warning" onClick={() => handleDeadline(form.id)}>Set Deadline</Button>
                                            <Button variant="danger" onClick={() => handleDeleteForm(form.id, form.form_title, form.form_table_name)}>
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

export default Shadow_OtherForms;
