import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import './FacultyCountPieChart.css';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-fcp">
        <div className="tooltip-value-fcp">
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="intro" style={{ color: entry.payload.fill }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const FacultyCountPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width={400} height={400}>
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
            animationDuration={1400}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
    </ResponsiveContainer>
  );
};

export default FacultyCountPieChart;
