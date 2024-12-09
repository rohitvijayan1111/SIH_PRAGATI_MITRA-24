import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { getTokenData } from './authUtils';
const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TitleC = styled.h2`
  text-align: center;
  color: #fff;
  background-color: #164863;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled.button`
  text-align: center;
  padding: 12px 20px;
  background-color: #164863;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  margin-top: 20px; // Add some margin to the button
`;

const AssignUser_Modal = ({ section, onClose, onAssign }) => {
  const [emailId, setEmailId] = useState('');
  const [emailError, setEmailError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailId(value);
    setEmailError(!emailRegex.test(value));
  };

  const handleAssign = () => {
    if (emailError) {
      toast.error("Invalid email format", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }
    onAssign(section, emailId);
    onClose();
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h3>Assign User for {section}</h3>
      <TextField
        label="Email ID of User"
        variant="outlined"
        fullWidth
        value={emailId}
        onChange={handleEmailChange}
        required
        error={emailError}
        helperText={emailError ? "Please enter a valid email address" : ""}
      />
      <StyledButton onClick={handleAssign}>Assign User</StyledButton>
      <StyledButton onClick={onClose} style={{ marginLeft: '10px', backgroundColor: '#f44336' }}>Cancel</StyledButton>
    </div>
  );
};

const CreateReport = () => {
  const [reportName, setReportName] = useState('');

  const [selectedSections, setSelectedSections] = useState({
    messageFromManagement: false,
    curricularDesign: false,
    researchWorks: false,
    facultyAchievement: false,
    studentAchievements: false,
    financialStatements: false,
    infrastructuralDevelopment: false,
    extraCurricularActivities: false,
  });
  const [assignedUsers, setAssignedUsers] = useState({});
 const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [deadline, setDeadline] = useState(null);
  const token=getTokenData();
  console.log(token);
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prev) => ({
      ...prev,
      [name]: checked,
    }));

    if (checked) {
      setCurrentSection(name);
      setShowAssignModal(true);
    }
  };

  const handleAssignUser  = (section, email) => {
    setAssignedUsers((prev) => ({
      ...prev,
      [section]: email,
    }));
    toast.success(`User  ${email} assigned to ${section}`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!reportName.trim()) {
      toast.error('Report name is required');
      return;
    }

    if (!deadline) {
      toast.error('Deadline is required');
      return;
    }

    const selectedSectionNames = Object.keys(selectedSections)
      .filter(section => selectedSections[section]);

    if (selectedSectionNames.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/report/create-report', {
        name: reportName,
        sections: selectedSectionNames,
        assignedUsers,
        createdBy:token.username, // From your auth context
        deadline
      });

      toast.success('Report created successfully');
      
      // Optional: Redirect or reset form
      // history.push(`/report/${response.data.reportId}`);
    } catch (error) {
      toast.error('Failed to create report');
      console.error(error);
    }
  };


  return (
    <Container>
      <TitleC>Create Report</TitleC>
      <TextField
        label="Report Name"
        variant="outlined"
        fullWidth
        value={reportName}
        onChange={(e) => setReportName(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <DatePicker
        label="Deadline"
        value={deadline}
        onChange={(newValue) => setDeadline(newValue)}
        renderInput={(params) => <TextField {...params} />}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.messageFromManagement}
            onChange={handleCheckboxChange}
            name="messageFromManagement"
          />
        }
        label="Message from Management"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.curricularDesign}
            onChange={handleCheckboxChange}
            name="curricularDesign"
          />
        }
        label="Curricular Design and Academic Performances"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.ITdetails}
            onChange={handleCheckboxChange}
            name="ITdetails"
          />
        }
        label="Department of IT"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.facultyAchievement}
            onChange={handleCheckboxChange}
            name="facultyAchievement"
          />
        }
        label="Faculty Achievement"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.studentAchievements}
            onChange={handleCheckboxChange}
            name="studentAchievements"
          />
        }
        label="Student Achievements"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.financialStatements}
            onChange={handleCheckboxChange}
            name="financialStatements"
          />
        }
        label="Financial Statements"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.infrastructuralDevelopment}
            onChange={handleCheckboxChange}
            name="infrastructuralDevelopment"
          />
        }
        label="Infrastructural Development"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedSections.extraCurricularActivities}
            onChange={handleCheckboxChange}
            name="extraCurricularActivities"
          />
        }
        label="Extra Curricular Activities"
      />
      <StyledButton onClick={handleSubmit}>Create Report</StyledButton>
      {showAssignModal && (
        <AssignUser_Modal
          section={currentSection}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignUser }
        />
      )}
      <ToastContainer />
    </Container>
  );
};

export default CreateReport;