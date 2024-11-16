import React from "react";
import './CustomBar.css'
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884", "#c658ff", "#42aaff", "#ff6b6b", "#d6a4e1", "#83d3a2", "#82a3d8", "#c9aaf9"];

function CustomBar({ data, graphType, colorSettings }) {
    console.log(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
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

        {Object.keys(data[0] || {}).filter(key => key !== "name").map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colorSettings && colorSettings[key] ? colorSettings[key] : COLORS[index % COLORS.length]}
            barSize={15}
            stackId="a"
            animationDuration={1500}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pbc">
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomBar;
