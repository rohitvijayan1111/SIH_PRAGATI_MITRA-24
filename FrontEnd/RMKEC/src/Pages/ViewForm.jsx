import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditForm.css';
import { ToastContainer, toast,Zoom} from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
function ViewForm() {
  const navigate = useNavigate();
  const [table, setTable] = useState('');
  const [dept, setDept] = useState('');
  const [data, setData] = useState(null);
  const [attributenames, setAttributenames] = useState(null);
  const [lockedstatus,setLockedstatus]=useState('');
  
  const notifyfailure=(error)=>{
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
  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/tables/getlocktablestatus', {id:1,table:'form_locks'});
        setLockedstatus(response.data.is_locked);
      } catch (error) {
        console.error('Error fetching lock status:', error);
        notifyfailure(response.error.data);
      }
    };
  
    fetchLockStatus();
  }, []);
  
  const handleEdit = (attributenames, item) => {

    if(lockedstatus)
      {
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
    navigate("/dashboard/view-form/edit-form", { state: { table, attributenames, item } }); 
  };

  const handleAdd = () => {
    if(lockedstatus)
      {
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
    navigate("/dashboard/view-form/add-form", { state: { table, attributenames } }); 
  };
  const handleLock = async () => {
    Swal.fire({
      title: 'Do you want to change the lock status of this form?',
      showCancelButton: true,
      confirmButtonText: lockedstatus ? 'Unlock' : 'Lock',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post('http://localhost:3000/tables/locktable', { id: 1, lock: !lockedstatus });
          setLockedstatus(!lockedstatus);
          Swal.fire(`${lockedstatus ? 'Unlocked' : 'Locked'}!`, '', 'success');
        } catch (error) {
          console.error('Error locking form:', error);
          notifyfailure(error.response.data);
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
          notifyfailure(error.response.data);
          Swal.fire('Error!', 'There was an error deleting the record', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/tables/gettable', { table, dept });
      setData(response.data);
      setAttributenames(Object.keys(response.data[0]));
    } catch (err) {
      if (err.response && err.response.data) {
        notifyfailure(err.response.data);
      } else {
        notifyfailure('Something went wrong');
      }
      setData(null);
      setAttributenames(null);
    }
  };

  return (
      <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <button type="button" onClick={handleAdd} className="btn btn-primary">Add Records</button>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter table name"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">Fetch Data</button>
          </div>
          <div className="col">
            <button type="button" onClick={handleLock} className="btn btn-warning">{(!lockedstatus)?"Lock Form":"Unlock Form"}</button>
          </div>
        </div>
      </form>
      {data && (
        <div>
          <h2>Results:</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  {attributenames && attributenames.map((name, index) => (
                    name === "id" ? <th key={index}>S.No</th> : (
                      <th key={index}>{name}</th>
                    )
                  ))}
                  <th className="fixed-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {attributenames.map((name, idx) => (
                        name === "id" ? 
                        <td key={idx}>{index + 1}</td> : 
                        <td key={idx}>
                {name === 'deadline' || name === 'createdAt' ? 
                  new Date(item[name]).toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) 
                  : 
                  item[name]}
              </td>

                    ))}
                    <td className="fixed-column">
                      <button className="btn btn-warning btn-sm mr-2" style={{ marginRight: "5px" }} onClick={() => handleEdit(attributenames, item)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ToastContainer />
        </div>
      )}
      
    </div>
  );
}

export default ViewForm;
