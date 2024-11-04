import React from 'react'
import './Navigation.css'
import {useLocation } from 'react-router-dom';
function Navigation() {
  const location = useLocation(); 
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1] || 'Dashboard';
  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
      <div className='navigation'>
        <p className='head'>{capitalizeWords(lastPart.replaceAll("-"," "))}</p>
        <p>{capitalizeWords(location.pathname.replace("/","").replaceAll("-"," ").replaceAll("/"," > "))}</p>
      </div>
  )
}

export default Navigation