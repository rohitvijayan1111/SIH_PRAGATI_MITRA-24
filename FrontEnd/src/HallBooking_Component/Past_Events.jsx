import React, { useEffect, useState } from 'react';
import EventDetails from './EventDetails';
import axios from 'axios';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Past_Events.css';
import past from '../assets/nopast.png';
import { getTokenData } from '../Pages/authUtils';

function Past_Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [name,setName]=useState("");
  const tokendata=getTokenData();
  const notifyInfo = (error) => {
    toast.info(error, {
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
    async function fetchPastEvents() {
      try {
        const response = await axios.post('http://localhost:3000/hall/past-events', {
              department:tokendata.department,
              role: tokendata.role
      });
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize with all events
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data) {
          setName(error.response.data.error);
          console.log('Error message from backend:', error.response.data);
          notifyInfo(error.response.data.error);
        } else {
          notifyFailure('An unexpected error occurred.');
        }
        console.error('Error fetching past events:', error);
        setLoading(false);
      }
    }

    fetchPastEvents();
  }, []);

  useEffect(() => {
    // Filter events based on the search term
    const filtered = events.filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="search-bar-container">
        <input
            type="text"
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
        />
      </div>
      
      {filteredEvents.length === 0 && 
        <div style={{ textAlign: 'center', width: '100%', height: '100%' }}>
          <img src={past} alt="Error occurred" style={{ width: '50%', height: '50%' }} />
        </div>
      }
      
      {filteredEvents.map((event, index) => (
        <div className="event-container" key={index}>
          <EventDetails needbutton={false} eventData={event} showdelete={false} checkall={true} />
        </div>
      ))}
      
      <ToastContainer />
    </div>
  );
}

export default Past_Events;
