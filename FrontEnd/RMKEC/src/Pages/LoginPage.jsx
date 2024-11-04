import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; 
import './LoginPage.css';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import logo from '../assets/Logo.png';
import refresh from '../assets/refresh.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [random, setRandom] = useState('');
  const [captcha, setCaptcha] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEGJKLMNOPQRSTUVWXYZ023456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      captcha += char;
    }
    return captcha;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleClick = () => {
    setCaptcha(generateCaptcha());
    setRandom('');
  };

  const notifysuccess = () => {
    toast.success('Signed In Successfully!', {
      position: "top-center",
      autoClose: 1500,
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
    toast.error(error || 'An error occurred. Please try again.', {
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

  const validateUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', userData);
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('loggedIn', 'true');
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      notifysuccess();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error logging in:', error);
      sessionStorage.setItem('loggedIn', 'false');
      const errorMsg = error.response?.data || 'An error occurred. Please try again.';
      notifyfailure(errorMsg);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (random.toLowerCase() === captcha.toLowerCase()) {
      validateUser({ username: username.toLowerCase(), password });
    } else {
      notifyfailure('Incorrect captcha. Please try again.');
      setCaptcha(generateCaptcha());
      setRandom('');
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleUserData = {
        token: response.credential,  
      };
  
      const res = await axios.post('http://localhost:3000/auth/googleLogin', googleUserData);
      const { token } = res.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('loggedIn', 'true');
      notifysuccess('Login successful');
      setTimeout(() => {
        navigate('/dashboard/assigned-forms');
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Google Login Failed.';
      notifyfailure(errorMessage); 
    }
  };
  
  return (
    <GoogleOAuthProvider clientId="6780170653-md9te2utbr8o1fecvp0g02bj974q1gdp.apps.googleusercontent.com">
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
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className='captcha'>
                {captcha}
                <img
                  src={refresh}
                  onClick={handleClick}
                  width="20px"
                  height="20px"
                  alt="refresh captcha"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <input
                type="text"
                id="s"
                placeholder="Enter Captcha"
                value={random}
                onChange={(e) => setRandom(e.target.value)}
              />
            </div>
            <button type="submit">Sign in</button>
          </form>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => notifyfailure('Google Sign-In Failed')}
            useOneTap
          />

        </div>
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
