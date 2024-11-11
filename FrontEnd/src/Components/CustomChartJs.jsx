// CustomChartJs.js
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CustomChartJs = ({ data, type }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Dataset',
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color || 'rgba(75, 192, 192, 0.2)'),
        borderColor: data.map(item => item.color || 'rgba(75, 192, 192, 1)'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {type === 'bar' && <Bar data={chartData} />}
      {type === 'pie' && <Pie data={chartData} />}
    </>
  );
};

export default CustomChartJs;