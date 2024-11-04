import React from 'react';
import './PlacementBarGraph.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './PlacementBarGraph.css'

const PlacementBarGraph = ({ Details }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={Details}
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: -20,
        }}
      >
        <CartesianGrid stroke="white" strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar type="monotone" dataKey="students" fill="#9CDBA6" barSize={40} animationBegin={0} animationDuration={1400}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pbg">
        <p className="tooltip-value-pbg">
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
            {`${entry.value}`}
          </p>
        ))}
        </p>
      </div>
    );
  }

  return null;
};

export default PlacementBarGraph;
