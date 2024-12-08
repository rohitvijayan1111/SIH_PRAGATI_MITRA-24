// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { getTokenData } from './authUtils';

// const InfoCard = ({ label, value, isEditing, onChange }) => {
//   return (
//     <InfoCardContainer>
//       <Label>{label}</Label>
//       {isEditing ? (
//         <Input
//           type="text"
//           value={value}
//           onChange={onChange}
//         />
//       ) : (
//         <Value>{value}</Value>
//       )}
//     </InfoCardContainer>
//   );
// };

// const Faculty_Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('personal');
//   const [isEditingPersonal, setIsEditingPersonal] = useState(false);
//   const [isEditingOther, setIsEditingOther] = useState(false);
//   const token = getTokenData();
//   const [personalDetails, setPersonalDetails] = useState({
//     FacultyId: token.username,  // New field
//     Name: 'Your Name',
//     Designation: 'Your Designation',
//     Email: 'Your Email',
//     Phone: 'Your Phone Number',
//     DateOfJoining: 'Date You Joined',
//     Qualification: 'Your Qualifications',
//     Experience: 'Your Experience',
// });


//   const [otherDetails, setOtherDetails] = useState({
//     PapersPublished: 'List of Papers',
//     Conferences: 'Details',
//     BooksPublished: 'List of Books',
//     Patents: 'List of Patents',
//     Awards: 'List of Awards',
//     GoogleScholarId: 'Link/ID',
//     ScopusId: 'Link/ID',
//   });

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const savePersonalDetails = async () => {
//     const url = 'http://localhost:3000/api/updatePersonalDetails'; // Endpoint for personal details

//     const payload = {
//         faculty_id: personalDetails.FacultyId, // Use the FacultyId for identification
//         Name: personalDetails.Name,
//         Designation: personalDetails.Designation,
//         Email: personalDetails.Email,
//         Phone: personalDetails.Phone,
//         DateOfJoining: personalDetails.DateOfJoining,
//         Qualification: personalDetails.Qualification,
//         Experience: personalDetails.Experience,
//     };

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             alert('Personal details updated successfully');
//             setIsEditingPersonal(false);
//         } else {
//             alert('Failed to update personal details');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while updating personal details');
//     }
// };

// const saveOtherDetails = async () => {
//   const url = 'http://localhost:3000/api/updateOtherDetails'; // Endpoint for other details

//   const payload = {
//       faculty_id: otherDetails.FacultyId, // Use the FacultyId for identification
//       PapersPublished: otherDetails.PapersPublished,
//       Conferences: otherDetails.Conferences,
//       BooksPublished: otherDetails.BooksPublished,
//       Patents: otherDetails.Patents,
//       Awards: otherDetails.Awards,
//       GoogleScholarId: otherDetails.GoogleScholarId,
//       ScopusId: otherDetails.ScopusId,
//   };

//   try {
//       const response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//           alert('Other details updated successfully');
//           setIsEditingOther(false);
//       } else {
//           alert('Failed to update other details');
//       }
//   } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while updating other details');
//   }
// };

//   const handleInputChange = (e, section, key) => {
//     if (section === 'personal') {
//       setPersonalDetails({
//         ...personalDetails,
//         [key]: e.target.value,
//       });
//     } else if (section === 'other') {
//       setOtherDetails({
//         ...otherDetails,
//         [key]: e.target.value,
//       });
//     }
//   };
  

//   const toggleEditPersonal = () => {
//     if (isEditingPersonal) {
//       saveOtherDetails();
//     } else {
//       setIsEditingPersonal(true);
//     }
//   };
  
//   const toggleEditOther = () => {
//     if (isEditingOther) {
//       savePersonalDetails();
//     } else {
//       setIsEditingOther(true);
//     }
//   };
  



//   return (
//     <DashboardContainer>
//       <DashboardBox>
//         <LeftBox>
//           {/* Replace ProfileIcon with a plain circle */}
//           <ProfileCircle />
//           <Name>{personalDetails.Name}</Name>
//           <p> {personalDetails.Designation}</p>
//           <p> {personalDetails.Qualification}</p>
//           <p> {personalDetails.Email}</p>
//           <p>{personalDetails.Phone}</p>
//         </LeftBox>
//         <RightBox>
//           <Title>FACULTY DASHBOARD</Title>
//           <Tabs>
//             <TabButton
//               className={activeTab === 'personal' ? 'active' : ''}
//               onClick={() => handleTabClick('personal')}
//             >
//               Personal Details
//             </TabButton>
//             <TabButton
//               className={activeTab === 'other' ? 'active' : ''}
//               onClick={() => handleTabClick('other')}
//             >
//               Other Details
//             </TabButton>
//           </Tabs>
//           {activeTab === 'personal' && (
//             <DetailsSection>
//               {Object.keys(personalDetails).map((key) => (
//                 <InfoCard
//                   key={key}
//                   label={`${key.replace(/([A-Z])/g, ' $1')}:`}
//                   value={personalDetails[key]}
//                   isEditing={isEditingPersonal}
//                   onChange={(e) => handleInputChange(e, 'personal', key)}
//                 />
//               ))}
//               <Button
//                 className={isEditingPersonal ? 'save' : 'edit'}
//                 onClick={toggleEditPersonal}
//               >
//                 {isEditingPersonal ? 'Save' : 'Edit'}
//               </Button>
//             </DetailsSection>
//           )}
//           {activeTab === 'other' && (
//             <DetailsSection>
//               {Object.keys(otherDetails).map((key) => (
//                 <InfoCard
//                   key={key}
//                   label={`${key.replace(/([A-Z])/g, ' $1')}:`}
//                   value={otherDetails[key]}
//                   isEditing={isEditingOther}
//                   onChange={(e) => handleInputChange(e, 'other', key)}
//                 />
//               ))}
//               <Button
//                 className={isEditingOther ? 'save' : 'edit'}
//                 onClick={toggleEditOther}
//               >
//                 {isEditingOther ? 'Save' : 'Edit'}
//               </Button>
//             </DetailsSection>
//           )}
//         </RightBox>
//       </DashboardBox>
//     </DashboardContainer>
//   );
// };

// const DashboardContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 20px;
// `;

// const DashboardBox = styled.div`
//   background-color: #f5f7fa;
//   display: flex;
//   padding: 20px;
//   width: 100%;
//   border-radius: 20px;
//   max-width: 1200px;
// `;

// const LeftBox = styled.div`
//   width: 20%;
//   padding: 20px;
//   background-color: rgb(238, 238, 247);
//   border-radius: 10px;
//   margin-right: 20px;
//   height: 400px;
//   margin-top: 30px;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;  
//   align-items: center; 
// `;

// const ProfileCircle = styled.div`
//   width: 80px;
//   height: 80px;
//   border-radius: 50%;
//   background-color: #ccc;
//   margin-bottom: 20px;
// `;

// const Name = styled.h2`
//   margin: 0;
// `;

// const RightBox = styled.div`
//   width: 75%;
//   padding: 20px;
//   background-color: #ffffff;
//   border-radius: 10px;
//   overflow-y: auto;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
// `;

// const Title = styled.h2`
//   text-align: center;
//   font-size: 28px;
//   font-weight: bold;
//   margin: 5px 0;
// `;

// const Tabs = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 10px;
// `;

// const TabButton = styled.button`
//   flex: 1;
//   padding: 10px;
//   background-color: rgb(255, 255, 255);
//   border: none;
//   border-radius: 10px 10px 0 0;
//   cursor: pointer;
//   font-weight: bold;
//   outline: none;
//   &.active {
//     background-color: rgb(238, 238, 247);
//     border-bottom: 2px solid #3498db;
//   }
// `;

// const DetailsSection = styled.div`
//   padding: 10px;
//   background-color: #f5f5f5;
//   border-radius: 0 10px 10px 10px;
// `;

// const InfoCardContainer = styled.div`
//   background-color: #ffffff;
//   width: 94%;
//   border-radius: 10px;
//   padding: 20px;
//   margin-bottom: 15px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const Label = styled.span`
//   font-weight: bold;
// `;

// const Value = styled.span``;

// const Input = styled.input`
//   padding: 5px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
// `;

// const Button = styled.button`
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-weight: bold;
//   margin-top: 10px;
//   transition: background-color 0.3s ease;
//   &:hover {
//     background-color: #3498db;
//     color: white;
//   }
//   &:focus {
//     outline: none;
//   }
//   &.edit {
//     background-color: #003060;
//     color: white;
//   }
//   &.save {
//     background-color: #366ca1;
//     color: white;
//   }
//   &.save:hover,
//   &.edit:hover {
//     background-color: #2980b9;
//   }
// `;

// export default Faculty_Dashboard;



// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
// import { getTokenData } from './authUtils';

// // Styled Components
// const Container = styled.div`
//     display: flex;
//     min-height: 100vh;
//     background-color: #eef2f5;
// `;

// // const Sidebar = styled.div`
// //     width: 350px;
// //     padding: 20px;
// //     background-color: #164863;
// //     background: linear-gradient(to bottom, #164863, #164863, #ffffff);
// //     color: white;
// //     display: flex;
// //     flex-direction: column;
// //     align-items: center;
// //     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// // `;

// // const ProfileContainer = styled.div`
// //     text-align: center;
// //     margin-bottom: 20px;
// // `;

// // const ProfilePicture = styled.img`
// //     width: 150px;
// //     height: 150px;
// //     border-radius: 50%;
// //     object-fit: cover;
// //     margin-bottom: 10px;
// //     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
// //     transition: transform 0.3s ease;

// //     &:hover {
// //         transform: scale(1.1);
// //         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
// //     }
// // `;

// // const FileInput = styled.input`
// //     margin-top: 10px;
// //     font-size: 12px;
// //     margin-left: 100px;
// //     cursor: pointer;
// // `;

// // const Username = styled.h3`
// //     padding: 10px;
// //     font-weight: bold;
// //     font-size: 20px;
// //     margin: 0;
// // `;

// // const ApprovalStatus = styled.p`
// //     color: #2ecc71;
// //     margin: 0;
// // `;

// // const ProfileDetails = styled.div`
// //     width: 100%;
// //     line-height: 2;
// // `;

// // const ProfileDetailsItem = styled.p`
// //     margin: 10px 0;
// // `;

// const Sidebar = styled.div`
//     width: 350px;
//     padding: 20px;
//     background: linear-gradient(135deg, #1c3f69, #164863);
//     color: white;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
//     border-radius: 10px;
//     transition: background 0.3s ease;

//     &:hover {
//         background: linear-gradient(135deg, #1c3f69, #1a4d7d);
//     }
// `;

// const ProfileContainer = styled.div`
//     text-align: center;
//     margin-bottom: 20px;
// `;

// const ProfilePicture = styled.img`
//     width: 150px;
//     height: 150px;
//     border-radius: 50%;
//     object-fit: cover;
//     margin-bottom: 10px;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
//     transition: transform 0.3s ease, box-shadow 0.3s ease;

//     &:hover {
//         transform: scale(1.1);
//         box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
//     }
// `;

// const FileInput = styled.input`
//     margin-top: 10px;
//     font-size: 12px;
//     margin-left: 100px;
//     cursor: pointer;
//     background-color: #2ecc70;
//     color: white;
//     border: none;
//     border-radius: 5px;
//     padding: 5px 10px;
//     transition: background 0.3s ease;

//     &:hover {
//         background-color: #28a745;
//     }
// `;

// const Username = styled.h3`
//     padding: 10px;
//     font-weight: bold;
//     font-size: 24px;
//     margin: 0;
//     text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
// `;

// const ApprovalStatus = styled.p`
//     color: #2ecc71;
//     margin: 0;
//     font-style: italic;
//     font-size: 16px;
// `;

// const ProfileDetails = styled.div`
//     width: 100%;
//     line-height: 1.6;
// `;

// const ProfileDetailsItem = styled.p`
//     margin: 10px 0;
//     padding: 5px;
//     background: rgba(255, 255, 255, 0.1);
//     border-radius: 5px;
//     transition: background 0.3s ease;

//     &:hover {
//         background: rgba(255, 255, 255, 0.2);
//     }

//     b {
//         color: #ffffff;
//     }
// `;

// const MainContent = styled.div`
//     flex: 1;
//     padding: 20px;
//     display: flex;
//     flex-direction: column;
//     background-color: white;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//     transition: all 0.8s ease;

//     &:hover {
//         box-shadow: 0 4px 20px rgba(0, 0, 0, 0.13);
//     }
// `;

// const TabContainer = styled.div`
//     display: flex;
//     margin-bottom: 20px;
//     border-bottom: 2px solid #ddd;
// `;

// const Tab = styled.button`
//     padding: 15px 20px;
//     margin-right: 10px;
//     cursor: pointer;
//     background-color: transparent;
//     border: none;
//     border-bottom: 2px solid transparent;
//     transition: all 0.3s ease;
//     color: #34495e;
//     font-size: 16px;

//     &.active {
//         border-bottom: 2px solid #3498db;
//         color: #3498db;
//     }
// `;

// const TabContent = styled.div`
//     background-color: white;
//     padding: 20px;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const ContentHeader = styled.h2`
//     font-size: 24px;
//     margin-bottom: 20px;
// `;

// // const Table = styled.table`
// //     width: 100%;
// //     border-collapse: collapse;
// // `;

// // const TableCell = styled.td`
// //     padding: 10px;
// //     border: 1px solid #ddd;
// // `;

// // const Input = styled.input`
// //     width: 100%;
// //     padding: 8px;
// //     margin: 5px 0;
// //     border-radius: 4px;
// //     border: 1px solid #ddd;
// // `;


// const Table = styled.table`
//     width: 100%;
//     border-collapse: collapse;
//     margin: 20px 0;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//     border-radius: 8px;
//     overflow: hidden;
// `;

// const TableCell = styled.td`
//     padding: 15px;
//     border: 1px solid #ddd;
    
//     font-size: 16px;
//     color: #333;
//     &:first-child {
//         background-color: #f0f0f0;
//         font-weight: bold;
//     }
//     &:nth-child(2) {
//         background-color: #ffffff;
//     }
//     &:hover {
//         background-color: #f5f5f5;
//     }
// `;

// const Input = styled.input`
//     width: 100%;
//     padding: 8px;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     font-size: 14px;
//     &:focus {
//         border-color: #007bff;
//         outline: none;
//         box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
//     }
// `;


// const ButtonGroup = styled.div`
//     text-align: right;
//     margin-top: 20px;
// `;

// const Button = styled.button`
//     padding: 10px 20px;
//     margin-left: 10px;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     transition: background-color 0.3s ease;
// `;

// const SaveButton = styled(Button)`
//     background-color: #2ecc71;
//     color: white;

//     &:hover {
//         background-color: #27ae60;
//     }
// `;


// const EditButton = styled(Button)`
//     background-color: #3498db;
//     color: white;

//     &:hover {
//         background-color: #2980b9;
//     }
// `;

// // React Component
// const Faculty_Dashboard = () => {
//     const [isEditingProfile, setIsEditingProfile] = useState(false);
//     const [activeTab, setActiveTab] = useState('personal'); // Set the active tab state
//     const token = getTokenData(); // Get token data (assumed function)
//     const facultyId = token.username.trim(); // Get faculty ID from the token

//     const [facultyData, setFacultyData] = useState({
//         faculty_id: facultyId,
//         Name: '',
//         profilePicture: 'https://via.placeholder.com/150',
//         Designation: '',
//         Email: '',
//         Phone: '',
//         DateOfJoining: '',
//         Qualification: '',
//         Experience: '',
//         PapersPublished: '',
//         Conferences: '',
//         BooksPublished: '',
//         Patents: '',
//         Awards: '',
//         GoogleScholarId: '',
//         ScopusId: '',
//     });

//     useEffect(() => {
//         fetchFacultyData();
//     }, []);

//     const fetchFacultyData = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/facultyData/getProfileData/${facultyId}`, {
//                 headers: {
//                     Authorization: `Bearer ${getTokenData().token}`
//                 }
//             });
//             if (response.data) {
//                 setFacultyData(response.data);
//             } else {
//                 console.warn('No data found');
//             }
//         } catch (error) {
//             console.error('Error fetching faculty data:', error);
//         }
//     };

//     const handleChangeProfile = (e) => {
//         const { name, value } = e.target;
//         setFacultyData(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const handleEditProfile = () => {
//         setIsEditingProfile(true);
//     };

//     const handleSaveProfile = async () => {
//         setIsEditingProfile(false);
//         try {
//             const response = await axios.post('http://localhost:3000/facultyData/updateProfileData', facultyData, {
//                 headers: {
//                     Authorization: `Bearer ${getTokenData().token}`,
//                 }
//             });
//             console.log('Profile data saved successfully:', response.data);
//         } catch (error) {
//             console.error('Error saving profile data:', error);
//             alert('Failed to save profile data');
//         }
//     };

//     const handleProfilePictureChange = async (e) => {
//         const file = e.target.files[0];
//         if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
//             const formData = new FormData();
//             formData.append('profilePicture', file);
//             try {
//                 const response = await axios.put(`http://localhost:3000/facultyData/updateProfilePicture/${facultyId}`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         Authorization: `Bearer ${getTokenData().token}`,
//                     },
//                 });
//                 if (response.data.success) {
//                     setFacultyData(prevState => ({
//                         ...prevState,
//                         profilePicture: response.data.profilePicturePath,
//                     }));
//                     alert('Profile picture updated successfully.');
//                 } else {
//                     alert('Failed to update profile picture.');
//                 }
//             } catch (error) {
//                 console.error('Error uploading profile picture:', error);
//                 alert('Failed to upload profile picture.');
//             }
//         } else {
//             alert('Please upload a JPEG file.');
//         }
//     };


    
// //{camelToSpaced(key)}:
//     const renderPersonalInfo = () => (
//         <Table>
//             <tbody>
//                 {['faculty_id', 'Name', 'Designation', 'Email', 'Phone', 'DateOfJoining', 'Qualification', 'Experience'].map((key, index) => (
//                     <tr key={index}>
//                         <TableCell><strong>{camelToSpaced(key)}:</strong></TableCell>
                        
//                         <TableCell>
                        
//                             {isEditingProfile ? (
//                                 <Input
//                                     type="text"
//                                     name={key}
//                                     value={facultyData[key]}
//                                     onChange={handleChangeProfile}
//                                 />
//                             ) : (
//                                 facultyData[key] || 'N/A'
//                             )}
//                         </TableCell>
//                     </tr>
//                 ))}
//             </tbody>
//         </Table>
//     );

//     const camelToSpaced = (str) => {
//         if (str == "faculty_id"){
//             return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

//         }
//         return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase());
//     };

//     const renderProfessionalInfo = () => (
//         <Table>
//             <tbody>
//                 {['PapersPublished', 'Conferences', 'BooksPublished', 'Patents', 'Awards', 'GoogleScholarId', 'ScopusId'].map((key, index) => (
//                     <tr key={index}>
//                         <TableCell><strong>{camelToSpaced(key)}:</strong></TableCell>
//                         <TableCell>
//                             {isEditingProfile ? (
//                                 <Input
//                                     type="text"
//                                     name={key}
//                                     value={facultyData[key]}
//                                     onChange={handleChangeProfile}
//                                 />
//                             ) : (
//                                 facultyData[key] || 'N/A'
//                             )}
//                         </TableCell>
//                     </tr>
//                 ))}
//             </tbody>
//         </Table>
//     );

//     const renderContent = () => {
//         return (
//             <TabContent>
//                 <ContentHeader>{activeTab === 'personal' ? 'Personal Information' : 'Professional Information'}</ContentHeader>
//                 {activeTab === 'personal' ? renderPersonalInfo() : renderProfessionalInfo()}
//                 <ButtonGroup>
//                     {isEditingProfile ? (
//                         <SaveButton onClick={handleSaveProfile}>Save</SaveButton>
//                     ) : (
//                         <EditButton onClick={handleEditProfile}>Edit</EditButton>
//                     )}
//                 </ButtonGroup>
//             </TabContent>
//         );
//     };

//     return (
//         <Container>
//             <Sidebar>
//                 <ProfileContainer>
//                     <ProfilePicture 
//                         src={facultyData.profilePicture ? `http://localhost:3000/${facultyData.profilePicture}` : 'default-profile-picture-path'} 
//                         alt="Profile" 
//                     />
//                     <FileInput type="file" onChange={handleProfilePictureChange} />
//                     <Username>{facultyData.Name}</Username>
//                     <ApprovalStatus>{facultyData.Designation}</ApprovalStatus>
//                 </ProfileContainer>
//                 <ProfileDetails>
//                     <ProfileDetailsItem><b>Faculty ID:</b> {facultyData.faculty_id}</ProfileDetailsItem>
//                     <ProfileDetailsItem><b>Email:</b> {facultyData.Email}</ProfileDetailsItem>
//                     <ProfileDetailsItem><b>Phone:</b> {facultyData.Phone}</ProfileDetailsItem>
//                     <ProfileDetailsItem><b>Date of Joining:</b> {facultyData.DateOfJoining}</ProfileDetailsItem>
//                     <ProfileDetailsItem><b>Qualification:</b> {facultyData.Qualification}</ProfileDetailsItem>
//                     <ProfileDetailsItem><b>Experience:</b> {facultyData.Experience}</ProfileDetailsItem>
//                 </ProfileDetails>
//             </Sidebar>

//             <MainContent>
//                 <TabContainer>
//                     <Tab onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Info</Tab>
//                     <Tab onClick={() => setActiveTab('professional')} className={activeTab === 'professional' ? 'active' : ''}>Professional Info</Tab>
//                 </TabContainer>

//                 {renderContent()}
//             </MainContent>
//         </Container>
//     );
// };

// export default Faculty_Dashboard;



import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getTokenData } from './authUtils';

// Styled Components
const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #eef2f5;
    font-family: 'Arial', sans-serif;
`;

// Sidebar Styles
const Sidebar = styled.div`
    width: 350px;
    padding: 20px;
    background: linear-gradient(135deg, #1c3f69, #164863);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    transition: background 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #1c3f69, #1a4d7d);
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
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
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

    b {
        color: #ffffff;
    }
`;

// Main Content Styles
const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
`;

const TabContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
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

    &.active {
        border-bottom: 2px solid #3498db;
        color: #3498db;
        font-weight: bold;
    }
`;

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