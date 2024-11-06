import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import styled from "styled-components";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    padding: 10px;
  }
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

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        {payload.map((entry, index) => (
          <TooltipValue key={`item-${index}`} style={{ color: entry.payload.fill }}>
            {`${entry.name}: ${entry.value}`}
          </TooltipValue>
        ))}
      </CustomTooltipContainer>
    );
  }
  return null;
};

const FacultyCountPieChart = ({ data }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: -10, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140}
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
};

export default FacultyCountPieChart;
