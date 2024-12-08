




import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getTokenData } from './authUtils';

// Styled Components
const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Arial', sans-serif;
    flex-direction: column;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Sidebar = styled.div`
    width: 100%;
    padding: 20px;
    background: linear-gradient(180deg, #2c3e50, #34495e);
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); 
    border-radius: 10px; 
    transition: background 0.3s ease;
    overflow-y: auto; 

    @media (min-width: 600px) {
        width: 300px;
    }

    &:hover {
        background: linear-gradient(180deg, #34495e, #2c3e50);
    }
`;

const ProfileContainer = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const ProfilePicture = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
    }

    @media (max-width: 767px) {
        width: 100px;
        height: 100px;
    }
`;

const FileInput = styled.input`
    margin-top: 10px; 
    font-size: 12px;
    cursor: pointer;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    transition: background 0.3s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
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
`;

// Main Content Styles
const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    transition: all 0.3s ease;

    @media (max-width: 599px) {
        padding: 10px;
        width: 100%;
    }

    &:hover {
        box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
    }
`;

const TabContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
    flex-wrap: wrap;

    @media (max-width: 599px) {
        padding: 10px;
        width: 100%;
    }
`;

const Tab = styled.button`
    padding: 15px 20px;
    margin-right: 10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
    color: #34495e;
    font-size: 16px;
    flex: 1;

    @media (max-width: 600px) {
        flex: 1;
        text-align: center;
    }

    &.active {
        border-bottom: 2px solid #3498db;
        color: #3498db;
        font-weight: bold;
    }
`;

const TabContent = styled.div`
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    @media (max-width: 599px) {
        padding: 10px;
        width: 100%;
    }
`;

const ContentHeader = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    color: #34495e;
    text-align: left;
`;

// Table Styles
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
`;

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
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s ease;

    @media (max-width: 767px) {
        font-size: 12px;
    }

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

// React Component
const Student_Dashboard = () => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    const token = getTokenData();
    const registrationNumber = token.username;
    console.log(registrationNumber+"ello");
    const [userData, setUserData] = useState({
        username: '',
        registrationNumber: registrationNumber,
        Department: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        tag: '',
        status: '',
        profilePicture: 'https://via.placeholder.com/150',
        undergraduate: 'CGPA',
        postgraduate: 'N/A',
        backlogsHistory: 'None',
        currentBacklogs: 'None',
        interestedInPlacement: '',
        workExperience: '',
    });

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/studentData/getProfileData/${registrationNumber}`, 
                {
                    headers: {
                        Authorization: `Bearer ${getTokenData().token}`
                    }
                }
            );
            if (response.data) {
                setUserData(response.data);
            } else {
                throw new Error('No data found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            alert('Failed to fetch student datas');
        }
        console.log(response.data);
    };

    const handleChangeProfile = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async () => {
        try {
            await axios.post('http://localhost:3000/studentData/updateProfileData', userData, {
                headers: {
                    Authorization: `Bearer ${getTokenData().token}`,
                }
            });
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Error saving profile data:', error);
            alert('Failed to save profile data');
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            const formData = new FormData();
            formData.append('profilePicture', file);
    
            try {
                const response = await axios.put(
                    `http://localhost:3000/studentData/updateProfilePicture/${userData.registrationNumber}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${getTokenData().token}`,
                        },
                    }
                );
    
                if (response.data.success) {
                    const relativePath = response.data.profilePicturePath;
                    setUserData((prevState) => ({
                        ...prevState,
                        profilePicture: relativePath,
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

    const camelToSpaced = (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase());
    };

    const renderPersonalInfo = () => (
        <Table>
            <tbody>
                {['username', 'registrationNumber','Department', 'email', 'phone', 'gender', 'dob', 'tag', 'status'].map((key, index) => (
                    <tr key={index}>
                        <TableCell><strong>{camelToSpaced(key)}:</strong></TableCell>
                        <TableCell>
                            {isEditingProfile ? (
                                <Input
                                    type="text"
                                    name={key}
                                    value={userData[key]}
                                    onChange={handleChangeProfile}
                                />
                            ) : (
                                userData[key] || 'N/A'
                            )}
                        </TableCell>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderAcademicInfo = () => (
        <Table>
            <tbody>
                {['undergraduate', 'postgraduate', 'backlogsHistory', 'currentBacklogs', 'interestedInPlacement', 'workExperience'].map((key, index) => (
                    <tr key={index}>
                        <TableCell><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></TableCell>
                        <TableCell>
                            {isEditingProfile ? (
                                <Input
                                    type="text"
                                    name={key}
                                    value={userData[key]}
                                    onChange={handleChangeProfile}
                                />
                            ) : (
                                userData[key] || 'N/A'
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
                <ContentHeader>{activeTab === 'personal' ? 'Personal Information' : 'Academic Information'}</ContentHeader>
                {activeTab === 'personal' ? renderPersonalInfo() : renderAcademicInfo()}
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
                        src={userData.profilePicture ? `http://localhost:3000/${userData.profilePicture}` : 'default-profile-picture-path'} 
                        alt="Profile" 
                    />
                    <FileInput type="file" onChange={handleProfilePictureChange} />
                    <Username>{userData.username}</Username>
                    <ApprovalStatus>{userData.status}</ApprovalStatus>
                </ProfileContainer>
                <ProfileDetails>
                    <ProfileDetailsItem>Registration Number: {userData.registrationNumber}</ProfileDetailsItem>
                    <ProfileDetailsItem>Email: {userData.email}</ProfileDetailsItem>
                    <ProfileDetailsItem>Department: {userData.Department}</ProfileDetailsItem>
                    <ProfileDetailsItem>DOB: {userData.dob}</ProfileDetailsItem>
                    <ProfileDetailsItem>Tag: {userData.tag}</ProfileDetailsItem>
                </ProfileDetails>
            </Sidebar>

            <MainContent>
                <TabContainer>
                    <Tab onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Info</Tab>
                    <Tab onClick={() => setActiveTab('academic')} className={activeTab === 'academic' ? 'active' : ''}>Academic Info</Tab>
                </TabContainer>
                {renderContent()}
            </MainContent>
        </Container>
    );
};

export default Student_Dashboard;