import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getTokenData } from './authUtils';

// Styled Components


// Sidebar Styles


const ProfileContainer = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;



const Username = styled.h3`
    padding: 10px;
    font-weight: bold;
    font-size: 24px;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const ApprovalStatus = styled.p`
    color: #2ecc71;
    margin: 0;
    font-style: italic;
    font-size: 16px;
`;

const ProfileDetails = styled.div`
    width: 100%;
    line-height: 1.6;
`;

const ProfileDetailsItem = styled.p`
    margin: 10px 0;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    transition: background 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    b {
        color: #ffffff;
    }
`;

// Main Content Styles






const TabContent = styled.div`
    background-color: white;
 padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const ContentHeader = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    color: #34495e;
    text-align: left;
`;

// Table Styles


const TableCell = styled.td`
    padding: 15px;
    border: 1px solid #ddd;
    font-size: 16px;
    color: #333;

    &:first-child {
        background-color: #f0f0f0;
        font-weight: bold;
    }

    &:nth-child(2) {
        background-color: #ffffff;
    }

    &:hover {
        background-color: #f5f5f5;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;

// Button Group Styles
const ButtonGroup = styled.div`
    text-align: right;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    margin-left: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
`;

const SaveButton = styled(Button)`
    background-color: #2ecc71;
    color: white;

    &:hover {
        background-color: #27ae60;
    }
`;

const EditButton = styled(Button)`
    background-color: #3498db;
    color: white;

    &:hover {
        background-color: #2980b9;
    }
`;

// Styled Components
const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #eef2f5;
    font-family: 'Arial', sans-serif;
    flex-direction: column; /* Default to column for mobile-first design */

    @media (min-width: 768px) {
        flex-direction: row; /* Change to row layout for larger screens */
    }
`;

// Sidebar Styles
const Sidebar = styled.div`
    width: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #1c3f69, #164863);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    margin-bottom: 20px; /* Add margin for stacking on small screens */

    &:hover {
        background: linear-gradient(135deg, #1c3f69, #1a4d7d);
    }

    @media (min-width: 768px) {
        width: 350px;
        margin-bottom: 0; /* Remove margin for side-by-side layout */
    }
`;

const ProfilePicture = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
    }

    @media (min-width: 768px) {
        width: 150px;
        height: 150px;
    }
`;

// Main Content Styles
const MainContent = styled.div`
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 768px) {
        padding: 20px;
    }
`;

const TabContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* Allow tabs to wrap on smaller screens */
    margin-bottom: 10px;
    border-bottom: 2px solid #ddd;
`;

const Tab = styled.button`
    padding: 10px 15px;
    margin-right: 5px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
    color: #34495e;
    font-size: 14px;

    &.active {
        border-bottom: 2px solid #3498db;
        color: #3498db;
        font-weight: bold;
    }

    @media (min-width: 768px) {
        padding: 15px 20px;
        margin-right: 10px;
        font-size: 16px;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;

    td, th {
        font-size: 14px;
        padding: 10px;
    }

    @media (min-width: 768px) {
        margin: 20px 0;

        td, th {
            font-size: 16px;
            padding: 15px;
        }
    }
`;

// File Input Styles
const FileInput = styled.input`
    margin-top: 10px;
    font-size: 10px;
    cursor: pointer;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px;

    @media (min-width: 768px) {
        font-size: 12px;
        padding: 5px 10px;
    }
`;


// React Component
const Faculty_Dashboard = () => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const token = getTokenData();
    const facultyId = token.username.trim();

    const [facultyData, setFacultyData] = useState({
        faculty_id: facultyId,
        Name: '',
        profilePicture: 'https://via.placeholder.com/150',
        department: '',
        Designation: '',
        Email: '',
        Phone: '',
        DateOfJoining: '',
        Qualification: '',
        Experience: '',
        PapersPublished: '',
        Conferences: '',
        BooksPublished: '',
        Patents: '',
        Awards: '',
        GoogleScholarId: '',
        ScopusId: '',
    });

    useEffect(() => {
        fetchFacultyData();
    }, []);

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/facultyData/getProfileData/${facultyId}`, {
                headers: {
                    Authorization: `Bearer ${getTokenData().token}`
                }
            });
            if (response.data) {
                setFacultyData(response.data);
            } else {
                console.warn('No data found');
            }
        } catch (error) {
            console.error('Error fetching faculty data:', error);
        }
    };

    const handleChangeProfile = (e) => {
        const { name, value } = e.target;
        setFacultyData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async () => {
        setIsEditingProfile(false);
        try {
            const response = await axios.post('http://localhost:3000/facultyData/updateProfileData', facultyData, {
                headers: {
                    Authorization: `Bearer ${getTokenData().token}`,
                }
            });
            console.log('Profile data saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving profile data:', error);
            alert('Failed to save profile data');
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e .target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            const formData = new FormData();
            formData.append('profilePicture', file);
            try {
                const response = await axios.put(`http://localhost:3000/facultyData/updateProfilePicture/${facultyId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${getTokenData().token}`,
                    },
                });
                if (response.data.success) {
                    setFacultyData(prevState => ({
                        ...prevState,
                        profilePicture: response.data.profilePicturePath,
                    }));
                    alert('Profile picture updated successfully.');
                } else {
                    alert('Failed to update profile picture.');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                alert('Failed to upload profile picture.');
            }
        } else {
            alert('Please upload a JPEG file.');
        }
    };

    const renderPersonalInfo = () => (
        <Table>
            <tbody>
                {['faculty_id', 'Name', 'department' , 'Designation', 'Email', 'Phone', 'DateOfJoining', 'Qualification', 'Experience'].map((key, index) => (
                    <tr key={index}>
                        <TableCell><strong>{camelToSpaced(key)}:</strong></TableCell>
                        <TableCell>
                            {isEditingProfile ? (
                                <Input
                                    type="text"
                                    name={key}
                                    value={facultyData[key]}
                                    onChange={handleChangeProfile}
                                />
                            ) : (
                                facultyData[key] || 'N/A'
                            )}
                        </TableCell>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const camelToSpaced = (str) => {
        if (str === "faculty_id") {
            return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase());
    };

    const renderProfessionalInfo = () => (
        <Table>
            <tbody>
                {['PapersPublished', 'Conferences', 'BooksPublished', 'Patents', 'Awards', 'GoogleScholarId', 'ScopusId'].map((key, index) => (
                    <tr key={index}>
                        <TableCell><strong>{camelToSpaced(key)}:</strong></TableCell>
                        <TableCell>
                            {isEditingProfile ? (
                                <Input
                                    type="text"
                                    name={key}
                                    value={facultyData[key]}
                                    onChange={handleChangeProfile}
                                />
                            ) : (
                                facultyData[key] || 'N/A'
                            )}
                        </TableCell>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderContent = () => {
        return (
            <TabContent>
                <ContentHeader>{activeTab === 'personal' ? 'Personal Information' : 'Professional Information'}</ContentHeader>
                {activeTab === 'personal' ? renderPersonalInfo() : renderProfessionalInfo()}
                <ButtonGroup>
                    {isEditingProfile ? (
                        <SaveButton onClick={handleSaveProfile}>Save</SaveButton>
                    ) : (
                        <EditButton onClick={handleEditProfile}>Edit</EditButton>
                    )}
                </ButtonGroup>
            </TabContent>
        );
    };

    return (
        <Container>
            <Sidebar>
                <ProfileContainer>
                    <ProfilePicture 
                        src={facultyData.profilePicture ? `http://localhost:3000/${facultyData.profilePicture}` : 'default-profile-picture-path'} 
                        alt="Profile" 
                    />
                    <FileInput type="file" onChange={handleProfilePictureChange} />
                    <Username>{facultyData.Name}</Username>
                    <ApprovalStatus>{facultyData.Designation}</ApprovalStatus>
                </ProfileContainer>
                <ProfileDetails>
                    <ProfileDetailsItem><b>Faculty ID:</b> {facultyData.faculty_id}</ProfileDetailsItem>
                    <ProfileDetailsItem><b>Email:</b> {facultyData.Email}</ProfileDetailsItem>
                    <ProfileDetailsItem><b>Phone:</b> {facultyData.Phone}</ProfileDetailsItem>
                    <ProfileDetailsItem><b>Qualification:</b> {facultyData.Qualification}</ProfileDetailsItem>
                </ProfileDetails>
            </Sidebar>

            <MainContent>
                <TabContainer>
                    <Tab onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Info</Tab>
                    <Tab onClick={() => setActiveTab('professional')} className={activeTab === 'professional' ? 'active' : ''}>Professional Info</Tab>
                </TabContainer>

                {renderContent()}
            </MainContent>
        </Container>
    );
};

export default Faculty_Dashboard;