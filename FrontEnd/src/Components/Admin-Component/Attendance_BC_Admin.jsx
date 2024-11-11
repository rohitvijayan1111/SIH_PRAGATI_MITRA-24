import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip-pbg">
          <p className="tooltip-value-pbg">
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="intro" style={{ color: entry.color,fontSize:"16px" }}>
              {`${entry.value}`}
            </p>
          ))}
          </p>
        </div>
      );
    }
  
    return null;
  };
export default function Attendance_BC_Admin({data}) {
  console.log("ADMMIN GRAPH");
  console.log(data);
  return (
    <>
    <ResponsiveContainer>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
            right: 20,
            left: -20,
            bottom: 5,
        }}
      >
        <CartesianGrid stroke="white" strokeDasharray="3 3" />
        <XAxis dataKey="name" /> 
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "16px" }}/>
        <Bar dataKey="present" stackId="a" fill="#8884d8" barSize="15" animationBegin={0} animationDuration={1400} />
        <Bar dataKey="absent" stackId="a" fill="#82ca9d" barSize="15" animationBegin={0} animationDuration={1400}/>
      </BarChart>
    </ResponsiveContainer>
    </>
  );
}
