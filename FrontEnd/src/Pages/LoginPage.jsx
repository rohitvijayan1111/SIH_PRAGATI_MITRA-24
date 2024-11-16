import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; 
import styled from 'styled-components';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import logo from '../assets/pragati.png';
import refresh from '../assets/refresh.png';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../assets/pragati-bg.jpg';

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
      <LoginPageContainer>
        <LoginForm>
          <LogoContainer>
            <img src={logo} alt="Logo" />
            <CompanyName>PRAGATI<br></br> MITRA</CompanyName>
          </LogoContainer>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <input
                type="text"
                id="username"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <input
                type="password"
                id="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <CaptchaContainer>
                {captcha}
                <img
                  src={refresh}
                  onClick={handleClick}
                  width="20px"
                  height="20px"
                  alt="refresh captcha"
                />
              </CaptchaContainer>
              <input
                type="text"
                id="captcha"
                placeholder="Enter Captcha"
                value={random}
                onChange={(e) => setRandom(e.target.value)}
              />
            </FormGroup>
            <SubmitButton type="submit">Sign in</SubmitButton>
          </form>
          <GoogleLoginButtonWrapper>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => notifyfailure('Google Sign-In Failed')}
              useOneTap
            />
          </GoogleLoginButtonWrapper>
        </LoginForm>
        <ToastContainer />
      </LoginPageContainer>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;

// Updated Styled Components with Responsive Design
const LoginPageContainer = styled.div`
  background-image: url(${backgroundImg});
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10%; /* Left-aligned on larger screens */

  @media (max-width: 768px) {
    justify-content: center; /* Center on tablet */
    padding-left: 0;
  }
`;

const LoginForm = styled.div`
  background-color: rgba(244, 244, 244, 0.9);
  padding: 40px 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 30px 15px;
    width: 280px;
  }

  @media (max-width: 480px) {
    padding: 40px 20px;
    width: 70%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  img {
    width: 120px;
    height: auto;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    img {
      width: 90px;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 80px;
    }
  }
`;

const CompanyName = styled.div`
  font-size: 34px;
  font-weight: bold;
  text-align:center;
  color: #164863;
  margin-left: 15px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 15px;

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    input {
      padding: 8px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    input {
      padding: 6px;
      font-size: 13px;
    }
  }
`;

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 15px;
  user-select: none;
  font-size: 24px;
  border-radius: 5px;
  padding: 8px;

  img {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 6px;

    img {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    font-size: 18px;
    padding: 5px;

    img {
      width: 16px;
      height: 16px;
    }
  }
`;

const SubmitButton = styled.button`
  
  &:hover {
    background-color: #144508;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 15px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    margin-left:-10px;
    padding: 8px 10px;
  }
`;

const GoogleLoginButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15px;

  > div {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 768px) {
    > div {
      width: 90%;
    }
  }

  @media (max-width: 480px) {
    > div {
      width: 85%;
    }
  }
`;
