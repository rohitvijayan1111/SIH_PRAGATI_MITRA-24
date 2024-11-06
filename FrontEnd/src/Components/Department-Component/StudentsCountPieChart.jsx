import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import styled from "styled-components";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
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

  @media (max-width: 768px) {
    width: 100px;
    height: 50px;
  }
`;

const TooltipValue = styled.div`
  font-size: 0.875rem;
  color: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <TooltipValue>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.payload.fill }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </TooltipValue>
      </CustomTooltipContainer>
    );
  }
  return null;
};

const StudentCountPieChart = ({ data }) => (
  <ChartContainer>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          animationDuration={1400}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </ChartContainer>
);

export default StudentCountPieChart;
