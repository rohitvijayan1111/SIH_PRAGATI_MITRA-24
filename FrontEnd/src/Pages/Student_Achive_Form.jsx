import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

const FormContainer = styled.div`
    width: 100%;
    max-width: 500px;
    padding: 30px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin: 50px auto;
    &:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
    }
`;

const FormTitle = styled.h2`
    text-align: center;
    color: #003366;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    position: relative;
    &::after {
        content: "";
        display: block;
        width: 50px;
        height: 3px;
        background-color: #4caf50;
        margin: 8px auto 0;
        border-radius: 2px;
    }
`;

const Label = styled.label`
    display: block;
    margin: 15px 0 5px;
    color: #555555;
    font-weight: 600;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    margin-top: 8px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;
    background: #f7f7f7;
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px #ffffff;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
    &:focus {
        border-color: #4CAF50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
    }
`;


const Select = styled.select`
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
    }
`;

const Button = styled.button`
    width: 40%;
    padding: 12px;
    margin: 20px 0;
    display: block;
    background-color: #057aef;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
    &:hover {
        background-color: #45a049;
        transform: translateY(-2px);
    }
    &:active {
        background-color: #3d8b40;
        transform: translateY(1px);
    }
`;


const Student_Achive_Form = () => {
    const students = [
        { id: 1, name: 'Kana', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    ];
    const [formData, setFormData] = useState({
        achievementType: '',
        serialNo: '',
        title: '',
        teamMembers: '',
        description: '',
        technologyUsed: '',
        conferenceDetails: '',
        startDate: '',
        endDate: '',
        outcomes: '',
        document: null,
        student_id: '1', 
        location: '',
        organizer: '',  
        eventDate: '',
        achievement: ' ',
        event_type:' ',
        research_area:' ', 
        department : ' ',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, document: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
       
        const formDataToSend = new FormData();
        formDataToSend.append('achievementType', formData.achievementType);
        formDataToSend.append('serialNo', formData.serialNo);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('teamMembers', formData.teamMembers);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('technologyUsed', formData.technologyUsed);
        formDataToSend.append('conferenceDetails', formData.conferenceDetails);
        formDataToSend.append('startDate', formData.startDate);
        formDataToSend.append('endDate', formData.endDate);
        formDataToSend.append('outcomes', formData.outcomes);
        formDataToSend.append('student_id', formData.student_id);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('eventDate', formData.eventDate); 
       formDataToSend.append('event_type', formData.event_type); 
        formDataToSend.append('achievement', formData.achievement);
        formDataToSend.append('organizer', formData.organizer); 
        formDataToSend.append('research_area', formData. research_area );  
        formDataToSend.append('department', formData. department );  
    
        if (formData.document) {
            formDataToSend.append('document', formData.document);
        }
    
        fetch('http://localhost:3000/studentform/submit', {
            method: 'POST',
            body: formDataToSend,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message); 
                    setFormData({
                        achievementType: '',
                        serialNo: '',
                        title: '',
                        teamMembers: '',
                        description: '',
                        technologyUsed: '',
                        conferenceDetails: '',
                        startDate: '',
                        endDate: '',
                        outcomes: '',
                        document: null,
                        location: '',
                        organizer: '',
                        eventDate: '',
                        achievement: '',
                        event_type: '',
                        research_area :' ',
                        department : ' ',
                    });
                    navigate('/dashboard/student_Achievement');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error submitting the form');
            });
    };
    

    const renderConditionalFields = () => {
        switch (formData.achievementType) {
            case 'Symposium':
                return (
                    <>   
                        <Label>S.No</Label>
                        <Input type="number" name="serialNo" onChange={handleChange} required />
                        <Label>Event Name</Label>
                        <Input type="text" name="title" onChange={handleChange} required />
                       <Label>Event Type</Label>
                        <Input type="text" name="event_type" onChange={handleChange} required />
                        
                        <Label>Team Members</Label>
                        <Input type="text" name="teamMembers" onChange={handleChange} required />
                        <Label>Location</Label>
                        <Input type="text" name="location" onChange={handleChange} required />
                        <Label>Organizer(s)</Label>
                        <Input type="text" name="organizer" onChange={handleChange} required />
                        
                        <Label>Achievement</Label>
                        <Input type="text" name="achievement" onChange={handleChange} required />
                    </>
                );
            case 'Patent':
                return (
                    <>   
                         <Label>S.No</Label>
                         <Input type="number" name="serialNo" onChange={handleChange} required />
                        <Label>Patent Number</Label>
                        <Input type="text" name="serialNo" onChange={handleChange} required />
                        <Label>Title of Invention</Label>
                        <Input type="text" name="title" onChange={handleChange} required />
                        <Label>Inventors' Names</Label>
                        <Input type="text" name="teamMembers" onChange={handleChange} required />
                       
                    </>
                );
            case 'Paper Publication':
                return (
                    <> 
                        <Label>S.No</Label>
                        <Input type="number" name="serialNo" onChange={handleChange} required />
                        <Label>Paper Title</Label>
                        <Input type="text" name="title" onChange={handleChange} required />
                        <Label>Authors Name</Label>
                        <Input type="text" name="teamMembers" onChange={handleChange} required />
                        <Label>Journal Name</Label>
                        <Input type="text" name="conferenceDetails" onChange={handleChange} required />
                        <Label>Research Area</Label>
                        <Input type="text" name="research_area" onChange={handleChange} required />

                    </>
                );
            case 'Hackathon':
                return (
                    <>
                        <Label>S.No</Label> 
                        <Input type="number" name="serialNo" onChange={handleChange} required />
                        <Label>Project Title</Label>
                        <Input type="text" name="title" onChange={handleChange} required />
                        <Label>Project Team Members</Label>
                        <Input type="text" name="teamMembers" onChange={handleChange} required />
                        <Label>Technology Used</Label>
                        <Input type="text" name="technologyUsed" onChange={handleChange} required />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <FormContainer>
            <FormTitle>Achievement Form</FormTitle>
            <form onSubmit={handleSubmit}>
                <Label>Select Achievement Type</Label>
                <Select name="achievementType" value={formData.achievementType} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Patent">Patent</option>
                    <option value="Paper Publication">Paper Publication</option>
                    <option value="Hackathon">Hackathon</option>
                </Select>

                <Label>Department</Label>
                <Select name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option value="IT">IT</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                </Select>

                {renderConditionalFields()}

            
             
                <Label>Start Date</Label>
                <Input type="date" name="startDate" onChange={handleChange} required />
                <Label>End Date</Label>
                <Input type="date" name="endDate" onChange={handleChange} required />
                <Label>Outcomes</Label>
                <Input type="text" name="outcomes" onChange={handleChange} required />
                <Label>Upload Document</Label>
                <Input type="file" onChange={handleFileChange} required />



                <Button type="submit">Submit</Button>
            </form>
        </FormContainer>
    );
};

export default Student_Achive_Form;
