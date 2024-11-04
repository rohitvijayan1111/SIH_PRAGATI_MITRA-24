import React from 'react';
import { FaEye, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import './RequestList.css';
import NoPending from '../assets/outing-no-pending.png';

const RequestList = () => {
  const navigate = useNavigate();

  
  const requests = [
    {
      id: 1,
      name: 'John Doe',
      year: 3,
      section: 'A',
      branch: 'Information Technology',
      fromDate: '2024-09-15',
      toDate: '2024-09-17',
      numberOfDays: 3,
    },
    {
      id: 2,
      name: 'Jane Smith',
      year: 2,
      section: 'B',
      branch: 'Information Technology',
      fromDate: '2024-09-12',
      toDate: '2024-09-14',
      numberOfDays: 2,
    },
    {
      id: 3,
      name: 'Alice Johnson',
      year: 1,
      section: 'C',
      branch: 'Computer Science',
      fromDate: '2024-09-20',
      toDate: '2024-09-22',
      numberOfDays: 3,
    },
    {
      id: 4,
      name: 'Bob Brown',
      year: 4,
      section: 'D',
      branch: 'Mechanical Engineering',
      fromDate: '2024-09-18',
      toDate: '2024-09-20',
      numberOfDays: 3,
    },
    {
      id: 5,
      name: 'Charlie Green',
      year: 2,
      section: 'E',
      branch: 'Electrical Engineering',
      fromDate: '2024-09-10',
      toDate: '2024-09-11',
      numberOfDays: 1,
    }
  ];

  const handleView = (requestId) => {
   
    navigate(`/request-detail/${requestId}`);
  };

  const handleApprove = (requestId) => {
   
    console.log(`Approve request: ${requestId}`);

  };

  return (
    <div className="request-list">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color:"#164863"}}>Outing Form Requests</h2> {/* Added h2 tag */}
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-info">
              <p><strong>Name               :</strong> {request.name}</p>
              <p><strong>Year-Branch-Section:</strong> {`${request.year}-${request.branch}-${request.section}`}</p>
              <p><strong>From               :</strong> {request.fromDate} <strong>To:</strong> {request.toDate}</p>
              <p><strong>Number of Days     :</strong> {request.numberOfDays}</p>
            </div>
            <div className="request-actions">
              <button onClick={() => handleView(request.id)} className="btn-view">
                <FaEye /> View
              </button>
              <button onClick={() => handleApprove(request.id)} className="btn-approve">
                <FaCheck /> Approve
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="outing-image" style={{ textAlign: 'center', width: '60%', height: '60%' }}>
          <img src={NoPending} alt="No pending requests" style={{ width: '50%', height: '50%' }} />
        </div>
      )}
    </div>
  );
};

export default RequestList;
