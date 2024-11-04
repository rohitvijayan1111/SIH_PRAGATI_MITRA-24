import React from 'react';
import './EventDetails.css';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaChalkboardTeacher, FaTools, FaCheckCircle } from 'react-icons/fa';

const EventDetail = () => {
  return (
    <div className="event-detail">
      <h2>{eventData.name}</h2>
      <div className="event-content">
        <div className="event-row">
          <div className="event-item">
            <FaUser className="icon" />
            <div>
              <h4>Speaker</h4>
              <p>{eventData.speaker}</p>
              <p className="description">{eventData.speakerDescription}</p>
            </div>
          </div>
          <div className="event-item">
            <FaCalendarAlt className="icon" />
            <div>
              <h4>Date</h4>
              <p>{eventData.date}</p>
            </div>
          </div>
          <div className="event-item">
            <FaClock className="icon" />
            <div>
              <h4>Time</h4>
              <p>{eventData.from} - {eventData.to}</p>
            </div>
          </div>
        </div>
        <div className="event-row">
          <div className="event-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h4>Venue</h4>
              <p>{eventData.hallName}</p>
            </div>
          </div>
          <div className="event-item">
            <FaUsers className="icon" />
            <div>
              <h4>Participants</h4>
              <p>{eventData.participants}</p>
            </div>
          </div>
          <div className="event-item">
            <FaChalkboardTeacher className="icon" />
            <div>
              <h4>In-charge Faculty</h4>
              <p>{eventData.inchargeFaculty}</p>
            </div>
          </div>
          <div className="event-item">
            <FaTools className="icon" />
            <div>
              <h4>Facilities Needed</h4>
              <p>{eventData.facilityNeeded}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="approvals">
        <div className="approval-item">
          <span>HoD</span>
          {eventData.approvals.hod && <FaCheckCircle className="approval-icon" />}
        </div>
        <div className="approval-item">
          <span>Vice Principal</span>
          {eventData.approvals.vicePrincipal && <FaCheckCircle className="approval-icon" />}
        </div>
        <div className="approval-item">
          <span>Principal</span>
          {eventData.approvals.principal && <FaCheckCircle className="approval-icon" />}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
