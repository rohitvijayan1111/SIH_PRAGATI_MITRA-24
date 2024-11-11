import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';
import './DashBoard_Hall.css';
import events from '../assets/events.png';
import { getTokenData } from '../Pages/authUtils';

function DashBoard_Hall() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const tokendata = getTokenData();
  const user = tokendata.role;
  const userDepartment = tokendata.department; 
  const [name, setName] = useState("");

  const rolemapping = {
    'hod': "HOD",
    "academic_coordinator": "Academic Coordinator",
    "principal": "Principal",
    "Event Coordinator": "Event Coordinator"
  };

  const determineEndpoint = (userType) => {
    console.log("IN ENDPOINT " + userType);
    switch (userType) {
      case 'hod':
        return 'cancelEventByHOD';
      case 'academic_coordinator':
        return 'cancelEventByAcademicCoordinator';
      case 'principal':
        return 'cancelEventByPrincipal';
      case "Event Coordinator":
        return 'cancelEventByEventCoordinator'
      default:
        throw new Error('Invalid user type');
    }
  };

  const notifyFailure = (error) => {
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

  const handleDelete = async (event) => {
    try {
      await axios.post('http://localhost:3000/hall/hall_requests_remove_admin', { id: event.id });
      setUpcomingEvents(upcomingEvents.filter((e) => e.id !== event.id));
      const endpoint = determineEndpoint(user);
      const formattedDate = dayjs(event.event_date).format('MMMM DD, YYYY');
      const formContent = `
      Hall booking approval request for the event "${event.name}" scheduled on ${formattedDate} from ${event.start_time} to ${event.end_time} at ${event.hall_name} is cancelled by ${rolemapping[user]}.
      Event Name: ${event.name}
      Speaker: ${event.speaker}
      Speaker Description: ${event.speaker_description}
      Department: ${event.department}
      Participants: ${event.participants}
      In-charge Faculty: ${event.incharge_faculty}
      Facilities Needed: ${event.facility_needed}
      `;

      await axios.post(`http://localhost:3000/mail/${endpoint}`, {
        formSubject: formContent,
        department: event.department,
        emails: event.emails
      });

    } catch (error) {
      console.error('Error deleting event:', error);
      notifyFailure('Error deleting event');
    }
  };

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const response = await axios.get('http://localhost:3000/hall/upcoming-events');
        setUpcomingEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        if (error.response && error.response.data) {
          console.log('Error message from backend:', error.response.data);
          setName(error.response.data.error);

        } else {
          notifyFailure('An unexpected error occurred.');
        }
        setLoading(false);
      }
    }

    fetchUpcomingEvents();
  }, []);



  return (
    <div className="dashboard-hall">
      <h1>Upcoming Events</h1>
      {upcomingEvents.length === 0 ? (
        <div className='image'>
          <img src={events} width="50%" height="50%"/>
        </div>
      ) : (
        upcomingEvents.map((event, index) => {
          const canCancel = 
            event.department === userDepartment;

          return (
            <div className="event-container" key={index}>
              <EventDetails
                checkall={true}
                onDelete={canCancel ? () => handleDelete(event) : null}
                showdelete={canCancel}
                eventData={event}
              />
            </div>
          );
        })
      )}
      <ToastContainer />
    </div>
  );
}

export default DashBoard_Hall;
