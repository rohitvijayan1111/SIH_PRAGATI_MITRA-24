import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const CustomTooltipContainer = styled.div`
  color: white;
  display: flex;
  text-align: center;
  background-color: #1e293b;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 60px;
  border-radius: 8px;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 100px;
    height: 50px;
  }
`;

const TooltipValue = styled.p`
  margin: 0;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        {payload.map((entry, index) => (
          <TooltipValue key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.value}`}
          </TooltipValue>
        ))}
      </CustomTooltipContainer>
    );
  }
  return null;
};

const PlacementBarGraph = ({ Details }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={Details}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: -20,
          }}
        >
          <CartesianGrid stroke="white" strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar type="monotone" dataKey="students" fill="#9CDBA6" barSize={40} animationBegin={0} animationDuration={1400} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PlacementBarGraph;
