import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f4f7f6;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
  text-align: center;
  max-width: 1200px;
  margin: auto;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    margin: 5px;
  }
`;

const Header = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OverviewContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
  }
  @media (max-width: 480px) {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background-color: #aee5ff;
  }

  @media (max-width: 480px) {
    min-width: 90%;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #164863;
`;

const CardValue = styled.p`
  font-size: 1.5rem;
  color: #164863;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ChartWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 300px;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    padding: 5px;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  color: red;
  text-align: center;
`;

// Main Component
const FinanceSummaryTable = () => {
  const [financialSummary, setFinancialSummary] = useState({
    total_salary: 0,
    total_income: 0,
    total_expense: 0,
  });

  const [expensesData, setExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the financial summary data from the backend API
  const fetchSummaryData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/summary/totals');
      setFinancialSummary(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching financial summary:', err);
      setError('Failed to load data');
      setIsLoading(false);
    }
  };

  // Fetch the expense data from the backend API
  const fetchExpenseData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/expense');
      setExpensesData(response.data);
    } catch (err) {
      console.error('Error fetching expenses data:', err);
    }
  };

  useEffect(() => {
    fetchSummaryData();
    fetchExpenseData();
  }, []);

  // Calculate the total revenue generated
  const totalRevenueGenerated =
    financialSummary.total_income - (financialSummary.total_salary + financialSummary.total_expense);

  // Prepare data for the BarChart
  const chartData = [
    
    { name: 'Income', amount: financialSummary.total_income },
    { name: 'Expense', amount: financialSummary.total_expense },
    { name: 'Salary', amount: financialSummary.total_salary },
    { name: 'Revenue', amount: totalRevenueGenerated },
  ];

  // Prepare data for the PieChart (expenses and their liabilities)
  const pieData = expensesData.map((expense) => ({
    name: expense.liabilities,
    value: expense.cost,
  }));

  // Colors for charts
  const barColors = ['#1E88E5', '#43A047', '#FB8C00', '#D81B60'];
  const pieColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  // Show a loading message while fetching data
  if (isLoading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  // Show an error message if fetching data fails
  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <Container>
      <Header>Financial Analysis</Header>
      <OverviewContainer>
        <Card>
          <CardTitle>Total Cost Spent On Salary</CardTitle>
          <CardValue>{financialSummary.total_salary.toLocaleString()}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Income Grossed</CardTitle>
          <CardValue>{financialSummary.total_income.toLocaleString()}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Amount Spent On Expenditure</CardTitle>
          <CardValue>{financialSummary.total_expense.toLocaleString()}</CardValue>
        </Card>
      </OverviewContainer>

      <ChartsContainer>
        {/* Bar Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#333' }}  />
              <YAxis  style={{ fontSize: '8px', fontWeight: 'bold', fill: '#333' }} />
              <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
              <Legend style={{paddingBottom:"50px"}} />
              <Bar dataKey="amount" barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Pie Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name }) => name}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartsContainer>
    </Container>
  );
};

export default FinanceSummaryTable;
