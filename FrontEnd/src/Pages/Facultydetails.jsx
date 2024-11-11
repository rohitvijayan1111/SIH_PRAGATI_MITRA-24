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
import styled from 'styled-components';
import { getTokenData } from './authUtils';

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  background-color: ${({ color }) => color || '#007bff'};
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  margin-right: 10px; /* Added margin for spacing */

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || '#046cc7'};
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Select = styled.select`
  background-color: white;
  width: 250px;
  padding: 6px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  margin-right: 10px; /* Added margin for spacing */

  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
  }
`;

const Input = styled.input`
  width: 250px; /* Fixed width for desktop */
  padding: 6px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  margin-right: 10px; /* Added margin for spacing */

  @media (max-width: 768px) {
    width: 100%; /* Full width for mobile */
    font-size: 14px;
  }
`;

const TableContainer = styled.div`
  max-height: 400px; /* Set a maximum height for the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #343a40;
    color: white;

    th {
      padding: 10px;
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: #f2f2f2;
      }

      td {
        padding: 8px;
        text-align: left;
      }
    }
  }
`;

const FixedColumn = styled.td`
  width: 80px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledIcon = styled.div`
  cursor: pointer;
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }

  svg {
    font-size: 20px;
  }
`;

const SearchRow = styled.div`
  display: flex;
  justify-content: flex-start; /* Align items to the start */
  align-items: center; /* Center items vertically */
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap in mobile view */
  width: 170vh;
  
  @media (max-width: 768px) {
    justify-content: center; /* Center items in mobile view */
    width: 100%;
  }
`;

function Facultydetails() {
  const navigate = useNavigate();
  const [table] = useState('staffs');
  const tokendata = getTokenData();
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
    <Container>
      <Title>{table.charAt(0).toUpperCase() + table.slice(1)} Details</Title>
      <SearchRow>
        {role !== "IQAC" && (
          <Select onChange={(e) => setDept(e.target.value)} value={dept}>
            <option value="All">All Departments</option>
            <option value="CS">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="ECE">Electronics and Communication</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            {/* Add other departments as necessary */}
          </Select>
        )}
        <Select onChange={(e) => setSearchColumn(e.target.value)} value={searchColumn}>
          <option value="">Select Column</option>
          {attributenames.map((name, index) => (
            <option key={index} value={name}>{formatColumnName(name)}</option>
          ))}
        </Select>
        <Input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search..." />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={resetSearch}>Reset</Button>
        <Button onClick={exportToExcel}>Export to Excel</Button>
        {role !== "IQAC" && (
          <Button color="#28a745" hoverColor="#218838" onClick={handleAdd}>Add New</Button>
        )}
      </SearchRow>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <TableContainer>
          <Table>
            <thead>
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
                    <FixedColumn>
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <IconContainer>
                          <StyledIcon>
                            <BsPencilSquare onClick={() => handleEdit(attributenames, item)} />
                          </StyledIcon>
                          <StyledIcon>
                            <BsFillTrashFill onClick={() => handleDelete(item.id)} />
                          </StyledIcon>
                        </IconContainer>
                      </IconContext.Provider>
                    </FixedColumn>
                  }
                  {attributenames.map((name, attrIndex) => (
                    name === "id" ? <td key={attrIndex}>{index + 1}</td> :
                      <td key={attrIndex}>
                        {attributeTypes[name] === "date" ? formatDate(item[name]) : (
                          (name === "website_link" || name === "website link") && item[name] ?
                            <a href={item[name]} target="_blank" rel="noopener noreferrer">Link</a>
                            : attributeTypes[name] === "file" ? (
                              <button type="button" onClick={() => handlePreview(table, item[name])} className="view-button">Download</button>
                            ) : item[name]
                        )}
                      </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
      <ToastContainer />
    </Container>
  );
}

export default Facultydetails;
