import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./PrincipalFPC.css";

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
    const { name, Professor, Associate_Professor,Assistant_Professor, fill } = payload[0].payload;

    const data = [
      { label: "Professor", value:Professor},
      { label: "Associate Professor", value: Associate_Professor},
      { label: "Assistant Professor", value: Assistant_Professor },
      
    ];

    return (
      <div className="custom-tooltip-pfp">
        <div className="tooltip-value-pfp">
          <p style={{ color: fill }}>{name}</p>
          {data.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: fill, fontSize: "12px" }}>
              {entry.label}: {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};


const PrincipalFPC = ({data}) => (
  <ResponsiveContainer >
    <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}}>
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
      <Legend wrapperStyle={{ fontSize: "16px" }} />
    </PieChart>      
    </div>

  </ResponsiveContainer>
);

export default PrincipalFPC;
