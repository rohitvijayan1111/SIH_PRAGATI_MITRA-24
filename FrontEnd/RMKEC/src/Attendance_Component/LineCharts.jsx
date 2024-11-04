import "./LineChart.css";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pbg">
        <p className="tooltip-value-pbg">
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="intro"
              style={{ color: entry.color, fontSize: "16px" }}
            >
              {`${entry.value}`}
            </p>
          ))}
        </p>
      </div>
    );
  }

  return null;
};

export default function LineCharts({ data }) {
  return (
    <ResponsiveContainer >
      <LineChart data={data} width={500} height={300} margin={{ top: 20, right: 20, left: -30, bottom: 5 }} >
        <CartesianGrid stroke="white" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 16 }} /> 
        <YAxis tick={{ fontSize: 16 }} /> 
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "16px" }} />
        <Line
          type="monotone"
          dataKey="absent"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          animationBegin={0}
          animationDuration={1400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
