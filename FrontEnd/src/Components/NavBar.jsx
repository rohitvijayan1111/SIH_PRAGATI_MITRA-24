import React from 'react'
import './NavBar.css'
import logo from '../assets/RMK.png'
import { getTokenData } from '../Pages/authUtils';
import GoogleTranslate from './GoogleTranslate';
//import logout from '../assets/logout.png'

function NavBar() {
  const tokenData = getTokenData();
  const department = tokenData ? tokenData.department : '';
  
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedIn');
    window.location.href = '/';
  }
  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
      <header className='header'>
      <nav className='left'>
        <img src={logo} width="50px" height="70px" alt="Logo" />
        <a href='/dashboard' className='logo' style={{ textDecoration: 'none' }}>
        <div>R.M.K. Engineering College</div>
        <div className='cls'>(AN AUTONOMOUS INSTITUTION)</div>
        </a>

      </nav>
      <div className='alig'>
        <h5>{capitalizeWords(department)}</h5>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>    
  )
}

export default NavBar
