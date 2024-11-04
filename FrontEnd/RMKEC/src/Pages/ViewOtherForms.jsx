import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { getTokenData } from './authUtils';

const ViewOtherForms = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [lockedStatus, setLockedStatus] = useState({});
    const tokendata=getTokenData();
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
        navigate("/dashboard/view-other-forms/new-form");
    };

    const handleAddRecord = (form) => {
        if (form.is_locked) {
            notifyfailure("Form is Locked Cannot Add Records!");
            return;
        }
        navigate("new-record", { state: { form: form, attributenames: extractKeys(form.attributes) } });
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

    const handleViewForm = (fo) => {
        navigate("view-record", { state: { form:fo,id:fo.id, attributenames: extractKeys(forms.find(form => form.id === fo.id).attributes) } });
    };

    const handleLock = async (formId) => {
        Swal.fire({
            title: 'Do you want to change the lock status of this form?',
            showCancelButton: true,
            confirmButtonText: lockedStatus[formId] ? 'Unlock' : 'Lock',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post('http://localhost:3000/forms/lockform', { id: formId, lock: !lockedStatus[formId] });
                    setLockedStatus(prevState => ({ ...prevState, [formId]: !lockedStatus[formId] }));
                    Swal.fire(`${lockedStatus[formId] ? 'Unlocked' : 'Locked'}!`, '', 'success');
                } catch (error) {
                    console.error('Error locking form:', error);
                    Swal.fire('Error!', 'There was an error changing the lock status', 'error');
                }
            }
        });
    };

    const extractKeys = (attributes) => {
        const jsonArray = JSON.parse(attributes);
        return jsonArray;
    };

    return (
        <Container>
                <h1>Form List</h1>
                {role === 'coordinator' && (
                    <Button type="button" onClick={handleAdd} className="btn btn-primary">Add Records</Button>
                )}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Form Title</th>
                        <th>Date of Creation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form, index) => (
                        <tr key={form.id}>
                            <td>{index + 1}</td>
                            <td>{form.form_name}</td>
                            <td>{new Date(form.date_of_creation).toLocaleString('en-US', { 
                                year: 'numeric', 
                                month: '2-digit', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleViewForm(form)}>View</Button>
                                {' '}
                                {role === 'coordinator' ? (
                                    <Button variant="danger" onClick={() => handleLock(form.id)}>
                                        {lockedStatus[form.id] ? 'Unlock Form' : 'Lock Form'}
                                    </Button>
                                ) : (
                                    role === 'hod' && (
                                        <Button variant="primary" onClick={() => handleAddRecord(form)}>
                                            Add Record
                                        </Button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </Container>
    );
};

export default ViewOtherForms;
