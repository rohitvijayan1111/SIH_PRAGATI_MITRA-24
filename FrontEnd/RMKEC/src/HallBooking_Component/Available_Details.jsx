import React from 'react';
import './Available_Details.css';
import { FaMapMarkerAlt, FaUsers, FaCogs, FaHome } from 'react-icons/fa';

const Available_Details = ({ hall, image }) => {
  return (
    <div className="hall-details">
      <img src={image} alt={`${hall.name}`} className="hall-image" />
      <div className="hall-info">
        <h4><FaHome /> {hall.name}</h4>  
        <p><FaMapMarkerAlt /> {hall.location}</p>
        <p><FaUsers /> Capacity: {hall.capacity}</p>
        <p><FaCogs /> Facilities: {hall.facilities.join(', ')}</p>
      </div>
    </div>
  );
};

export default Available_Details;
