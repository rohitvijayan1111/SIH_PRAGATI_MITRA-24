import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenData } from './authUtils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'; 
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';

const StyledContainer = styled.div`
    max-width: 700px;
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 576px) {
        padding: 20px;
        max-width: 90%;
    }
`;

const Title = styled.h1`
    color: #343a40;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    @media (max-width: 576px) {
        font-size: 1.5rem;
    }
`;

const StyledFormLabel = styled.label`
    font-size: 1rem;
    color: #343a40;
    margin-bottom: 5px;
    display: block;
`;

const StyledFormControl = styled.input`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #ced4da;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 1rem;
    &:focus {
        border-color: #80bdff;
        box-shadow: 0 0 5px rgba(128, 189, 255, 0.5);
    }
    @media (max-width: 576px) {
        font-size: 0.9rem;
    }
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #ced4da;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 1rem;
    &:focus {
        border-color: #80bdff;
        box-shadow: 0 0 5px rgba(128, 189, 255, 0.5);
    }
    @media (max-width: 576px) {
        font-size: 0.9rem;
    }
`;

const StyledButton = styled.button`
    padding: 12px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #0056b3;
    }
    @media (max-width: 576px) {
        font-size: 0.9rem;
        padding: 10px 16px;
    }
`;

const StyledTable = styled.table`
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border-collapse: separate;
    width: 100%;
    margin-top: 20px;
    th, td {
        border: none;
        padding: 15px;
        text-align: center;
    }
    thead th {
        background-color: #007bff;
        color: #ffffff;
        font-weight: bold;
        text-transform: uppercase;
    }
    tbody tr:nth-child(odd) {
        background-color: #f2f2f2;
    }
    tbody tr:hover {
        background-color: #e9ecef;
    }
    @media (max-width: 576px) {
        th, td {
            padding: 10px;
        }
    }
`;

const ErrorAlert = styled.div`
    margin-top: 10px;
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 10px;
    border-radius: 5px;
`;

const CustomCheckbox = muiStyled(Checkbox)(({ theme }) => ({
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

const CreateNewForm = () => {
    const [formName, setFormName] = useState('');
    const [attributes, setAttributes] = useState([{ name: 'department', type: 'text' }]);
    const [attributeName, setAttributeName] = useState('');
    const [attributeType, setAttributeType] = useState('text');
    const [error, setError] = useState('');
    const tokendata = getTokenData();
    const role = tokendata.role;
    
    const [to, setTo] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [senderlist, setSenderList] = useState([
        { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept: 'ADS' },
        { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false, dept: 'CIVIL' },
        { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'CSBS' },
    ]);

    const notifySuccess = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
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
            theme: "colored",
            transition: Zoom,
        });
    };

    const addAttribute = (e) => {
        e.preventDefault();
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
    
        // Convert selectedEmails array to JSON
        const usergroup = JSON.stringify(selectedEmails); // Convert to JSON array
    
        const newForm = { formName, attributes, usergroup };
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tables/create-table`, newForm);
            notifySuccess(response.data);
        } catch (error) {
            notifyFailure(error.response ? error.response.data : 'No response from server');
        }
    };

    return (
        <StyledContainer>
            {role === 'IQAC' ? (
                <>
                    <Title>Create Form</Title>
                    <form>
                        <div>
                            <StyledFormLabel>Form Name</StyledFormLabel>
                            <StyledFormControl
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1, marginRight: '10px' }}>
                                <StyledFormLabel>Attribute Name</StyledFormLabel>
                                <StyledFormControl
                                    type="text"
                                    value={attributeName}
                                    onChange={(e) => setAttributeName(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1, marginLeft: '10px' }}>
                                <StyledFormLabel>Attribute Type</StyledFormLabel>
                                <StyledSelect 
                                    value={attributeType} 
                                    onChange={(e) => setAttributeType(e.target.value)}
                                >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="file">File</option>
                                    <option value="link">Link</option>
                                </StyledSelect>
                            </div>
                        </div>
                        <StyledButton onClick={addAttribute}>Add Attribute</StyledButton>
                        {error && <ErrorAlert>{error}</ErrorAlert>}

                        <StyledTable>
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
                                            <StyledButton
                                                onClick={() => removeAttribute(index)}
                                                disabled={attribute.name === 'department'}
                                            >
                                                Remove
                                            </StyledButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </StyledTable>

                        {/* Usergroup selection */}
                        <div>
                            <StyledFormLabel>Select User Groups</StyledFormLabel>
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
                        </div>

                        <div>
                            <StyledFormLabel>Other Recipient Emails (comma-separated)</StyledFormLabel>
                            <StyledFormControl
                                type="email"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>

                        <StyledButton onClick={handleSubmit}>Create Form</StyledButton>
                    </form>
                    <ToastContainer />
                </>
            ) : (
                <div>Access Denied</div>
            )}
        </StyledContainer>
    );
};

export default CreateNewForm;
