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
import './Facultydetails.css';
import { getTokenData } from './authUtils';

function Facultydetails() {
  const navigate = useNavigate();
  const [table] = useState('staffs');
  const tokendata=getTokenData();
  const role = tokendata.role;
  const [dept, setDept] = useState(role === 'hod' ? tokendata.department : 'All');
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [attributenames, setAttributenames] = useState([]);
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
    
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/gettable', { table: table, department: dept });
        setData(response.data.data);
        setOriginalData(response.data.data);
        setAttributenames(Object.keys(response.data.columnDataTypes));
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
    fetchData();
  }, [dept]);

  const handleEdit = (attributenames, item) => {
    navigate("edit-form", { state: { table, attributenames, item } });
  };

  const handleAdd = () => {
    navigate("add-form", { state: { table, attributenames } });
  };

  const handleDelete = async (id) => {
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
          setData(prevData => prevData.filter((item) => item.id !== id));
          setOriginalData(prevData => prevData.filter((item) => item.id !== id));
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
    'joining_date': 'date'
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
    const sheetName = `${table}Data`; 
    const fileName = `${sheetName}.xlsx`;
  
    utils.book_append_sheet(wb, ws, sheetName);
  
    writeFile(wb, fileName);
  };
  
  return (
    <div className="container">
        <h1>{'Staff Details'}</h1>
      <div className="row mb-3">
        <div className="col">
          <button type="button" onClick={handleAdd} className="search-button">Add Records</button>
        </div>

        <div className="col">
          <select className="custom-select" value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)}>
            <option value="">Select Column to Search</option>
            {attributenames.map((name, index) => (
              <option key={index} value={name}>{formatColumnName(name)}</option>
            ))}
          </select>
        </div>

        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="col">
          <button type="button" onClick={handleSearch} className="search-button">Search</button>
          <button type="button" onClick={resetSearch} className="bttreset">Reset</button>
        </div>
        <div className="col">
          <button type="button" onClick={exportToExcel} className="bttexport">Export to Excel</button>
        </div>

      </div>

      {data && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                {role !== "IQAC" && <th className="fixed-column">Action</th>}
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
                  {role !== "IQAC" &&
                    <td>
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <div className="icon-container">
                          <BsPencilSquare onClick={() => handleEdit(attributenames, item)} className="edit-icon" />
                          <BsFillTrashFill onClick={() => handleDelete(item.id)} className="delete-icons" />
                        </div>
                      </IconContext.Provider>
                    </td>
                  }
                  {attributenames.map((name, attrIndex) => (
                    name === "id" ? <td key={attrIndex}>{index + 1}</td> :
                      <td key={attrIndex}>
                        {attributeTypes[name] === "date" ? formatDate(item[name]) : (
                          (name === "website_link" || name==="website link") && item[name] ?
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

export default Facultydetails;
