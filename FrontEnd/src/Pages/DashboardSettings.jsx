// src/components/DashboardSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getTokenData } from './authUtils';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.8em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 1em;
  color: #555;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const Select = styled.select`
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #4caf50;
  color: white;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const InlineSelect = styled.div`
  display: flex;
  gap: 10px;
`;

// Component
const DashboardSettings = () => {
  const [configName, setConfigName] = useState('');
  const [graphType, setGraphType] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [joinConditions, setJoinConditions] = useState([]);
  const [aggregations, setAggregations] = useState([{ type: '', column: '', condition: '' }]); // Multiple aggregations
  const [filters, setFilters] = useState([{ column: '', operator: '=', value: '' }]);
  const [orderBy, setOrderBy] = useState({ field: '', direction: 'ASC' });
  const [limit, setLimit] = useState('');
  const [settings, setSettings] = useState({ color: '', label: '' });
  const [groupBy, setGroupBy] = useState([]); 
  const tokenData = getTokenData();
  const { userId } = tokenData;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tables/gettablelist');
        setAvailableTables(response.data.tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchTableColumns = async () => {
      if (selectedTables.length > 0) {
        try {
          const response = await axios.post('http://localhost:3000/tables/columns', { tables: selectedTables });
          setTableColumns(response.data.columns);
        } catch (error) {
          console.error("Error fetching columns:", error);
        }
      }
    };
    fetchTableColumns();
  }, [selectedTables]);


  // Handle adding a new join condition
  const addJoinCondition = () => {
    setJoinConditions([...joinConditions, { table1: '', column1: '', table2: '', column2: '', type: 'INNER' }]);
  };

  // Update join conditions based on user input
  const updateJoinCondition = (index, field, value) => {
    const updatedConditions = joinConditions.map((cond, i) =>
      i === index ? { ...cond, [field]: value } : cond
    );
    setJoinConditions(updatedConditions);
  };
  const addFilter = () => {
    setFilters([...filters, { column: '', operator: '=', value: '' }]);
  };
  
  // Function to update filter based on user input
  const updateFilter = (index, field, value) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index ? { ...filter, [field]: value } : filter
    );
    setFilters(updatedFilters);
  };

  const addAggregation = () => {
    setAggregations([...aggregations, { type: '', column: '', condition: '', customCondition: '' }]);
  };

  // Update aggregation logic and log state changes
  const updateAggregation = (index, field, value) => {
    const updatedAggregations = aggregations.map((agg, i) =>
      i === index ? { ...agg, [field]: value } : agg
    );
    setAggregations(updatedAggregations);
    console.log("Updated Aggregation State:", updatedAggregations);  // Log updated aggregation state
  };

  // Handle adding a new group by field
  const updateGroupBy = (e) => {
    const updatedGroupBy = [...e.target.selectedOptions].map(o => o.value);
    setGroupBy(updatedGroupBy);
    console.log("Updated GroupBy State:", updatedGroupBy);  // Log updated group by state
  };
  

  const handleSave = async () => {
    const newConfig = {
      user_id: userId,
      config_name: configName,
      graph_type: graphType,
      data_sources: selectedTables,
      join_conditions: joinConditions,
      aggregations,
      filters,
      order_by: orderBy,
      group_by:groupBy,
      limit: limit ? parseInt(limit, 10) : null,
      settings,
    };
    console.log(newConfig);
    try {
      const response = await axios.post('http://localhost:3000/dashboard/creategraph', newConfig);
      console.log("HURRETTTTTTTTTT");
    } catch (error) {
      console.error("Failed to save configuration", error);
    }
  };

  return (
    <Container>
      <Title>Create New Graph</Title>

      <Label>
        Graph Name:
        <Input type="text" value={configName} onChange={(e) => setConfigName(e.target.value)} />
      </Label>

      <Label>
        Graph Type:
        <Select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
          <option value="">Graph Type</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </Select>
      </Label>

      <Label>
        Data Sources:
        <Select multiple value={selectedTables} onChange={(e) => setSelectedTables([...e.target.selectedOptions].map(o => o.value))}>
          {availableTables.map((table) => (
            <option key={table.tableName} value={table.tableName}>{table.title}</option>
          ))}
        </Select>
      </Label>

      {/* Section for Join Conditions */}
      <Label>Join Conditions:</Label>
      {joinConditions.map((join, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Select
            value={join.table1}
            onChange={(e) => updateJoinCondition(index, 'table1', e.target.value)}
          >
            <option value="">Select Table</option>
            {selectedTables.map((table) => (
              <option key={table} value={table}>{table}</option>
            ))}
          </Select>

          <Select
            value={join.column1}
            onChange={(e) => updateJoinCondition(index, 'column1', e.target.value)}
            disabled={!join.table1}
          >
            <option value="">Select Column</option>
            {(tableColumns[join.table1] || []).map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </Select>

          <Select
            value={join.type}
            onChange={(e) => updateJoinCondition(index, 'type', e.target.value)}
          >
            <option value="">Join Type</option>
            <option value="INNER">INNER JOIN</option>
            <option value="LEFT">LEFT JOIN</option>
            <option value="RIGHT">RIGHT JOIN</option>
          </Select>

          <Select
            value={join.table2}
            onChange={(e) => updateJoinCondition(index, 'table2', e.target.value)}
          >
            <option value="">Select Table</option>
            {selectedTables.map((table) => (
              <option key={table} value={table}>{table}</option>
            ))}
          </Select>

          <Select
            value={join.column2}
            onChange={(e) => updateJoinCondition(index, 'column2', e.target.value)}
            disabled={!join.table2}
          >
            <option value="">Select Column</option>
            {(tableColumns[join.table2] || []).map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </Select>
        </div>
      ))}
      <Button onClick={addJoinCondition}>Add Join Condition</Button>

      <Label>Aggregations:</Label>
        {aggregations.map((aggregation, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <InlineSelect>
              <Select
                value={aggregation.type}
                onChange={(e) => updateAggregation(index, 'type', e.target.value)}
              >
                  <option value="">Aggregation Type</option>
                <option value="sum">Sum</option>
                <option value="count">Count</option>
                <option value="avg">Average</option>
              </Select>
              
              <Select
                value={aggregation.column}
                onChange={(e) => updateAggregation(index, 'column', e.target.value)}
              >
                  <option value="">Select Column</option>
                {selectedTables.flatMap(table => tableColumns[table] || []).map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </Select>
            </InlineSelect>

            {/* Custom Condition Input */}
            <Input
              type="text"
              placeholder="Custom Condition (e.g., CASE WHEN status = 'placed' THEN 1 ELSE 0 END)"
              value={aggregation.customCondition}
              onChange={(e) => updateAggregation(index, 'customCondition', e.target.value)}
            />
          </div>
        ))}
        <Button onClick={addAggregation}>Add Aggregation</Button>

        <Label>
          Group By:
          <Select multiple value={groupBy} onChange={updateGroupBy}>
            {selectedTables.flatMap(table => tableColumns[table] || []).map((column) => (
              <option key={column} value={column}>{column}</option>
            ))}
          </Select>
        </Label>

      <Label>Filters:</Label>
{filters.map((filter, index) => (
  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    <Select
      value={filter.column}
      onChange={(e) => updateFilter(index, 'column', e.target.value)}
    >
      <option value="">Select Column</option>
      {selectedTables.flatMap(table => tableColumns[table] || []).map((column) => (
        <option key={column} value={column}>{column}</option>
      ))}
    </Select>

    <Select
      value={filter.operator}
      onChange={(e) => updateFilter(index, 'operator', e.target.value)}
    >
       <option value="">Select Column</option>
      <option value="=">=</option>
      <option value=">">{'>'}</option>
      <option value="<">{'<'}</option>
      <option value="LIKE">LIKE</option>
    </Select>

    <Input
      type="text"
      value={filter.value}
      onChange={(e) => updateFilter(index, 'value', e.target.value)}
      placeholder="Filter Value"
    />
  </div>
))}
<Button onClick={addFilter}>Add Filter</Button>

      <Label>
        Order By:
        <InlineSelect>
          <Select value={orderBy.field} onChange={(e) => setOrderBy(prev => ({ ...prev, field: e.target.value }))}>
          <option value="">Select Field</option>
            {selectedTables.flatMap(table => tableColumns[table] || []).map((column) => (
              <option key={column} value={column}>{column}</option>
            ))}
          </Select>
          <Select value={orderBy.direction} onChange={(e) => setOrderBy(prev => ({ ...prev, direction: e.target.value }))}>
          <option value="">Direction</option>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </Select>
        </InlineSelect>
      </Label>

      <Label>
        Limit:
        <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Limit results" />
      </Label>

      <Button onClick={handleSave}>Save to Dashboard</Button>
    </Container>
  );
};

export default DashboardSettings;
