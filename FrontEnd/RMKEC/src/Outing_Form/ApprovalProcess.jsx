import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaCheckCircle, FaCommentDots, FaMars, FaVenus, FaIdCard, FaSchool, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';

const ApprovalProcess = () => {
  const [counselorComments, setCounselorComments] = useState("");
  const [outingType, setOutingType] = useState("General Outing");
  let userRole = 'counselor';
  const dummyData = {
    studentName: "John Doe",
    registrationNumber: "123456",
    year: 3,
    department: "Information Technology",
    section: "A",
    roomNumber: "B12",
    noOfDays: 5,
    fromDate: "2024-09-20",
    toDate: "2024-09-25",
    reasonForLeave: "Family Emergency",
    fatherName: "Michael Doe",
    motherName: "Jane Doe",
    contactNumber1: "9876543210",
    contactNumber2: "9876543222",
    nativePlace: "New York",
    gender: "Male",
    counselorName: "Mr. Smith",
    counselorComments: "",
    yearCoordinatorName: "Mrs. Johnson",
    dateOfLeaving: "2024-09-20",
    timeOfLeaving: "10:00 AM",
    requestDate: "2024-09-15",
    status: {
      counsellor: "Approved",
      yearCoordinator: "Approved",
      hod: "Approved",
      principal: "Pending"
    }
  };

  const handleCounselorCommentsChange = (e) => {
    setCounselorComments(e.target.value);
  };

  const handleCounselorApproval = () => {
    alert("Counselor comments submitted: " + counselorComments);
  };

  const handleOutingTypeChange = (e) => {
    setOutingType(e.target.value);
  };

  return (
    <ApprovalCard>
      <h2>Leave Request Approval</h2>

      <Details>
        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Name:</strong> <p>{dummyData.studentName}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaIdCard className="icon" />
          <div>
            <strong>Registration No:</strong> <p>{dummyData.registrationNumber}</p>
          </div>
        </DetailItem>

        <DetailItem>
          {dummyData.gender === 'Male' ? <FaMars className="icon" /> : <FaVenus className="icon" />}
          <div>
            <strong>Gender:</strong> <p>{dummyData.gender}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaSchool className="icon" />
          <div>
            <strong>Branch:</strong> <p>{dummyData.department}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaSchool className="icon" />
          <div>
            <strong>Year:</strong> <p>{dummyData.year}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaSchool className="icon" />
          <div>
            <strong>Section:</strong> <p>{dummyData.section}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Room Number:</strong> <p>{dummyData.roomNumber}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaClock className="icon" />
          <div>
            <strong>No of Days:</strong> <p>{dummyData.noOfDays}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaCalendarAlt className="icon" />
          <div>
            <strong>Date of Application:</strong> <p>{dummyData.requestDate}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaCalendarAlt className="icon" />
          <div>
            <strong>From Date:</strong> <p>{dummyData.fromDate}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaCalendarAlt className="icon" />
          <div>
            <strong>To Date:</strong> <p>{dummyData.toDate}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaCommentDots className="icon" />
          <div>
            <strong>Reason for Leave:</strong> <p>{dummyData.reasonForLeave}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Father's Name:</strong> <p>{dummyData.fatherName}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Mother's Name:</strong> <p>{dummyData.motherName}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaPhoneAlt className="icon" />
          <div>
            <strong>Contact Number 1:</strong> <p>{dummyData.contactNumber1}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaPhoneAlt className="icon" />
          <div>
            <strong>Contact Number 2:</strong> <p>{dummyData.contactNumber2}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaMapMarkerAlt className="icon" />
          <div>
            <strong>Native Place:</strong> <p>{dummyData.nativePlace}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Year Coordinator:</strong> <p>{dummyData.yearCoordinatorName}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaCalendarAlt className="icon" />
          <div>
            <strong>Date of Leaving:</strong> <p>{dummyData.dateOfLeaving}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaClock className="icon" />
          <div>
            <strong>Time of Leaving:</strong> <p>{dummyData.timeOfLeaving}</p>
          </div>
        </DetailItem>

        <DetailItem>
          <FaUser className="icon" />
          <div>
            <strong>Counselor:</strong> <p>{dummyData.counselorName}</p>
          </div>
        </DetailItem>

        {userRole === 'counselor' ? (
  <DetailItem>
    <FaCommentDots className="icon" />
    <div>
      <strong>Counselor's Comments:</strong>
      <textarea
        value={counselorComments}
        onChange={handleCounselorCommentsChange}
        placeholder="Enter counselor's comments"
        className="counselor-comments-textarea"
        style={{width: "100%",
          padding: "10px",
          fontSize: "15px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#fff",
          marginTop: "5px",
          resize: "none"}}
      />
    </div>
    </DetailItem>
) : (
  <div className="detail-item">
    <FaCommentDots className="icon" />
    <div>
      <strong>Counselor's Comments:</strong>
      <p>{dummyData.counselorComments || "No comments provided"}</p>
    </div>
  </div>
)}

      <DetailItem>
        <FaCalendarAlt className="icon" />
        <strong>Outing Type:</strong>
        <Select value={outingType} onChange={handleOutingTypeChange}>
          <Option value="General Outing">General Outing</Option>
          <Option value="Working Day Outing">Working Day Outing</Option>
        </Select>
      </DetailItem>


      </Details>

      <ApprovalStatus>
        <StatusItem>
          <span>Counsellor</span>
          <FaCheckCircle className={dummyData.status.counsellor === "Approved" ? "approved" : "pending"} />
        </StatusItem>
        <StatusItem>
          <span>Year Coordinator</span>
          <FaCheckCircle className={dummyData.status.yearCoordinator === "Approved" ? "approved" : "pending"} />
        </StatusItem>
        <StatusItem>
          <span>HoD</span>
          <FaCheckCircle className={dummyData.status.hod === "Approved" ? "approved" : "pending"} />
        </StatusItem>
        <StatusItem>
          <span>Principal</span>
          <FaCheckCircle className={dummyData.status.principal === "Approved" ? "approved" : "pending"} />
        </StatusItem>
      </ApprovalStatus>

      {userRole === 'counselor' && (
        <CounselorActions>
          <ApproveButton onClick={handleCounselorApproval}>
            Submit Comments & Approve
          </ApproveButton>
        </CounselorActions>
      )}
    </ApprovalCard>
  );
};

// Styled-components
const ApprovalCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  h2{
    color: #164863;
  }
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  .icon {
    margin-right: 10px;
    color: #B0E0E6;
    font-size:22px;
  }
  strong {
    margin-right: 5px;
    color: #164863;
    font-size:17px;
  }
  p {
    margin: 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 5px;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
  }
`;

const Option = styled.option`
  padding: 10px;
  background-color: #fff;
  cursor: pointer;
`;

const ApprovalStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
  .approved {
    color: green;
  }
  .pending {
    color: orange;
  }
`;

const CounselorActions = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const ApproveButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

export default ApprovalProcess;
