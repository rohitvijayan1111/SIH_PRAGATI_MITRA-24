import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { BsPencilSquare, BsFillTrashFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { utils, writeFile } from 'xlsx';
import './Placements.css';
import { getTokenData } from './authUtils';

function Placements() {
  const navigate = useNavigate();
  const [table] = useState('Placement');
  const tokendata=getTokenData();
  const role = tokendata.role;
  const [dept, setDept] = useState(role === 'hod' ? tokendata.department : 'All');
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [attributenames, setAttributenames] = useState([]);
  const [lockedstatus, setLockedstatus] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [searchValue, setSearchValue] = useState('');
  
  const notifyFailure = (error) => {
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

  useEffect(() => {
    if (role === "IQAC") {
      setDept('All');
    }
    const fetchLockStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/getlocktablestatus', { id: 10, table: 'form_locks' });
        setLockedstatus(response.data.is_locked);
      } catch (error) {
        console.error('Error fetching lock status:', error);
        notifyfailure(error.response.data.error || 'Error fetching record');
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/gettable', { table: table, department: dept });
        setData(response.data.data);
        setOriginalData(response.data.data);
        setAttributenames(response.data.columnNames);
      } catch (err) {
        if (err.response && err.response.data) {
          notifyFailure(err.response.data);
        } else {
          notifyFailure('Something went wrong');
        }
        setData([]);
        setAttributenames([]);
      }
    };

    fetchLockStatus();
    fetchData();
  }, [dept]);

  const handleEdit = (attributenames, item) => {
    if (lockedstatus) {
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
    navigate("edit-form", { state: { table, attributenames, item } });
  };

  

  const handleLock = async () => {
    Swal.fire({
      title: 'Do you want to change the lock status of this form?',
      showCancelButton: true,
      confirmButtonText: lockedstatus ? 'Unlock' : 'Lock',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:3000/tables/locktable', { id: 10, lock: !lockedstatus });
          setLockedstatus(!lockedstatus);
          Swal.fire(`${lockedstatus ? 'Unlocked' : 'Locked'}!`, '', 'success');
        } catch (error) {
          console.error('Error locking form:', error);
          notifyFailure(error.response.data);
          Swal.fire('Error!', 'There was an error changing the lock status', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    if (lockedstatus) {
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

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('http://localhost:3000/tables/deleterecord', { data: { id, table } });
          setData(data.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your record has been deleted.", "success");
        } catch (error) {
          console.error('Error deleting item:', error);
          notifyFailure(error.response.data);
          Swal.fire('Error!', 'There was an error deleting the record', 'error');
        }
      }
    });
  };

  const formatColumnName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  const attributeTypes = {
    'completion_date': 'date',
    'Proposed Date':'date',
    'Date of completion':'date',
    'Proposed date of visit':'date',
    'Actual Date  Visited':'date',
    'Date_of_event_planned':'date',
    'Date_of_completion':'date',
    'Date planned':'date',
    'Actual Date of lecture':'date',
    'Completion Date of Event':'date',
    'Date of Interview':'date',
    'start_date':'date',
    'end_date':'date',
    'document':'file'
  };

  const handleSearch = () => {
    if (!searchColumn || !searchValue) {
      notifyFailure('Please select a column and enter a search value.');
      return;
    }
  
    const filteredData = originalData.filter(item => {
      const value = item[searchColumn] ? item[searchColumn].toString().toLowerCase() : '';
  
      if (attributeTypes[searchColumn] === 'date') {
        const formattedDate = dayjs(item[searchColumn]).format('DD/MM/YYYY');
        return formattedDate.includes(searchValue.toLowerCase());
      }
  
      return value.includes(searchValue.toLowerCase());
    });
  
    setData(filteredData);
  };
  

  const resetSearch = () => {
    setData(originalData);
    setSearchColumn('');
    setSearchValue('');
  };

  const exportToExcel = () => {
    const filteredData = data.map(item => {
      const { id, ...filteredItem } = item;
      return filteredItem;
    });
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'ClubActivitiesData');

    writeFile(wb, 'ClubActivitiesData.xlsx');
  };
  const handlePreview = async (table, documentPath) => {
    try {
      const response = await axios.post('http://localhost:3000/tables/getfile', { table, documentPath }, {
        responseType: 'arraybuffer'
      });
  
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = documentPath;
      link.click();
  
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching file:', error);
      notifyFailure('Error fetching file');
    }
  };
  return (
    <div className="container">
        <h1>{'Placements'}</h1>
      {data && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                
                {attributenames && attributenames.map((name, index) => (
                  name === "id" ? <th key={index}>S.No</th> : (
                    <th key={index}>{formatColumnName(name)}</th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {attributenames.map((name, attrIndex) => (
                    name === "id" ? <td key={attrIndex}>{index + 1}</td> :
                      <td key={attrIndex}>
                        {attributeTypes[name] === "date" ? formatDate(item[name]) : (
                          name === "website_link" && item[name] ?
                            <a href={item[name]} target="_blank" rel="noopener noreferrer">Link</a>
                            : attributeTypes[name] === "file" ? (
                              <button type="button" onClick={() => handlePreview(table,item[name])} className="view-button">Download</button>
                            ) : item[name]
                        )}
                      </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Placements;
