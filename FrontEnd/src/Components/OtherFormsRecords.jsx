import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { BsPencilSquare, BsFillTrashFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { utils, writeFile } from 'xlsx';
import { getTokenData } from '../Pages/authUtils';

const Container = styled.div`
  padding: 10px;

`;

const TableResponsive=styled.div`
  overflow-x: auto;
  width:94%;

  @media (max-width: 768px) {
    width:100%;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Col = styled.div`
  flex: 1;
  min-width: 170px;
  padding: 5px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 6px 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  color: white;
  transition: background-color 0.3s ease;

  ${({ variant }) => variant === 'export' && `
    background-color: #28a745;
    &:hover {
      background-color: #218838;
    }
  `}
  ${({ variant }) => variant === 'search' && `
    background-color: #007bff;
    &:hover {
      background-color: #046cc7;
    }
  `}
  ${({ variant }) => variant === 'reset' && `
    background-color: #696969;
    &:hover {
      background-color: #505050;
    }
  `}
  ${({ variant }) => variant === 'lock' && `
    background-color: #FFA000;
    &:hover {
      background-color: #FF9500;
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    padding: 8px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor:pointer;
`;

const CustomSelect = styled.select`
  background-color: white;
  width: 100%;
  padding: 6px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Table = styled.table`
  min-width: 90%;
  width: 90%;
  max-width: 90%;
  border-collapse: collapse;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Th = styled.th`
  background-color: #343a40;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Td = styled.td`
  padding: 10px;
  text-align: center;
  border: 1px solid #dee2e6;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const FixedColumn = styled(Th)`
  width: 80px;

  @media (max-width: 768px) {
    width: 60px;
  }
`;
const ButtonContent=styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

function OtherFormsRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const { form } = location.state;
  const [table] = useState(form.form_table_name);
  const tokendata = getTokenData();
  const role = tokendata.role;
  const [dept, setDept] = useState(role === "hod" || role === "Form editor" ? tokendata.department : "All");
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [attributenames, setAttributenames] = useState([]);
  console.log(role);
  const [lockedstatus, setLockedstatus] = useState('');
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
    if (role === "IQAC") {
      setDept('All');
    }
    const fetchLockStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/getlocktablestatus', { id: form.id, table: 'form_locks' });
        setLockedstatus(response.data.is_locked);
      } catch (error) {
        console.error('Error fetching lock status:', error);
        notifyFailure(error.response.data.error || 'Error fetching record');
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/gettable', { table: table, department: dept });
        setData(response.data.data);
        setOriginalData(response.data.data);
        setAttributenames(Object.keys(response.data.columnDataTypes));
        setAttributeTypes({
          ...response.data.columnDataTypes,
          ...{ 'document': 'file', 'website_link': 'link' }
        });
      } catch (err) {
        if (err.response && err.response.data) {
          notifyFailure(err.response.data);
        } else {
          notifyFailure('Something went wrong');
        }
        setData([]);
        setAttributenames([]);
        setAttributeTypes([]);
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
    navigate("edit-form", { state: { table, attributenames, attributeTypes, item, formId: form.id } });
  };

  const handleAdd = () => {
    if (lockedstatus) {
      toast.error('Form is locked. You cannot add records.', {
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
    navigate("add-form", { state: { table, attributenames, attributeTypes, formId: form.id } });
  };

  const handleLock = async () => {
    Swal.fire({
      title: 'Do you want to change the lock status of this form?',
      showCancelButton: true,
      confirmButtonText: lockedstatus ? 'Unlock' : 'Lock',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:3000/tables/locktable', { id: form.id, lock: !lockedstatus });
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
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    writeFile(workbook, `${table}.xlsx`);
  };

  const handleSearch = () => {
    if (!searchColumn || !searchValue) return;
    const filteredData = originalData.filter((item) => {
      const cellValue = item[searchColumn];
      if (typeof cellValue === 'string' && cellValue.toLowerCase().includes(searchValue.toLowerCase())) return true;
      if (typeof cellValue === 'number' && cellValue.toString().includes(searchValue)) return true;
      return false;
    });
    setData(filteredData);
  };

  const handleReset = () => {
    setSearchColumn('');
    setSearchValue('');
    setData(originalData);
  };

  return (
    <Container>
      <Title>{form.form_name} Form Records</Title>
      <Row>
        <ButtonContent>
            <Col>
              <Button onClick={handleAdd} variant="export">Add New Record</Button>
            </Col>
            <Col>
              <Button onClick={handleExport} variant="export">Export</Button>
            </Col>
          </ButtonContent>
        <Col>
          <CustomSelect value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)}>
            <option value=''>Select Column</option>
            {attributenames.map((name) => (
              <option key={name} value={name}>{formatColumnName(name)}</option>
            ))}
          </CustomSelect>
        </Col>
        <Col>
          <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Enter search value" />
        </Col>

        <ButtonContent>
            <Col>
              <Button onClick={handleSearch} variant="search">Search</Button>
            </Col>
            <Col>
              <Button onClick={handleReset} variant="reset">Reset</Button>
            </Col>
        </ButtonContent>
        {(role === "IQAC" || role === "hod") && (
          <Col>
            <Button onClick={handleLock} variant="lock">{lockedstatus ? 'Unlock Form' : 'Lock Form'}</Button>
          </Col>
        )}
      </Row>
        <TableResponsive>
        <Table>
          <thead>
            <tr>
              <FixedColumn>No.</FixedColumn>
              {attributenames.map((name) => (
                <Th key={name}>{formatColumnName(name)}</Th>
              ))}
              <FixedColumn>Actions</FixedColumn>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <Td>{index + 1}</Td>
                  {attributenames.map((name) => (
                    <Td key={name}>
                      {attributeTypes[name] === 'file' && item[name] ? (
                        <a href={`http://localhost:3000/${item[name]}`} target="_blank" rel="noopener noreferrer">Download</a>
                      ) : attributeTypes[name] === 'link' ? (
                        <a href={item[name]} target="_blank" rel="noopener noreferrer">{item[name]}</a>
                      ) : name === 'submission_date' ? (
                        dayjs(item[name]).format('DD-MM-YYYY')
                      ) : (
                        item[name]
                      )}
                    </Td>
                  ))}
                  <Td>
                    <IconContext.Provider value={{ className: "action-icon" }}>
                      <IconContainer>
                        <BsPencilSquare onClick={() => handleEdit(attributenames, item)} />
                        <BsFillTrashFill onClick={() => handleDelete(item.id)} />
                      </IconContainer>
                    </IconContext.Provider>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan={attributenames.length + 2}>No data available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableResponsive>
      <ToastContainer />
    </Container>
  );
}

export default OtherFormsRecords;
