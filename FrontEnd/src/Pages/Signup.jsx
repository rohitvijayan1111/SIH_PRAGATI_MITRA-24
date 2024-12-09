import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import axios from 'axios';
import { ToastContainer, toast,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function SignPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const notifysuccess = () =>{
    toast.success('Signed Up Successfully!', {
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
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SIH_PRAGATI_MITRA_URL}/auth/register`, userData);
      console.log(response.data);
      notifysuccess();
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response) {
        notifyfailure(error.response.data);
      } else {
        notifyfailure(error.response.data);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !role) {
      setError('Please fill in all required fields');
      return;
    }

    const department = dept.trim()!=="NA" ? dept.trim(): role;

    try {
      await registerUser({
        username: username.toLowerCase(),
        password: password,
        role: role.toLowerCase(),
        department: department,
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className='loginpage'>
    <div className="login-form">
      <div className="flower-logo">
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="role"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="department"
            placeholder="Department/NA"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
}

export default SignPage;
