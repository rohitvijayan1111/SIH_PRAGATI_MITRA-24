import React from "react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pbg">
        <p className="tooltip-value-pbg">
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="intro"
              style={{ color: entry.color, fontSize: "14px" }} // Adjust font size here
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

export default function Attendance_BC({ data }) {
  return (
    <>
      <ResponsiveContainer >
        <BarChart
          data={data}
          width={500}
          height={300}
          margin={{
            top: 20,
            right: 20,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid stroke="white" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} /> 
          <YAxis tick={{ fontSize: 16 }} /> 
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "16px" }} /> 
          <Bar dataKey="present" stackId="a" fill="#8884d8" barSize={30} animationBegin={0} animationDuration={1400} />
          <Bar dataKey="absent" stackId="a" fill="#82ca9d" barSize={30} animationBegin={0} animationDuration={1400} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
