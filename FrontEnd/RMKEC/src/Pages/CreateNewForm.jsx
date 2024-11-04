import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenData } from './authUtils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'; 
import { styled } from '@mui/material/styles';

const CreateNewForm = () => {
    const [formName, setFormName] = useState('');
    const [attributes, setAttributes] = useState([{ name: 'department', type: 'text' }]); // Default attribute
    const [attributeName, setAttributeName] = useState('');
    const [attributeType, setAttributeType] = useState('text');
    const [error, setError] = useState('');
    const tokendata = getTokenData();
    const role = tokendata.role;

    // Usergroup related states
    const [to, setTo] = useState(''); // For additional email input
    const [selectAll, setSelectAll] = useState(false);
    const [senderlist, setSenderList] = useState([
        { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept: 'ADS' },
        { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false, dept: 'CIVIL' },
        { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'CSBS' },
        // Add more emails as needed
    ]);

    const notifySuccess = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
        });
    };

    const notifyFailure = (error) => {
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

    const addAttribute = () => {
        if (attributeName) {
            if (attributeType === 'file' && attributeName !== 'document') {
                setError('For "file" type, the header should be "document".');
                return;
            }

            if (attributeType === 'link' && !['website_link', 'related_link'].includes(attributeName)) {
                setError('For "link" type, the options should be "website_link" or "related_link".');
                return;
            }

            setError(''); 
            if (attributeName !== 'department') {
                setAttributes([...attributes, { name: attributeName, type: attributeType }]);
            }

            setAttributeName('');
            setAttributeType('text');
        }
    };

    const removeAttribute = (index) => {
        if (attributes[index].name === 'department') {
            setError('Cannot remove the "department" attribute.');
            return;
        }

        const newAttributes = [...attributes];
        newAttributes.splice(index, 1);
        setAttributes(newAttributes);
    };

    const handleCheck = (id) => {
        const updatedList = senderlist.map(member =>
            member.id === id ? { ...member, checked: !member.checked } : member
        );
        setSenderList(updatedList);

        const allChecked = updatedList.every(member => member.checked);
        setSelectAll(allChecked);
    };

    const handleSelectAll = () => {
        const newCheckedState = !selectAll;
        const updatedList = senderlist.map(member => ({ ...member, checked: newCheckedState }));
        setSenderList(updatedList);
        setSelectAll(newCheckedState);
    };

    const handleSubmit = async () => {
        if (!formName || attributes.length === 0) {
            notifyFailure('Form name and at least one attribute are required.');
            return;
        }

        let selectedEmails = senderlist.filter(member => member.checked).map(member => member.text);

        if (to.trim() !== '') {
            const additionalEmails = to.split(',').map(email => email.trim());
            selectedEmails = [...selectedEmails, ...additionalEmails];
        }

        const usergroup = selectedEmails.join(',');
        const newForm = { formName, attributes, usergroup };

        try {
            const response = await axios.post('http://localhost:3000/tables/create-table', newForm);
            notifySuccess(response.data);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                notifyFailure(error.response.data);
            } else if (error.request) {
                notifyFailure('No response from server');
            } else {
                console.log(error.response.message);
                notifyFailure(error.message);
            }
        }
    };

    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
        color: theme.palette.primary.main, 
        '&.Mui-checked': {
            color: theme.palette.primary.dark, 
        },
        '&:hover': {
            backgroundColor: 'transparent', 
        },
        '& .MuiSvgIcon-root': {
            width: 15, 
            height: 15,
        },
    }));

    return (
        <Container>
            {role === 'IQAC' ? (
                <Row>
                    <Col>
                        <h1>Create Form</h1>
                        <Form>
                            <Form.Group>
                                <Form.Label>Form Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formName} 
                                    onChange={(e) => setFormName(e.target.value)} 
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Attribute Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={attributeName} 
                                            onChange={(e) => setAttributeName(e.target.value)} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Attribute Type</Form.Label>
                                        <Form.Control 
                                            as="select" 
                                            value={attributeType} 
                                            onChange={(e) => setAttributeType(e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="file">File</option>
                                            <option value="link">Link</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className="align-self-end">
                                    <Button variant="primary" onClick={addAttribute}>
                                        Add Attribute
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}

                        <Table striped bordered hover style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>Attribute Name</th>
                                    <th>Attribute Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attributes.map((attribute, index) => (
                                    <tr key={index}>
                                        <td>{attribute.name}</td>
                                        <td>{attribute.type}</td>
                                        <td>
                                            <Button 
                                                variant="danger" 
                                                onClick={() => removeAttribute(index)}
                                                disabled={attribute.name === 'department'} // Disable button for "department"
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Usergroup selection and additional emails */}
                        <Form.Group>
                            <Form.Label>Select User Groups</Form.Label>
                            <ul>
                                <li>
                                    <FormControlLabel
                                        control={<CustomCheckbox checked={selectAll} onChange={handleSelectAll} />}
                                        label="All"
                                    />
                                </li>
                                {senderlist.map(item => (
                                    <li key={item.id}>
                                        <FormControlLabel
                                            control={<CustomCheckbox checked={item.checked} onChange={() => handleCheck(item.id)} />}
                                            label={item.dept}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Other Recipient Emails (comma-separated)</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Other Recipient Emails" 
                                value={to} 
                                onChange={(e) => setTo(e.target.value)} 
                            />
                        </Form.Group>

                        <Button variant="success" onClick={handleSubmit} style={{ marginTop: '10px' }}>
                            Submit
                        </Button>
                        <ToastContainer />
                    </Col>
                </Row>
            ) : (
                <h1>Wrong User, GO back</h1>
            )}
        </Container>
    );
};

export default CreateNewForm;
