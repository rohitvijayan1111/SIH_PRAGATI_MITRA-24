import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

export const ViewOtherFormRecord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, attributenames, form } = location.state;
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.post('http://localhost:3000/forms/getformrecords', { id });
        const formsData = response.data.map(record => ({
          ...record,
          record_data: JSON.parse(record.record_data)
        }));
        setRecords(formsData);
        setFilteredRecords(formsData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, [id]);

  const handleEdit = (record) => {
    if (form.is_locked) {
      toast.error('Form is locked. You cannot edit records.', {
        position: "top-center",
        autoClose: 4000,
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
    navigate("edit-form-record", { state: {form, attributenames, record } });
  };

  const handleDelete = async (recordId) => {
    if (form.is_locked) {
      toast.error('Form is locked. You cannot delete records.', {
        position: "top-center",
        autoClose: 4000,
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
    try {
      await axios.post('http://localhost:3000/forms/updateAndDeleteRecord', {recordId:recordId,formId:form.id });
      const updatedRecords = records.filter(record => record.id !== recordId);
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords);

    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <Container>
      <h2>View Other Form Records</h2>
      {filteredRecords.length > 0 ? (
  <Table striped bordered hover>
    <thead>
      <tr>
        {attributenames.map((attribute, index) => (
          <th key={index}>{attribute.name}</th>
        ))}
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredRecords.map((record, index) => (
        <tr key={index}>
          {attributenames.map((attribute, attrIndex) => (
            <td key={attrIndex}>{record.record_data[attribute.name]}</td>
          ))}
          <td className="fixed-column">
            <button
              className="btn btn-warning btn-sm mr-2"
              style={{ marginRight: "5px" }}
              onClick={() => handleEdit(record)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
) : (
  <p>Loading...</p>
)}

      <ToastContainer />
    </Container>
  );
};

export const EditOtherFormRecord = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { form, attributenames, record } = location.state;
    console.log(record);
    const [data, setData] = useState(record.record_data);
    //console.log(data);
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
  
    const handleDateTimeChange = (dateTime) => {
      const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
      setData({ ...data, deadline: formattedDateTime });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(data);
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:3000/forms/editformrecord",{
            id: record.id,
            record_data:JSON.stringify(data) ,
          });
        console.log(response.data);
        notifysuccess();
        setTimeout(() => {
          navigate("/dashboard/view-form");
        }, 1500);
      } catch (error) {
        notifyfailure('Error updating record:', error);
      }
    };
  
    return (
      <div className="cnt">
        <h2>Edit Form</h2>
        {attributenames && attributenames.length > 0 ? (
          <form className='edt' onSubmit={handleSubmit}>
            {attributenames.map((attribute, index) => (
              (attribute !== "id" && attribute !== "createdAt") && (
                <div className="frm" key={index}>
                  <label htmlFor={attribute} className="lbl">{attribute.name}:</label>
                  {attribute.name === "deadline" ? (
                    <MobileDateTimePicker
                      value={data[attribute.name] ? new Date(data[attribute.name]) : null}
                      onChange={handleDateTimeChange}
                      renderInput={(params) => (
                        <input
                          {...params}
                          type="text"
                          className="cntr"
                          id={attribute.name}
                          required
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      className="cntr"
                      id={attribute.name}
                      onChange={(e) => setData({ ...data, [attribute.name]: e.target.value })}
                      value={data[attribute.name] || ''}
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