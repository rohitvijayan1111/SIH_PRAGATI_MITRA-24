import React, { useEffect, useState } from 'react';
import './Available_Details.css';
import axios from 'axios';
import Available_Details from './Available_Details';
import hallimage from '../assets/hall.jpeg';

function Available_Halls() {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    fetchHalls(); 
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/hall/availablehalls');
      console.log(response.data); 
      setHalls(response.data); 
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  return (
    <div className="krt">
      <div className="hall-details-container">
        {halls.map((hall) => (
          <Available_Details key={hall.id} hall={hall} image={hallimage} />
        ))}
      </div>
    </div>
  );
}

export default Available_Halls;
