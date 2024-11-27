import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Zoom } from 'react-toastify';

const AddNewRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const attributenames = location.state.attributenames;
  const form=location.state.form;
  const [data, setData] = useState({});
  console.log(form);
  const notifysuccess = () => {
    toast.success('Added Record Successfully!', {
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
  }

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
  }

  const handleDateTimeChange = (newValue) => {
    setData({ ...data, deadline: newValue });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response2 = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/forms/insertrecord`, {form_id:form.id,
            record_data:JSON.stringify(data) 
        });
        const response =await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/forms/updateformindex`, {    form_id:form.id,
            data:{start_index:(form.start_index)?form.start_index:form.possible_start_index,
            end_index:(form.end_index)?form.end_index+1:form.possible_start_index},    
        });  
      console.log(response.data);
      notifysuccess();
      setTimeout(() => {
        navigate("/dashboard/view-other-forms");
      }, 1500);
    } catch (error) {
      notifyfailure('Error inserting record:');
    }
  };

  return (
    <div className="cnt">
      <h2>Add Record</h2>
      {attributenames && attributenames.length > 0 ? (
        <form className='edt' onSubmit={handleSubmit}>
          {attributenames.map((attribute, index) => (
            attribute.name !== "id" && attribute.name !== "createdAt" && (
              <div className="frm" key={index}>
                <label htmlFor={attribute.name} className="lbl">{attribute.name}:</label>
                {attribute.type === "date" ? (
                  <MobileDateTimePicker
                    value={data[attribute.name] ? new Date(data[attribute.name]) : null}
                    onChange={handleDateTimeChange}
                    renderInput={(params) => (
                      <input    
                        {...params}
                        type={attribute.type}
                        className="cntr"
                        id={attribute}
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

export default AddNewRecord;
