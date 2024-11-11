import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import styled from 'styled-components';

const COLORS = [
  "#FF6666",
  "#FFB366",
  "#FF9933",
  "#80E6B3",
  "#66CCCC",
  "#9999FF",
  "#FF66FF",
  "#66FF66",
  "#FFB300",
  "#FF80AA"
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
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
      fontSize={15}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, First_year, Second_year, Third_year, Fourth_year, fill } = payload[0].payload;

    const data = [
      { label: "First Year", value: First_year },
      { label: "Second Year", value: Second_year },
      { label: "Third Year", value: Third_year },
      { label: "Fourth Year", value: Fourth_year }
    ];

    return (
      <TooltipContainer>
        <TooltipContent>
          <p style={{ color: fill }}>{name}</p>
          {data.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: fill, fontSize: "12px" }}>
              {entry.label}: {entry.value}
            </p>
          ))}
        </TooltipContent>
      </TooltipContainer>
    );
  }
  return null;
};

const PrincipalSPC = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChartWrapper>
      <PieChart width={400} height={400} margin={{ top: -10, right: 0, left: 10, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          formatter={(value, name, props) => {
            const fill = COLORS[props.payload.index % COLORS.length];
            props.payload.payload.fill = fill;
            return value;
          }}
        />
          <Legend wrapperStyle={{ fontSize: "14px",maxWidth: "350px" }} />

      </PieChart>
    </PieChartWrapper>
  </ResponsiveContainer>
);

export default PrincipalSPC;

// Styled Components

const PieChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TooltipContainer = styled.div`
  color: white;
  display: flex;
  text-align: center;
  background-color: #1e293b;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 120px;
    height: 150px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 130px;
  }
`;

const TooltipContent = styled.div`
  font-size: 0.875rem;
  padding: 0;
  color: white;
  display: flex;
  flex-direction: column;
`;

const LegendWrapper = styled.div`
  font-size: 16px;
  overflow-wrap: break-word;  // Ensure the text wraps instead of overflowing
  
  @media (max-width: 768px) {
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;  // Allow legend items to wrap on smaller screens
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    display: block;  // Block display on very small screens to ensure the legend doesn't overlap
    text-align: center;
  }
`;
