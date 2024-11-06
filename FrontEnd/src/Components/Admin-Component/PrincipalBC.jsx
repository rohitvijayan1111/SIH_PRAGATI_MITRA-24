import React from "react";
import styled from "styled-components";
import './PrincipalBC.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PrincipalBC({ data }) {
  console.log(data);
  return (
    <Container>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: -20,
          }}
        >
          <CartesianGrid stroke="white" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} />
          <YAxis tick={{ fontSize: 16 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "16px" }} />
          <Bar dataKey="Placed" barSize={15} stackId="a" fill="#82ca9d" animationDuration={1500} />
          <Bar dataKey="NotPlaced" stackId="a" fill="#8884d8" animationDuration={1500} />
          <Bar dataKey="HS" stackId="a" fill="pink" animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <TooltipValue>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </TooltipValue>
      </TooltipContainer>
    );
  }

  return null;
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TooltipContainer = styled.div`
  padding: 8px;
  background-color: #1e293b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100px;  /* Reduce size on mobile */
    height: 80px;
  }
`;

const TooltipValue = styled.div`
  font-size: 0.875rem;
  padding: 0px;
  color: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    font-size: 0.75rem; /* Smaller font size on mobile */
  }
`;

export default PrincipalBC;
