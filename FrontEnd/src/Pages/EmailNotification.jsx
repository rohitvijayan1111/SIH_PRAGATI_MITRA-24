import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { css } from 'styled-components';

const EmailNotificationContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }
`;

const Header = styled.h3`
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f4f4f4;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f4f4f4;
  resize: none;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const RecipientList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Keep two columns on smaller screens */
  }
`;

const RecipientItem = styled.li`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const SendButton = styled.button`
  background-color: #164863;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CustomCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap:10px;
`;

const CustomCheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  &:checked + span {
    background-color: #164863;
    border-color: #164863;
  }

  &:checked + span:after {
    display: block;
  }
`;

const CustomCheckboxLabel = styled.span`
  height: 18px;
  width: 18px;
  background-color: #eee;
  border: 2px solid #ccc;
  border-radius: 4px;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;

  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const EmailNotification = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [senderlist, setSenderList] = useState([
    { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept: 'ADS' },
    { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false, dept: 'CIVIL' },
    { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'CSBS' },
    { id: 4, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'CSD' },
    { id: 5, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'CSE' },
    { id: 6, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'EEE' },
    { id: 7, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'ECE' },
    { id: 8, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'EIE' },
    { id: 9, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'IT' },
    { id: 10, text: 'like22050.it@rmkec.ac.in', checked: false, dept: 'MECH' }
  ]);

  const textAreaRef = useRef(null);
  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

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

  const handleSendEmail = async () => {
    try {
      let selectedEmails = senderlist.filter(member => member.checked).map(member => member.text);

      if (to.trim() !== '') {
        const additionalEmails = to.split(',').map(email => email.trim());
        selectedEmails = [...selectedEmails, ...additionalEmails];
      }

      const response = await axios.post('http://localhost:3000/mail/send', {
        to: selectedEmails,
        subject: subject,
        desc: text
      });
      toast.success('Mail sent Successfully', {
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
      setTo('');
      setSubject('');
      setText('');
    } catch (error) {
      toast.error('Error!!!. Mail not sent', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <EmailNotificationContainer>
      <Header>Subject:</Header>
      <Input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <Header>Body:</Header>
      <TextArea ref={textAreaRef} placeholder="Email Body" value={text} onChange={(e) => setText(e.target.value)} required />
      <Header>Recipient Emails:</Header>
      <RecipientList>
        <RecipientItem>
          <CustomCheckboxWrapper onClick={handleSelectAll}>
            <CustomCheckboxInput checked={selectAll} onChange={handleSelectAll} />
            <CustomCheckboxLabel />
            <span>All</span>
          </CustomCheckboxWrapper>
        </RecipientItem>
        {senderlist.map(item => (
          <RecipientItem key={item.id}>
            <CustomCheckboxWrapper onClick={() => handleCheck(item.id)}>
              <CustomCheckboxInput checked={item.checked} onChange={() => handleCheck(item.id)} />
              <CustomCheckboxLabel />
              <span>{item.dept}</span>
            </CustomCheckboxWrapper>
          </RecipientItem>
        ))}
      </RecipientList>
      <Input type="email" placeholder="Other Recipient Emails (comma-separated)" value={to} onChange={(e) => setTo(e.target.value)} />
      <ButtonContainer>
        <SendButton onClick={handleSendEmail}>Send Email</SendButton>
      </ButtonContainer>
      <ToastContainer />
    </EmailNotificationContainer>
  );
};

export default EmailNotification;
