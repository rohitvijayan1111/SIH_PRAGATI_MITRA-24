import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./PrincipalSPC.css";

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
      <div className="custom-tooltip-spc">
        <div className="tooltip-value-spc">
          <p style={{ color: fill }}>{name}</p>
          {data.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: fill,fontSize:"12px" }}>
              {entry.label}: {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PrincipalSPC = ({ data }) => (
  <ResponsiveContainer >
    {console.log(data)};
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <PieChart width={400} height={400} margin={{
          top: -10,
          right: 0,
          left: 10,
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
        <Tooltip 
          content={<CustomTooltip />} 
          formatter={(value, name, props) => {
            const fill = COLORS[props.payload.index % COLORS.length];
            props.payload.payload.fill = fill;
            return value;
          }} 
        />
        <Legend wrapperStyle={{ fontSize: "16px" }}/>
      </PieChart>
    </div>
  </ResponsiveContainer>
);

export default PrincipalSPC;
