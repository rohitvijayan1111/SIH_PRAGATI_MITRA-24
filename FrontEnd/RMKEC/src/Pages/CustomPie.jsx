import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./CustomPie.css";

// Define color palette
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

// Custom label rendering for each slice of the pie chart
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

// Custom Tooltip to display data in an informative format
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0].payload;

    return (
      <div className="custom-tooltip">
        <p style={{ color: fill, fontSize: "16px" }}>{name}</p>
        <p style={{ color: fill, fontSize: "12px" }}>
          Value: {value}
        </p>
      </div>
    );
  }
  return null;
};

// Generalized PieChart component
const CustomPie = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={140}
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
  </ResponsiveContainer>
);

export default CustomPie;
