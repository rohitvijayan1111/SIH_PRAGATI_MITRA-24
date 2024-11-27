import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { BsPencilSquare, BsFillTrashFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { utils, writeFile } from 'xlsx';
import { getTokenData } from '../Pages/authUtils';

function OtherFormsRecordForIconNondept() {
  const navigate = useNavigate();
  const [formId, setFormId] = useState(null);
  const [formTitle, setFormTitle] = useState(null);
  const { table } = useParams();
  const tokendata = getTokenData();
  const role = tokendata.role;
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [attributenames, setAttributenames] = useState([]);
  const [searchColumn, setSearchColumn] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [attributeTypes, setAttributeTypes] = useState({ 'document': 'file', 'website_link': 'link', 'related_link': 'link' });

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
    const fetchFormId = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tables/getFormId`, { tableName: table });
        setFormId(response.data.form_id);
        setFormTitle(response.data.form_title);
      } catch (error) {
        console.error('Error fetching form ID:', error);
        notifyFailure(error.response?.data?.error || 'Error fetching form ID');
      }
    };
    fetchFormId();
  }, [table]);

  useEffect(() => {
    if (formId !== null) {
      const fetchData = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tablesfornondept/gettable`, { table });
          setData(response.data.data);
          setOriginalData(response.data.data);
          setAttributenames(Object.keys(response.data.columnDataTypes));
          setAttributeTypes({
            ...response.data.columnDataTypes,
            ...{ 'document': 'file', 'website_link': 'link' }
          });
        } catch (err) {
          notifyFailure(err.response?.data || 'Something went wrong');
          setData([]);
          setAttributenames([]);
          setAttributeTypes([]);
        }
      };
      fetchData();
    }
  }, [formId, table]);

  const handleEdit = (attributenames, item) => {
    navigate("edit-form", { state: { table, attributenames, attributeTypes, item, formId } });
  };

  const handleAdd = () => {
    navigate("add-form", { state: { table, attributenames, attributeTypes, formId } });
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
          await axios.delete(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/tablesfornondept/deleterecord`, { data: { id, table } });
          setData(prevData => prevData.filter((item) => item.id !== id));
          setOriginalData(prevData => prevData.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your record has been deleted.", "success");
        } catch (error) {
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

  const handleSearch = () => {
    if (!searchColumn || !searchValue) {
      notifyFailure('Please select a column and enter a search value.');
      return;
    }

    const filteredData = originalData.filter(item => {
      const value = item[searchColumn] ? item[searchColumn].toString().toLowerCase() : '';
      return attributeTypes[searchColumn] === 'date' ?
        dayjs(item[searchColumn]).format('DD/MM/YYYY').includes(searchValue.toLowerCase()) :
        value.includes(searchValue.toLowerCase());
    });

    setData(filteredData);
  };

  const resetSearch = () => {
    setData(originalData);
    setSearchColumn('');
    setSearchValue('');
  };

  const exportToExcel = () => {
    const filteredData = data.map(({ id, ...rest }) => rest);
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `${table}Data`);
    writeFile(wb, `${table}Data.xlsx`);
  };

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="row mb-3">
        <div className="col">
          <button type="button" onClick={exportToExcel} className="bttexport">Export to Excel</button>
        </div>
        <div className="col">
          <select className="custom-select" value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)}>
            <option value="">Select Column to Search</option>
            {attributenames.filter(name => name !== 'id').map((name, index) => (
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
        {(role === 'hod' || role === "Form editor" || role === "Finance Coordinator" || role === "Infrastructure Coordinator") && (
          <div className="col">
            <button type="button" onClick={handleAdd} className="search-button">Add Records</button>
          </div>
        )}
      </div>

      {data && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                {(role === "hod" || role === "Form editor" || role === "Finance Coordinator" || role === "Infrastructure Coordinator") && <th className="fixed-column">Action</th>}
                {attributenames.filter(name => name !== 'id').map((name, index) => (
                  <th key={index}>{formatColumnName(name)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {(role === "hod" || role === "Form editor" || role === "Finance Coordinator" || role === "Infrastructure Coordinator") && (
                    <td>
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <BsPencilSquare onClick={() => handleEdit(attributenames, item)} className="edit-icon" />
                        <BsFillTrashFill onClick={() => handleDelete(item.id)} className="delete-icon" />
                      </IconContext.Provider>
                    </td>
                  )}
                  {attributenames.filter(name => name !== 'id').map((name, attrIndex) => (
                    <td key={attrIndex}>
                      {attributeTypes[name] === "date" ? formatDate(item[name]) :
                        attributeTypes[name] === "file" ? (
                          <a href={`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/${item.document}`} target="_blank" rel="noopener noreferrer">View</a>
                        ) : item[name]
                      }
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

export default OtherFormsRecordForIconNondept;
