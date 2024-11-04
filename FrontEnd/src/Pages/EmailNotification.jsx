import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import './EmailNotification.css';
import { ToastContainer, toast,Zoom,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'; 
import { styled } from '@mui/material/styles';
const EmailNotification = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [senderlist, setSenderList] = useState([
    { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept:'ADS' },
    { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false,dept:'CIVIL' },
    { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'CSBS' },
    { id: 4, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'CSD' },
    { id: 5, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'CSE' },
    { id: 6, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'EEE' },
    { id: 7, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'ECE' },
    { id: 8, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'EIE' },
    { id: 9, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'IT' },
    { id: 10, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'MECH' }
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

      console.log(selectedEmails);
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
      console.log(response.data);
      setTo('');
      setSubject('');
      setText('');
      setSenderList([
        { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept:'IT' },
    { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false,dept:'CSE' },
    { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'CSD' },
    { id: 4, text: 'like22040.it@rmkec.ac.in', checked: false,dept:'ECE' }
      ]);
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
      setTo('');
      setSubject('');
      setText('');
      setSenderList([
        { id: 1, text: 'rohitvijayan1111@gmail.com', checked: false, dept:'IT' },
    { id: 2, text: 'broh22012.it@rmkec.ac.in', checked: false,dept:'CSE' },
    { id: 3, text: 'like22050.it@rmkec.ac.in', checked: false,dept:'CSD' },
    { id: 4, text: 'like22040.it@rmkec.ac.in', checked: false,dept:'ECE' }
      ])
    }
    setSenderList(initialSenderList);
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
    <div className="email-notification">
      <h3>Subject:</h3>
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <h3>Body:</h3>
      <textarea  style={{resize:'none',minHeight: '90px'}} ref={textAreaRef} placeholder="Email Body" value={text} onChange={(e) => setText(e.target.value)} required />
      <h3>Recipient Emails:</h3>
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
      <input type="email" placeholder="Other Recipient Emails (comma-separated)" value={to} onChange={(e) => setTo(e.target.value)}/>
      <div className="send-button-container">
      <button onClick={handleSendEmail}>Send Email</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmailNotification;
