import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Pages/EditForm.css';
import dayjs from 'dayjs';

const LeaveForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from_date: null,
    to_date: null,
    reason_for_leave: '',
    date_of_leaving: null,
    time_of_leaving: null
  });

  const notifysuccess = () => {
    toast.success('Leave request submitted successfully!', {
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
    setFormData({ ...formData, [attribute]: date ? dayjs(date).format('YYYY-MM-DD') : '' });
  };

  const handleTimeChange = (attribute, time) => {
    setFormData({ ...formData, [attribute]: time ? dayjs(time).format('HH:mm') : '' });
  };

  const handleChange = (attribute, value) => {
    setFormData({ ...formData, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the form data
      console.log(formData);
      // Add API submission logic here
      notifysuccess();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      notifyfailure('Error submitting leave request');
    }
  };

  return (
    <div className="cnt">
      <h2>Leave Request Form</h2>
      <form className='edt' onSubmit={handleSubmit}>
        <div className="frm">
          <label htmlFor="from_date" className="lbl">From Date:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.from_date ? dayjs(formData.from_date) : null}
              onChange={(date) => handleDateChange('from_date', date)}
              renderInput={(params) => <input {...params.inputProps} className="cntr" required />}
            />
          </LocalizationProvider>
        </div>

        <div className="frm">
          <label htmlFor="to_date" className="lbl">To Date:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.to_date ? dayjs(formData.to_date) : null}
              onChange={(date) => handleDateChange('to_date', date)}
              renderInput={(params) => <input {...params.inputProps} className="cntr" required />}
            />
          </LocalizationProvider>
        </div>

        <div className="frm">
          <label htmlFor="no_of_days" className="lbl">No. Of Days:</label>
          <input type='number' className="text-box" required/>
        </div>

        <div className="frm">
          <label htmlFor="reason_for_leave" className="lbl">Reason for Leave:</label>
          <textarea
            id="reason_for_leave"
            className="text-box"
            draggable="false"
            value={formData.reason_for_leave}
            onChange={(e) => handleChange('reason_for_leave', e.target.value)}
            required
          ></textarea>
        </div>

        <div className="frm">
          <label htmlFor="room_no" className="lbl">Room No:</label>
          <input type='number' className="text-box" required/>
        </div>

        

        <div className="frm">
          <label htmlFor="date_of_leaving" className="lbl">Date of Leaving:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.date_of_leaving ? dayjs(formData.date_of_leaving) : null}
              onChange={(date) => handleDateChange('date_of_leaving', date)}
              renderInput={(params) => <input {...params.inputProps} className="cntr" required />}
            />
          </LocalizationProvider>
        </div>

        <div className="frm">
          <label htmlFor="time_of_leaving" className="lbl">Time of Leaving:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={formData.time_of_leaving ? dayjs(formData.time_of_leaving) : null}
              onChange={(time) => handleTimeChange('time_of_leaving', time)}
              renderInput={(params) => <input {...params.inputProps} className="cntr" required />}
            />
          </LocalizationProvider>
        </div>
        

        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LeaveForm;
