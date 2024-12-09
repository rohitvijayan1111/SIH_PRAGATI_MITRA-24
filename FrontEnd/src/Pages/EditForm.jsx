import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import './EditForm.css';

const EditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { table, attributenames, item,attributeTypes} = location.state;
  const [data, setData] = useState(item);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);
  
  console.log(attributeTypes);
  const notifysuccess = () => {
    toast.success('Record Edited Successfully!', {
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

  const notifyfailure = (error) => {
    toast.error(error, {
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
  };

  const handleDateChange = (attribute, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setData({ ...data, [attribute]: formattedDate });
  };

  const handleChange = (attribute, value) => {
    setData({ ...data, [attribute]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setData({ ...data, document: file.name }); // Update the file name in the state
  };

  const handleFileReset = () => {
    setSelectedFile(null);
    setFileInputKey(Date.now()); // Reset file input by changing the key
    setData({ ...data, document: 'No file selected' });
  };
  const removeEmailFromNotSubmitted = async (formId, email) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tables/remove-email`, {
        formId,
        email
      });
  
      // Handle successful response
      console.log('Response:', response.data);
      toast.success('Email removed successfully', {
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
    } catch (error) {
      // Handle error
      console.error('Error removing email:', error.response?.data || error.message);
      toast.error('Error removing email', {
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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = { ...data };
      for (const attribute of attributenames) {
        if (attributeTypes[attribute] === 'date' && formattedData[attribute]) {
          formattedData[attribute] = dayjs(formattedData[attribute]).format('YYYY-MM-DD');
        }
      }
  
      const formData = new FormData();
      formData.append('id', data.id);
      formData.append('table', table);
      formData.append('data', JSON.stringify(formattedData));
  
      // Handle file upload or deletion
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (data.document && data.document !== 'No file selected') {
        formData.append('deleteFile', true); // Request to delete the existing file
      }
  
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tables/updaterecord`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // removeEmailFromNotSubmitted(formId,tokendata.email);
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure(error.response?.data?.error || 'Error updating record');
    }
  };
  return (
    <div className="cnt">
      <h2>Edit Form</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute !== "id" && attribute !== "department" && attribute !== "createdAt" && (
              <div className="frm" key={index}>
                <label htmlFor={attribute} className="lbl">{attribute.replace(/_/g, ' ')}:</label>
                {attributeTypes[attribute] === 'date' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label=''
                      value={data[attribute] ? dayjs(data[attribute]) : null}
                      onChange={(date) => handleDateChange(attribute, date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className="cntr"
                          id={attribute}
                          required
                        />
                      )}
                    />
                  </LocalizationProvider>
                ) : attribute === "document" ? (
                  <div>
                    <div className="file-upload-container">
                      <input
                        type="text"
                        className="cntr"
                        value={data[attribute] || 'No file selected'}
                        readOnly
                      />
                    </div>
                    <div className='bttns'>
                      <label htmlFor={attribute} className="custom-file-upload" onClick={() => fileInputRef.current.click()}>
                        Choose File
                      </label>
                      <button type="button" className="custom-file-upload" onClick={handleFileReset}>Reset File</button>
                    </div>
                    <input
                      type="file"
                      id={attribute}
                      className="custom-file-upload"
                      onChange={handleFileChange}
                      key={fileInputKey}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      // Remove the required attribute
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="cntr"
                    id={attribute}
                    onChange={(e) => handleChange(attribute, e.target.value)}
                    value={data[attribute] || ''}
                    required
                  />
                )}
              </div>
            )
          ))}
          <div className="holder">
            <input type='submit' value="Submit" className='btt' />
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default EditForm;
