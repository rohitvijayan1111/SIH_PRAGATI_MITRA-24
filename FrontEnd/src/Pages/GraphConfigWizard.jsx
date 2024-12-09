import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getTokenData } from './authUtils';

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StepContainer = styled.div`
  margin-bottom: 20px;
`;

const StepTitle = styled.h2`
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const StepDescription = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const OptionCard = styled.div`
  border: 2px solid ${props => props.selected ? '#4caf50' : '#ddd'};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e8f5e9' : 'white'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const ColumnConfigContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const ConfigRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-grow: 1;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-grow: 1;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ColumnSelect = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${props => props.selected ? '#e8f5e9' : '#f0f0f0'};
  border-radius: 8px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const UserFriendlyGraphWizard = () => {
  const [step, setStep] = useState(1);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [columnConfigurations, setColumnConfigurations] = useState([]);
  const [graphType, setGraphType] = useState('');
  const [configName, setConfigName] = useState('');
  const [groupByType, setGroupByType] = useState('none');
  const [groupByColumns, setGroupByColumns] = useState([]);
  const [filterType, setFilterType] = useState('none');
  const [filters, setFilters] = useState([]);

  const GRAPH_TYPES = [
    { value: 'bar', label: 'Bar Graph' },
    { value: 'line', label: 'Line Graph' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'area', label: 'Area Graph' }
  ];

  const CALCULATION_OPTIONS = [
    { value: 'sum', label: 'Total' },
    { value: 'count', label: 'Count' },
    { value: 'avg', label: 'Average' },
    { value: 'max', label: 'Highest/Maximum' },
    { value: 'min', label: 'Lowest/Minimum' }
  ];

  const GROUP_BY_OPTIONS = [
    { 
      value: 'none', 
      label: 'No Grouping', 
      description: 'Show all data without grouping' 
    },
    { 
      value: 'simple', 
      label: 'Simple Grouping', 
      description: 'Group by one column' 
    },
    { 
      value: 'multi', 
      label: 'Multiple Column Grouping', 
      description: 'Group by two or more columns' 
    }
  ];
  
  const FILTER_TYPE_OPTIONS = [
    { 
      value: 'none', 
      label: 'No Filters', 
      description: 'Show all data without restrictions' 
    },
    { 
      value: 'simple', 
      label: 'Simple Filter', 
      description: 'Apply one condition to filter data' 
    },
    { 
      value: 'advanced', 
      label: 'Multiple Filters', 
      description: 'Apply multiple conditions to refine data' 
    }
  ];
  
  const FILTER_CONDITIONS = [
    { value: '=', label: 'Exactly Matches' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'At Least' },
    { value: '<=', label: 'At Most' },
    { value: 'like', label: 'Contains' }
  ];

  // Fetch tables on component mount
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

  // Fetch columns when tables are selected
  useEffect(() => {
    const fetchTableColumns = async () => {
      if (selectedTables.length > 0) {
        try {
          const response = await axios.post('http://localhost:3000/tables/columns', { 
            tables: selectedTables.map(t => t.tableName) 
          });
          setTableColumns(response.data.columns);
        } catch (error) {
          console.error("Error fetching columns:", error);
        }
      }
    };
    fetchTableColumns();
  }, [selectedTables]);

  // Handle table selection
  const handleTableSelection = (table) => {
    setSelectedTables(prevTables => {
      const isAlreadySelected = prevTables.some(t => t.tableName === table.tableName);
      
      if (isAlreadySelected) {
        // Remove the table if already selected
        return prevTables.filter(t => t.tableName !== table.tableName);
      } else {
        // Add the table
        return [...prevTables, table];
      }
    });
  };

  // Handle column selection for calculation
  const handleColumnCalculationSelection = (tableName, column, isChecked) => {
    setColumnConfigurations(prevConfigs => {
      if (isChecked) {
        // Add column configuration
        return [...prevConfigs, { 
          tableName, 
          column, 
          calculationType: '' // Will be set in next step
        }];
      } else {
        // Remove column configuration
        return prevConfigs.filter(
          config => !(config.tableName === tableName && config.column === column)
        );
      }
    });
  };

  // Update calculation type for a specific column
  const updateColumnCalculationType = (tableName, column, calculationType) => {
    setColumnConfigurations(prevConfigs => 
      prevConfigs.map(config => 
        config.tableName === tableName && config.column === column
          ? { ...config, calculationType } // Now can be null
          : config
      )
    );
  };
  const handleNext = () => {
    switch(step) {
      case 1:
        if (selectedTables.length === 0) {
          alert("Please select at least one table");
          return;
        }
        break;
      case 2:
        if (columnConfigurations.length === 0) {
          alert("Please select at least one column");
          return;
        }
        break;
      case 3:
        // No validation needed for calculation method
        break;
    }
  
    // Proceed to next step if validation passes
    if (step < 6) {
      setStep(prevStep => prevStep + 1);
    }};  

  const handlePrevious = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate final step inputs
    if (!configName) {
      alert("Please enter a name for your graph");
      return;
    }
  
    if (!graphType) {
      alert("Please select a graph type");
      return;
    }
  
    const tokenData = getTokenData();
    const newConfig = {
      user_id: tokenData.userId,
      config_name: configName,
      graph_type: graphType,
      data_sources: selectedTables, // Direct array of table names
      join_conditions: [], // Empty array if no joins
      aggregations: columnConfigurations.map(config => ({
        column: config.column,
        type: config.calculationType || 'count',
        table: config.tableName
      })),
      filters: filters.map(filter => ({
        column: filter.column,
        condition: filter.condition,
        value: filter.value
      })),
      order_by: null, // You can customize this if needed
      limit: null,
      settings: {},
      group_by: groupByType !== 'none' ? groupByColumns : []
    };
  
    try {
      const response = await axios.post('http://localhost:3000/dashboard/creategraph', newConfig);
      console.log("Graph configuration saved successfully:", response.data);
      // Optionally reset the wizard or redirect the user
    } catch (error) {
      console.error("Failed to save graph configuration:", error);
    }
  }
  // Render different steps of the wizard
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContainer>
            <StepTitle>Select Data Source</StepTitle>
            <StepDescription>Choose the table(s) you want to analyze</StepDescription>
            <OptionGrid>
              {availableTables.map(table => (
                <OptionCard
                  key={table.tableName}
                  selected={selectedTables.some(t => t.tableName === table.tableName)}
                  onClick={() => handleTableSelection(table)}
                >
                  {table.title}
                </OptionCard>
              ))}
            </OptionGrid>
          </StepContainer>
        );
  
      case 2:
        return (
          <StepContainer>
            <StepTitle>Select Columns for Analysis</StepTitle>
            <StepDescription>Choose which columns you want to include in your graph</StepDescription>
            {selectedTables.flatMap(table => 
              (tableColumns[table.tableName] || []).map(column => (
                <ColumnSelect 
                  key={`${table.tableName}-${column}`}
                  selected={columnConfigurations.some(
                    config => config.tableName === table.tableName && config.column === column
                  )}
                >
                  <Checkbox
                    type="checkbox"
                    checked={columnConfigurations.some(
                      config => config.tableName === table.tableName && config.column === column
                    )}
                    onChange={(e) => handleColumnCalculationSelection(
                      table.tableName, 
                      column, 
                      e.target.checked
                    )}
                  />
                  {column}
                </ColumnSelect>
              ))
            )}
          </StepContainer>
        );
  
      case 3:
        return (
          <StepContainer>
            <StepTitle>Choose Calculation Method (Optional)</StepTitle>
            <StepDescription>
              You can select a calculation method for each column, 
              but it's not required. Skip if you want to use raw data.
            </StepDescription>
            {columnConfigurations.map(config => (
              <ColumnConfigContainer key={`${config.tableName}-${config.column}`}>
                <ConfigRow>
                  <span>{config.column}</span>
                  <Select
                    value={config.calculationType || ''}
                    onChange={(e) => updateColumnCalculationType(
                      config.tableName, 
                      config.column, 
                      e.target.value || null // Allow null/empty value
                    )}
                  >
                    <option value="">No Calculation (Use Raw Data)</option>
                    {CALCULATION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </ConfigRow>
              </ColumnConfigContainer>
            ))}
          </StepContainer>
        );
  
      case 4: // Group By Step
        return (
          <StepContainer>
            <StepTitle>Group Your Data</StepTitle>
            <StepDescription>
              Choose how you want to organize your data
            </StepDescription>
            
            {/* Grouping Type Selection */}
            <Select 
              value={groupByType}
              onChange={(e) => {
                setGroupByType(e.target.value);
                setGroupByColumns([]); // Reset columns
              }}
            >
              {GROUP_BY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
  
            {/* Description of Selected Grouping */}
            <StepDescription>
              {GROUP_BY_OPTIONS.find(o => o.value === groupByType)?.description}
            </StepDescription>
  
            {/* Column Selection Based on Grouping Type */}
            {(groupByType === 'simple' || groupByType === 'multi') && (
              <OptionGrid>
                {selectedTables.flatMap(table => 
                  (tableColumns[table.tableName] || []).map(column => (
                    <OptionCard
                      key={`${table.tableName}-${column}`}
                      selected={groupByColumns.includes(column)}
                      onClick={() => {
                        // Handle column selection based on group type
                        if (groupByType === 'simple') {
                          setGroupByColumns([column]);
                        } else {
                          setGroupByColumns(prev => 
                            prev.includes(column)
                              ? prev.filter(c => c !== column)
                              : [...prev, column]
                          );
                        }
                      }}
                    >
                      {column} (from {table.tableName})
                    </OptionCard>
                  ))
                )}
              </OptionGrid>
            )}
          </StepContainer>
        );
  
      case 5: // Filtering Step
        return (
          <StepContainer>
            <StepTitle>Filter Your Data</StepTitle>
            <StepDescription>
              Narrow down the data you want to visualize
            </StepDescription>
            
            {/* Filter Type Selection */}
            <Select 
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilters([]); // Reset filters
              }}
            >
              {FILTER_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
  
            {/* Description of Selected Filter Type */}
            <StepDescription>
              {FILTER_TYPE_OPTIONS.find(o => o.value === filterType)?.description}
            </StepDescription>
  
            {/* Filter Conditions */}
            {(filterType === 'simple' || filterType === 'advanced') && (
              <>
                {(filterType === 'advanced' || filters.length === 0) && (
                  <Button 
                    onClick={() => setFilters([...filters, { 
                      column: '', 
                      condition: '=', 
                      value: '' 
                    }])}
                  >
                    Add Filter Condition
                  </Button>
                )}
  
                {filters.map((filter, index) => (
                  <ColumnConfigContainer key={index}>
                    <ConfigRow>
                      {/* Column Selection */}
                      <Select
                        value={filter.column}
                        onChange={(e) => {
                          const updatedFilters = [...filters];
                          updatedFilters[index].column = e.target.value;
                          setFilters(updatedFilters);
                        }}
                      >
                        <option value="">Select Column</option>
                        {selectedTables.flatMap(table => 
                          (tableColumns[table.tableName] || []).map(column => (
                            <option key={column} value={column}>
                              {column} (from {table.tableName})
                            </option>
                          ))
                        )}
                      </Select>
  
                      {/* Condition Selection */}
                      <Select
                        value={filter.condition}
                        onChange={(e) => {
                          const updatedFilters = [...filters];
                          updatedFilters[index].condition = e.target.value;
                          setFilters(updatedFilters);
                        }}
                      >
                        {FILTER_CONDITIONS.map(condition => (
                          <option 
                            key={condition.value} 
                            value={condition.value}
                          >
                            {condition.label}
                          </option>
                        ))}
                      </Select>
  
                      {/* Value Input */}
                      <Input
                        type="text"
                        placeholder="Filter Value"
                        value={filter.value}
                        onChange={(e) => {
                          const updatedFilters = [...filters];
                          updatedFilters [index].value = e.target.value;
                          setFilters(updatedFilters);
                        }}
                      />
  
                      {/* Remove Filter Button */}
                      {filterType === 'advanced' && (
                        <Button 
                          onClick={() => {
                            const updatedFilters = filters.filter((_, i) => i !== index);
                            setFilters(updatedFilters);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </ConfigRow>
                  </ColumnConfigContainer>
                ))}
              </>
            )}
          </StepContainer>
        );
  
      case 6: // Final Steps
        return (
          <StepContainer>
            <StepTitle>Final Steps</StepTitle>
            <StepDescription>Give your graph a name and select the type</StepDescription>
            <Input 
              type="text" 
              placeholder="Graph Name" 
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
            />
            <Select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
              <option value="">Select Graph Type</option>
              {GRAPH_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>
          </StepContainer>
        );
  
      default:
        return null;
    }
  };
  
  return (
    <WizardContainer>
      {renderStep()}
      <NavigationButtons>
        <Button onClick={handlePrevious} disabled={step === 1}>Previous</Button>
        {step < 6 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </NavigationButtons>
    </WizardContainer>
  );
  };
export default UserFriendlyGraphWizard;