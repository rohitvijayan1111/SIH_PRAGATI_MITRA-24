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

const EditFormNonDep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { table, attributenames, item, attributeTypes } = location.state;
  const [data, setData] = useState(item);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);
  
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

      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tablesfornondept/updaterecord`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure(error.response?.data?.error || 'Error updating record');
    }
  };

  // Function to handle company details for JSON type attributes
  const handleCompanyDetailChange = (index, field, value) => {
    const currentCompanyDetails = JSON.parse(data.company_details || '[]');
    const updatedDetails = currentCompanyDetails.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    );
    setData({ ...data, company_details: JSON.stringify(updatedDetails) });
  };

  const addCompanyDetail = () => {
    const currentCompanyDetails = JSON.parse(data.company_details || '[]');
    const updatedDetails = [
      ...currentCompanyDetails, 
      { companyName: '', salaryOffered: '', noOfStuPlaced: '' }
    ];
    setData({ ...data, company_details: JSON.stringify(updatedDetails) });
  };

  const deleteLastCompanyDetail = () => {
    const currentCompanyDetails = JSON.parse(data.company_details || '[]');
    if (currentCompanyDetails.length > 1) {
      const updatedDetails = currentCompanyDetails.slice(0, -1);
      setData({ ...data, company_details: JSON.stringify(updatedDetails) });
    }
  };

  return (
    <div className="cnt">
      <h2>Edit Form</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute !== "id" && attribute !== "createdAt" && (
              <div className="frm" key={index}>
                <label htmlFor={attribute} className="lbl">
                  {attribute.replace(/_/g, ' ')}:
                </label>
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
                ) : attributeTypes[attribute] === 'file' ? (
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
                      <label 
                        htmlFor={attribute} 
                        className="custom-file-upload" 
                        onClick={() => fileInputRef.current.click()}
                      >
                        Choose File
                      </label>
                      <button 
                        type="button" 
                        className="custom-file-upload" 
                        onClick={handleFileReset}
                      >
                        Reset File
                      </button>
                    </div>
                    <input
                      type="file"
                      id={attribute}
                      className="custom-file-upload"
                      onChange={handleFileChange}
                      key={fileInputKey}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : attributeTypes[attribute] === 'json' ? (
                  <>
                    {JSON.parse(data.company_details || '[]').map((detail, index) => (
                      <div key={index} className="company-detail">
                        <div className="company-div"> <label htmlFor={`companyName-${index}`} className="company-lbl"><b>Company Name:</b></label>
                          <input
                            type="text"
                            className="cntr"
                            id={`companyName-${index}`}
                            value={detail.companyName}
                            onChange={(e) => handleCompanyDetailChange(index, 'companyName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="company-div">
                          <label htmlFor={`salaryOffered-${index}`} className="company-lbl"><b>Salary Offered:</b></label>
                          <input
                            type="text"
                            className="cntr"
                            id={`salaryOffered-${index}`}
                            value={detail.salaryOffered}
                            onChange={(e) => handleCompanyDetailChange(index, 'salaryOffered', e.target.value)}
                            required
                          />
                        </div>
                        <div className="company-div">
                          <label htmlFor={`noOfStuPlaced-${index}`} className="company-lbl"><b>No. Of Stu Placed:</b></label>
                          <input
                            type="text"
                            className="cntr"
                            id={`noOfStuPlaced-${index}`}
                            value={detail.noOfStuPlaced}
                            onChange={(e) => handleCompanyDetailChange(index, 'noOfStuPlaced', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <div className="company-buttons">
                      <button type="button" className="btn add-button" onClick={addCompanyDetail}>Add Company</button>
                      <button type="button" className="btn remove-button" onClick={deleteLastCompanyDetail}>Remove Last</button>
                    </div>
                  </>
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
};

export default EditFormNonDep;