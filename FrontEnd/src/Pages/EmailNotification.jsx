import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { css } from 'styled-components';

const EmailContainer = styled.div`
  max-width: 700px;
  margin: 20px auto;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
`;

const EmailHeader = styled.div`
  background-color: #164863;
  color: white;
  padding: 15px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  font-weight: bold;
`;

const RecipientArea = styled.div`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f4f4f4;
  font-size: 1rem;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f4f4f4;
  font-size: 1rem;
  resize: none;
  height: 120px;
  margin-top: 10px;
`;

const RecipientListContainer = styled.div`
  padding: 15px;
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
`;

const RecipientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const RecipientItem = styled.li`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  transform: scale(1.2);
`;

const RecipientLabel = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const ButtonContainer = styled.div`
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  background-color: #f7f7f7;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #164863;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
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
    setSelectAll(updatedList.every(member => member.checked));
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
    <EmailContainer>
      <EmailHeader>
        <HeaderTitle>Compose New Email</HeaderTitle>
      </EmailHeader>
      <RecipientArea>
        <FieldLabel>To:</FieldLabel>
        <Input
          type="email"
          placeholder="Recipient email addresses"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <FieldLabel>Subject:</FieldLabel>
        <Input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </RecipientArea>
      <RecipientListContainer>
        <FieldLabel>Select Departments:</FieldLabel>
        <RecipientList>
          <RecipientItem>
            <Checkbox
              type="checkbox"
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
            />
            <RecipientLabel>Select All</RecipientLabel>
          </RecipientItem>
          {senderlist.map((item) => (
            <RecipientItem key={item.id}>
              <Checkbox
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheck(item.id)}
              />
              <RecipientLabel>{item.dept}</RecipientLabel>
            </RecipientItem>
          ))}
        </RecipientList>
      </RecipientListContainer>
      <RecipientArea>
        <FieldLabel>Message:</FieldLabel>
        <TextArea
          placeholder="Type your email message here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </RecipientArea>
      <ButtonContainer>
        <SendButton onClick={handleSendEmail}>Send</SendButton>
      </ButtonContainer>
      <ToastContainer />
    </EmailContainer>
  );
};

export default EmailNotification;
