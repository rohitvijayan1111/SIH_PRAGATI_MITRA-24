// import React from 'react';
// import styled from 'styled-components';
// import { Bar, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

// // Register the components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ChartTitle,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement
// );

// // Styled Components for the dashboard_Infra
// const Dashboard_InfraContainer = styled.div`
//   padding: 0px 20px 20px 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   min-height: 100vh;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   color: #164863;
//   text-align: center;
// `;

// const OverviewContainer = styled.div`
//   display: flex;
//   gap: 20px;
//   justify-content: space-between;
// `;

// const Card = styled.div`
//   background-color: #fff;
//   border-radius: 10px;
//   padding: 20px;
//   flex: 1;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const CardTitle = styled.h3`
//   font-size: 1.2rem;
//   color: #164863;
// `;

// const CardValue = styled.p`
//   font-size: 2rem;
//   color: #164863;
// `;

// const DataContainer = styled.div`
//   display: flex;
//   flex-direction: space-between;
//   gap: 220px;
//   margin-left:180px;
// `;

// const SectionTitle = styled.h2`
//   font-size: 1.8rem;
//   color: #164863;
//   margin-bottom: 10px;
// `;

// const ChartContainer = styled.div`
//   background-color: #fff;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   height: 300px; /* Adjust height */
//   width: 400px;  /* Adjust width */
//   margin: auto;      /* Center align */
// `;

// // Sample data for the charts
// const buildingMaintenanceData = {
//   labels: ['Building A', 'Building B', 'Building C', 'Building D'],
//   datasets: [
//     {
//       label: 'Maintenance Status',
//       data: [30, 50, 75, 20], // Example maintenance percentages
//       backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
//     },
//   ],
// };

// const projectTimelineData = {
//   labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4'],
//   datasets: [
//     {
//       label: 'Completion (%)',
//       data: [25, 50, 75, 100], // Example completion percentages
//       borderColor: '#3498db',
//       backgroundColor: 'rgba(52, 152, 219, 0.2)',
//       pointBorderColor: '#2980b9',
//       pointBackgroundColor: '#3498db',
//       fill: true,
//     },
//   ],
// };

// const Dashboard_Infra = () => {
//   return (
//     <Dashboard_InfraContainer>
//       <Title>Infrastructure Coordinator Dashboard</Title>

//       {/* Overview Section */}
//       <OverviewContainer>
//         <Card>
//           <CardTitle>Total Buildings</CardTitle>
//           <CardValue>15</CardValue>
//         </Card>
//         <Card>
//           <CardTitle>Ongoing Maintenance</CardTitle>
//           <CardValue>3</CardValue>
//         </Card>
//         <Card>
//           <CardTitle>Budget Utilized</CardTitle>
//           <CardValue>75%</CardValue>
//         </Card>
//         <Card>
//           <CardTitle>Pending Projects</CardTitle>
//           <CardValue>5</CardValue>
//         </Card>
//       </OverviewContainer>

//       {/* Data Collection and Visualization */}
//       <DataContainer>
//         {/* Building Maintenance Chart */}
//         <div>
//           <SectionTitle>Building Maintenance Status</SectionTitle>
//           <ChartContainer>
//             <Bar width="200px" data={buildingMaintenanceData} />
//           </ChartContainer>
//           </div>

//         {/* Ongoing Projects Timeline */}
//         <div>
//           <SectionTitle>Ongoing Projects Timeline</SectionTitle>
//           <ChartContainer>
//             <Line width="200px" data={projectTimelineData} />
//           </ChartContainer>
//           </div>

//       </DataContainer>
//     </Dashboard_InfraContainer>
//   );
// };

// export default Dashboard_Infra;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title as ChartTitle, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Dashboard_InfraContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 10px;
  }

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

// Title of the dashboard
const Title = styled.h1`
  font-size: 2.5rem;
  color: #164863;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

// Container for the overview cards
const OverviewContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Individual card component
const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  flex: 1;
  min-width: 200px;
  max-width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background-color: #C5E7F7;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
  }
`;

// Title for each card
const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #164863;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Value displayed in each card
const CardValue = styled.p`
  font-size: 2rem;
  color: #164863;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Container for the data charts
const DataContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

// Container for each chart
const ChartContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Title for each chart section
const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: #164863;
  margin-bottom: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;


// Main Component
const Dashboard_Infra = () => {
  // State variables for card values
  const [totalBuildingsCompleted, setTotalBuildingsCompleted] = useState(0);
  const [totalBuildingsOngoing, setTotalBuildingsOngoing] = useState(0);
  const [maintenanceCompletionPercentage, setMaintenanceCompletionPercentage] = useState(0);
  const [greenInitiativesCount, setGreenInitiativesCount] = useState(0);

  // State to store chart data for green initiatives
  const [greenInitiativesData, setGreenInitiativesData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Completion (%)',
        data: [],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        pointBorderColor: '#2980b9',
        pointBackgroundColor: '#3498db',
        fill: true,
      },
    ],
  });

  // State to store data for "Constructions Undertaken" bar chart
  const [constructionsData, setConstructionsData] = useState({
    labels: ['Ongoing', 'Completed'],
    datasets: [
      {
        label: 'Number of Buildings',
        data: [0, 0],
        backgroundColor: ['#3498db', '#27ae60'],
      },
    ],
  });

  // Fetch data for cards and chart
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const completedResponse = await axios.get('http://localhost:3000/infra/getTotalBuildingsCompleted');
        const completedBuildings = completedResponse.data.totalBuildingsCompleted || 0;
        setTotalBuildingsCompleted(completedBuildings);

        const ongoingResponse = await axios.get('http://localhost:3000/infra/getTotalBuildingsOngoing');
        const ongoingBuildings = ongoingResponse.data.totalBuildingsOngoing || 0;
        setTotalBuildingsOngoing(ongoingBuildings);

        const maintenanceResponse = await axios.get('http://localhost:3000/infra/getMaintenanceCompletionPercentage');
        setMaintenanceCompletionPercentage(maintenanceResponse.data.maintenanceCompletionPercentage);

        const greenInitiativesResponse = await axios.get('http://localhost:3000/infra/getGreenInitiativesCount');
        setGreenInitiativesCount(greenInitiativesResponse.data.greenInitiativesCount);

        // Update the constructions bar chart data
        setConstructionsData({
          labels: ['Ongoing', 'Completed'],
          datasets: [
            {
              label: 'Number of Buildings',
              data: [ongoingBuildings, completedBuildings],
              backgroundColor: ['#3498db', '#27ae60'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    const fetchGreenInitiativesData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/infra/getGreenInitiativesData');
        const data = response.data;
        const labels = data.map(item => item.initiative_name);
        const percentages = data.map(item => item.completion_percentage);

        setGreenInitiativesData({
          labels,
          datasets: [
            {
              label: 'Completion (%)',
              data: percentages,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching green initiatives data:', error);
      }
    };

    fetchCardData();
    fetchGreenInitiativesData();
  }, []);

  return (
    <Dashboard_InfraContainer>
      <Title>Infrastructure Coordinator Dashboard</Title>
      <br/>
      <OverviewContainer>
        <Card>
          <CardTitle>Total Buildings - Completed</CardTitle>
          <CardValue>{totalBuildingsCompleted}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Buildings - Ongoing</CardTitle>
          <CardValue>{totalBuildingsOngoing}</CardValue>
        </Card>
        <Card>
          <CardTitle>Maintenance Completion</CardTitle>
          <CardValue>{maintenanceCompletionPercentage}%</CardValue>
        </Card>
        <Card>
          <CardTitle>Green Initiative Projects</CardTitle>
          <CardValue>{greenInitiativesCount}</CardValue>
        </Card>
      </OverviewContainer>
      <br/>
      <DataContainer>
        <ChartContainer>
          <SectionTitle>Green Initiatives - Completion Status</SectionTitle>
          <Line height="150px"  data={greenInitiativesData} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
          }}/>
        </ChartContainer>

        <ChartContainer>
          <SectionTitle>Constructions Undertaken</SectionTitle>
          <Bar data={constructionsData} />
        </ChartContainer>
      </DataContainer>
    </Dashboard_InfraContainer>
  );
};

export default Dashboard_Infra;













