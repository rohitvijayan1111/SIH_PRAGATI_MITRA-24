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
    const { name, Professor, Associate_Professor, Assistant_Professor, fill } = payload[0].payload;

    const data = [
      { label: "Professor", value: Professor },
      { label: "Associate Professor", value: Associate_Professor },
      { label: "Assistant Professor", value: Assistant_Professor },
    ];

    return (
      <TooltipContainer>
        <TooltipValue>
          <p style={{ color: fill }}>{name}</p>
          {data.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: fill, fontSize: "12px" }}>
              {entry.label}: {entry.value}
            </p>
          ))}
        </TooltipValue>
      </TooltipContainer>
    );
  }
  return null;
};

const PrincipalFPC = ({ data }) => (
  <ResponsiveContainer>
    <ChartContainer>
      <PieChart width={400} height={400} margin={{
        top: -10,
        right: 0,
        left: 0,
        bottom: 0,
      }}>
        <Pie
          data={data}
          cx={200}
          cy={200}
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
        <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "16px",maxWidth: "350px" }} />

      </PieChart>
    </ChartContainer>
  </ResponsiveContainer>
);

export default PrincipalFPC;

// Styled Components

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TooltipContainer = styled.div`
  color: white;
  display: flex;
  text-align: center;
  background-color: #1e293b;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 190px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 150px;
    height: 130px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 110px;
  }
`;

const TooltipValue = styled.div`
  font-size: 0.875rem;
  padding: 0px;
  color: white;
  display: flex;
  flex-direction: column;
`;

const LegendWrapper = styled.div`
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap on smaller screens */
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    display: block;
    text-align: center;
  }
`;
