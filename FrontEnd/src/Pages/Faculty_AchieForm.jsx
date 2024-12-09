import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs'; 
import { ToastContainer, toast, Zoom } from 'react-toastify';
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

const Title = styled.h2`
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
    margin: 1.5em 0 0.5em;
    font-size: 1.1rem;
    color: #555;
    font-weight: bold;
    letter-spacing: 0.5px;
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

const FileInput = styled(Input).attrs({ type: 'file' })`
    margin-top: 10px;
`;

const Select = styled.select`
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

const Button = styled.button`
    width:45%;
    padding: 14px;
    margin-top: 20px;
    background: linear-gradient(135deg, #4CAF50, #388E3C);
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease-in-out, box-shadow 0.3s ease;
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
    &:hover {
        background: linear-gradient(135deg, #388E3C, #2E7D32);
        transform: translateY(-3px);
    }
    &:active {
        transform: translateY(2px);
        box-shadow: 0 2px 6px rgba(76, 175, 80, 0.4);
    }
`;

const SuccessMessage = styled.p`
    margin-top: 20px;
    font-size: 1.2rem;
    color: #4CAF50;
    text-align: center;
    font-weight: 600;
    animation: fadeIn 0.5s ease-in-out;
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const ErrorMessage = styled.p`
    margin-top: 20px;
    font-size: 1.2rem;
    color: #F44336;
    text-align: center;
    font-weight: 600;
    animation: fadeIn 0.5s ease-in-out;
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const FieldWrapper = styled.div`
    margin-bottom: 1.5rem;
`;

const Faculty_AchieForm = () => {
    const [formData, setFormData] = useState({
        achievementType: '',
        title: '',
        description: '',
        date: '',
        document: null,
        authors: '',
        inventors: '',   
        journal: '',
        publicationDate: '',
        researchArea: '',
        paperType: '',
        conferenceDetails: '',
        patentNumber: '',
        patentType: '',
        filedDate: '',
        patentStatus: '',
        issueDate: '',
        awardTitle: '',
        awardingBody: '',
        category: '',
        awardDescription: '',
        recipient: '',
        recognitionLevel: '',
        conferenceTitle: '',
        presenter: '',
        location: '',
        datePresented: '',
        topic: '',
        organizer: '',
        bookTitle: '',
        author_name: '',
        publisher: '',
        isbn: '',
        book_category: '',
        department: '',
        
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate' || name === 'endDate') {
            setFormData({ ...formData, [name]: dayjs(value).format('YYYY-MM-DD') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleFileChange = (e) => {
        setFormData({ ...formData, document: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post('http://localhost:3000/facultyform/submit', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
           
        toast.success('Form submitted successfully!', {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
            transition: Zoom,
        });

      
            setFormData({
                achievementType: '',
                title: '',
                description: '',
                date: '',
                document: null,
                authors: '',
                inventors: '',    
                journal: '',
                publicationDate: '',
                researchArea: '',
                paperType: '',
                conferenceDetails: '',
                patentNumber: '',
                patentType: '',
                filedDate: '',
                patentStatus: '',
                issueDate: '',
                awardTitle: '',
                awardingBody: '',
                category: '',
                awardDescription: '',
                recipient: '',
                recognitionLevel: '',
                conferenceTitle: '',
                presenter: '',
                location: '',
                datePresented: '',
                topic: '',
                organizer: '',
                bookTitle: '',
                author_name: '',
                publisher: '',
                isbn: '',
                book_category: '',
                department: '',
                
            });

            setTimeout(() => {
                setSuccessMessage('');
                navigate('/dashboard/faculty_Achievement');
            }, 3000);
    
        } catch (error) {
            setErrorMessage('An error occurred while submitting the form.');
        }
    };

    const achievementFields = {
        "Research Papers": [
            { label: "Paper Title", name: "title" },
            { label: "Authors Name", name: "authors" },
            { label: "Journal Name", name: "journal" },
          
            { label: "Publication Date", name: "publicationDate", type: "date" },
            { label: "Research Area", name: "researchArea" },
            { label: "Paper Details", name: "paperType" },
            { label: "Conference Details", name: "conferenceDetails" },
            { label: "Document", name: "document", type: "file" }
        ],
        "Patents": [
            { label: "Patent Number", name: "patentNumber" },
            { label: "Title of Invention", name: "title" },
            { label: "Inventors Names", name: "inventors" },
            { label: "Patent Type", name: "patentType" },
            { label: "Filing Date", name: "filedDate", type: "date" },
            { label: "Patent Status", name: "patentStatus" },
            { label: "Issue Date", name: "issueDate", type: "date" },
            { label: "Document", name: "document", type: "file" }
        ],
        "Award Received": [
            { label: "Award Name", name: "awardTitle" },
            { label: "Awarding Organization", name: "awardingBody" },
            { label: "Date Awarded", name: "date", type: "date" },
            { label: "Category", name: "category" },
            { label: "Description of Award", name: "awardDescription" },
            { label: "Recipient", name: "recipient" },
            { label: "Recognition Level", name: "recognitionLevel" },
            { label: "Award Image/Certificate", name: "awardImage", type: "file" }
        ],
        "Conference": [
            { label: "Conference Title", name: "conferenceTitle" },
            { label: "Presenter Name", name: "presenter" },
            { label: "Location", name: "location" },
            { label: "Date Presented", name: "datePresented", type: "date" },
            { label: "Conference Topic", name: "topic" },
            { label: "Organizer", name: "organizer" },
            { label: "Certificate", name: "certificateLink", type: "file" }
        ],
        "Book Published": [
            { label: "Book Title", name: "bookTitle" },
            { label: "Author Name", name: "author_name" },
            { label: "Publication Date", name: "publicationDate", type: "date" },
            { label: "Publisher", name: "publisher" },
            { label: "ISBN", name: "isbn" },
            { label: "Book Category", name: "book_category" },
            { label: "Document", name: "document", type: "file" }
        ]
    };


    const fields = achievementFields[formData.achievementType] || [];

    return (
        <FormContainer>
            <Title>Achievement</Title>
         
            <form onSubmit={handleSubmit}>
                <Label>Achievement Type</Label>
                <Select name="achievementType" value={formData.achievementType} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="Patents">Patents</option>
                    <option value="Award Received">Award Received</option>
                    <option value="Conference">Conference</option>
                    <option value="Book Published">Book Published</option>
                </Select>
                <Label>Department</Label>
                <Select name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option value="IT">IT</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                </Select>

                {fields.map((field, index) => (
                    <div key={index}>
                        <Label>{field.label}</Label>
                        {field.type === "file" ? (
                            <FileInput name={field.name} onChange={handleFileChange} />
                        ) : (
                            <Input
                                type={field.type || "text"}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                            />
                        )}
                    </div>
                ))}
               
                <Button type="submit">Submit</Button>
            </form>
            <ToastContainer />
        </FormContainer>
    );
};

export default Faculty_AchieForm;
