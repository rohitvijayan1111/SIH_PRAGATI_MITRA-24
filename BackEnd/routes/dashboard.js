const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const axios = require('axios');
const { request } = require('http');
const { Console } = require('console');

dayjs.extend(utc);
dayjs.extend(timezone);
const gemini_api_key = "AIzaSyBHbQhbhN55b1RR00vbUfgeoVoAZgAuj6s";
const { GoogleGenerativeAI } = require("@google/generative-ai");
function buildQueryFromConfig(graph) {
    let query = 'SELECT ';
    
    // 1. Aggregations (if specified)
    let aggregationExpressions = '';
    if (graph.aggregations) {
        const aggregations = JSON.parse(graph.aggregations);
        aggregationExpressions = aggregations.map(agg => {
            switch (agg.type) {
                case 'sum': return `SUM(${agg.column}) AS ${agg.column}_sum`;
                case 'count': return `COUNT(${agg.column}) AS ${agg.column}_count`;
                case 'avg': return `AVG(${agg.column}) AS ${agg.column}_avg`;
                default: return '';
            }
        }).filter(Boolean).join(', ');
    }
    
    // If no valid aggregations, default to *
    aggregationExpressions = aggregationExpressions || '*';
    
    // 2. Group By (if specified)
    let groupByColumns = '';
    if (graph.group_by) {
        groupByColumns = JSON.parse(graph.group_by).filter(Boolean).join(', ');
    }
    
    // 3. Construct the SELECT clause
    if (groupByColumns) {
        // If there are group by columns, include them before the aggregation
        query += `${groupByColumns}, `;
    }
    
    // Add aggregation expressions to SELECT (if any)
    query += aggregationExpressions;
    
    // 4. Data Sources (Tables)
    const tables = JSON.parse(graph.data_sources);
    query += ` FROM ${tables.join(', ')}`;
    
    // 5. Join Conditions (if specified)
    if (graph.join_conditions) {
        const joins = JSON.parse(graph.join_conditions);
        joins.forEach(join => {
            if (join.type && join.table2 && join.table1 && join.column1 && join.column2) {
                query += ` ${join.type} JOIN ${join.table2} ON ${join.table1}.${join.column1} = ${join.table2}.${join.column2}`;
            }
        });
    }
    
    // 6. Filters (if specified)
    if (graph.filters) {
        const filters = JSON.parse(graph.filters);
        const filterConditions = filters
            .filter(filter => filter.column && filter.operator && filter.value !== undefined && filter.value !== '')
            .map(filter => `${filter.column} ${filter.operator} '${filter.value}'`)
            .join(' AND ');
        
        if (filterConditions) query += ` WHERE ${filterConditions}`;
    }
    
    // 7. Group By (if specified)
    if (groupByColumns) {
        query += ` GROUP BY ${groupByColumns}`;
    }
    
    // 8. Order By (if specified and valid)
    if (graph.order_by) {
        const orderBy = JSON.parse(graph.order_by);
        if (orderBy.field && orderBy.direction) {
            query += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;
        }
    }
    
    // 9. Limit (if specified)
    if (graph.limit && Number.isInteger(graph.limit)) {
        query += ` LIMIT ${graph.limit}`;
    }

    console.log(query);
    return query;
}


    
const getFriendlyErrorMessage = (errCode) => {
    switch (errCode) {
        case 'ER_NO_SUCH_TABLE':
            return "Table does not exist.";
        case 'ER_DUP_ENTRY':
            return "Duplicate entry for a key.";
        case 'ER_BAD_FIELD_ERROR':
            return "Unknown column.";
        case 'ER_PARSE_ERROR':
            return "Error in SQL syntax.";
        case 'ER_NO_REFERENCED_ROW_2':
            return "Referenced entry does not exist.";
        case 'ER_ROW_IS_REFERENCED_2':
            return "Cannot delete or update a parent row: a foreign key constraint fails.";
        case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
            return "Incorrect value for a field.";
        case 'ER_DATA_TOO_LONG':
            return "Data too long for column.";
        case 'ER_ACCESS_DENIED_ERROR':
            return "Access denied for user.";
        case 'ER_NOT_SUPPORTED_YET':
            return "Feature not supported yet.";
        case 'ER_WRONG_VALUE_COUNT_ON_ROW':
            return "Incorrect number of values.";
        default:
            return "An unknown error occurred.";
    }
};

const query = util.promisify(db.query).bind(db);

router.get('/createdashboardquery', async (req, res) => {
    const userId = req.query.user_id;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const dashboardConfigs = await query(
            'SELECT * FROM user_dashboards WHERE user_id = ?',
            [userId]
        );

        if (!dashboardConfigs || dashboardConfigs.length === 0) {
            return res.status(404).json({ error: 'No dashboard configurations found for this user' });
        }

        const dashboardData = [];

        for (const config of dashboardConfigs) {
            const { graph_type, data_sources, aggregation, filters, order_by, limit } = config;
            const baseTable = JSON.parse(data_sources).tables[0];
            const joins = JSON.parse(data_sources).joins || [];
            const aggregationType = JSON.parse(aggregation).type;
            const aggregationColumn = JSON.parse(aggregation).columns[0];
            const groupBy = JSON.parse(aggregation).group_by || [];

            let sqlQuery = `SELECT ${aggregationType}(${aggregationColumn}) AS ${aggregationType}_${aggregationColumn}`;

            if (groupBy.length > 0) {
                sqlQuery += `, ${groupBy.join(', ')}`;
            }

            sqlQuery += ` FROM ${baseTable}`;

            for (const join of joins) {
                const joinType = join.type || 'INNER JOIN';
                const joinTable = join.table;
                const joinCondition = Object.entries(join.on)
                    .map(([key, value]) => `${key} = ${value}`)
                    .join(' AND ');
                sqlQuery += ` ${joinType} ${joinTable} ON ${joinCondition}`;
            }

            const parsedFilters = JSON.parse(filters || '[]');
            if (parsedFilters.length > 0) {
                const whereConditions = parsedFilters
                    .map(filter => `${filter.field} ${filter.operator} ${db.escape(filter.value)}`)
                    .join(' AND ');
                sqlQuery += ` WHERE ${whereConditions}`;
            }

            if (groupBy.length > 0) {
                sqlQuery += ` GROUP BY ${groupBy.join(', ')}`;
            }

            if (order_by) {
                const orderBy = JSON.parse(order_by);
                sqlQuery += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;
            }

            if (limit) {
                sqlQuery += ` LIMIT ${limit}`;
            }

            const result = await query(sqlQuery);

            dashboardData.push({
                config_name: config.config_name,
                graph_type: graph_type,
                data: result,
                settings: JSON.parse(config.settings || '{}')
            });
        }

        res.json(dashboardData);

    } catch (error) {
        console.error('Error fetching or processing dashboard data:', error);
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        res.status(500).json({ error: friendlyMessage || 'Internal Server Error' });
    }
});

router.post('/creategraph', async (req, res) => {
    try {
        const {
            user_id,
            config_name,
            graph_type,
            data_sources,
            join_conditions,
            aggregations,
            filters,
            order_by,
            limit,
            settings,
            group_by
        } = req.body;
        console.log(req.body);
        console.log("Trying to save and crate graph");
        const insertQuery = `
            INSERT INTO user_graphs (
                user_id, config_name, graph_type, data_sources, join_conditions, 
                aggregations, filters, order_by, \`limit\`, settings, group_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await query(insertQuery, [
            user_id,
            config_name,
            graph_type,
            JSON.stringify(data_sources),
            JSON.stringify(join_conditions),
            JSON.stringify(aggregations),
            JSON.stringify(filters),
            JSON.stringify(order_by),
            limit,
            JSON.stringify(settings),
            JSON.stringify(group_by)
        ]);

        res.status(201).json({ success: true, graphId: result.insertId });
    } catch (error) {
        console.error("Error inserting graph configuration:", error);
        res.status(500).json({ success: false, message: "Failed to create graph configuration", error });
    }
});

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884", "#c658ff", "#42aaff", "#ff6b6b", "#d6a4e1", "#83d3a2", "#82a3d8", "#c9aaf9"];

router.get('/getgraphs/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch user graphs from the `user_graphs` table
      const graphs = await query('SELECT * FROM user_graphs WHERE user_id = ?', [userId]);
  
      const graphData = await Promise.all(graphs.map(async (graph) => {
        const sqlQuery = buildQueryFromConfig(graph);
        const result = await query(sqlQuery);
  
        // Generate color settings for the graph (optional, based on your current logic)
        const colorSettings = {};
        result[0] && Object.keys(result[0]).forEach((key, index) => {
          if (key !== 'name') colorSettings[key] = COLORS[index % COLORS.length];
        });
  
        // Transform the data into { name, value } format
        const transformedData = result.map(item => {
          const keys = Object.keys(item);
          
          // Assuming the first key is the group-by column (e.g., department)
          const name = item[keys[0]];  // The first column in the result, like 'department'
          
          // The second key will be the aggregate value (e.g., id_count)
          const value = item[keys[1]]; // The second column in the result, like 'id_count'
  
          return {
            name: name,
            value: value
          };
        });
  
        return {
          config_name: graph.config_name,
          graph_type: graph.graph_type,
          data: transformedData,  // Pass the transformed data
          colorSettings: colorSettings,
        };
      }));
  
      res.json({ success: true, graphs: graphData });
    } catch (error) {
      console.error("Error fetching user graphs:", error);
      res.status(500).json({ success: false, error: "Error fetching graphs" });
    }
  });
  

  
  router.post('/generate-graph-config', async (req, res) => {
    const { userPrompt, tableStructures, selectedTables,userId}= req.body;
    
    try {
        // Fallback configuration generation methods
        const fallbackConfigGeneration = [
            geminiAIGeneration,
            openAIFallback,
            manualConfigGeneration
        ];

        for (const configGenerator of fallbackConfigGeneration) {
            try {
                const config = await configGenerator(userPrompt, tableStructures, selectedTables);
                return res.status(200).json({
                    success: true,
                    config: config
                });
            } catch (error) {
                console.warn(`Config generation method failed:`, error.message);
                continue;
            }
        }

        // If all methods fail
        throw new Error('Unable to generate configuration through any method');

    } catch (error) {
        console.error('Comprehensive Graph Config Generation Failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate graph configuration',
            error: error.message 
        });
    }
});

// Gemini AI Configuration Generation
async function geminiAIGeneration(userPrompt, tableStructures, selectedTables) {
    try {
        // Ensure API key is correctly configured
        const genAI = new GoogleGenerativeAI(gemini_api_key);
        console.log("receivid request");
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 4096,
            }
        });

        const detailedPrompt = `
        You are an expert data analyst and graph configuration generator. 
        Strictly generate a JSON configuration based on the following details:

        User Prompt: ${userPrompt}
        Selected Tables: ${selectedTables.join(', ')}
        Table Structures: ${JSON.stringify(tableStructures)}

        Generate a precise, actionable graph configuration in VALID JSON format:
        {
            "config_name": "Descriptive Name",
            "graph_type": "bar/line/pie",
            "data_sources": ${JSON.stringify(selectedTables)},
            "join_conditions": [],
            "aggregations": [{
                "type": "sum/count/avg",
                "column": "most_relevant_column"
            }],
            "filters": [],
            "group_by": [],
            "order_by": {
                "field": "",
                "direction": "ASC/DESC"
            },
            "limit": 10,
            "settings": {
                "color": "",
                "label": ""
            }
        }
        
        Respond ONLY with valid JSON. No additional text.
        `;
        console.log(detailedPrompt);
        const result = await model.generateContent(detailedPrompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        // Aggressive JSON extraction
        const cleanText = text.replace(/```(json)?/g, '').trim();
        const configJson = JSON.parse(cleanText);

        return {
            config_name: configJson.config_name || 'AI Generated Graph',
            graph_type: configJson.graph_type || 'bar',
            data_sources: configJson.data_sources || selectedTables,
            join_conditions: configJson.join_conditions || [],
            aggregations: configJson.aggregations || [],
            filters: configJson.filters || [],
            group_by: configJson.group_by || [],
            order_by: configJson.order_by || { field: '', direction: 'ASC' },
            limit: configJson.limit || 10,
            settings: configJson.settings || {}
        };

    } catch (error) {
        console.error('Gemini AI Generation Failed:', error);
        throw error;
    }
}

// OpenAI Fallback (Optional)
async function openAIFallback(userPrompt, tableStructures, selectedTables) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `Generate a graph configuration JSON based on user requirements.`
            }, {
                role: "user",
                content: `Prompt: ${userPrompt}. Tables: ${selectedTables.join(', ')}`
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const configJson = JSON.parse(response.data.choices[0].message.content);
        
        // Similar validation as Gemini method
        return {
            config_name: configJson.config_name || 'Generated Graph',
            graph_type: configJson.graph_type || 'bar',
            // ... other validations
        };

    } catch (error) {
        console.error('OpenAI Fallback Failed:', error);
        throw error;
    }
}

// Manual Configuration Generation (Guaranteed Fallback)
function manualConfigGeneration(userPrompt, tableStructures, selectedTables) {
    // Intelligent default configuration generation
    return {
        config_name: 'Default Graph Configuration',
        graph_type: 'bar',
        data_sources: selectedTables,
        join_conditions: [],
        aggregations: tableStructures.flatMap(table => 
            table.columns
                .filter(col => ['total', 'amount', 'count', 'number'].some(keyword => 
                    col.toLowerCase().includes(keyword)
                ))
                .map(col => ({
                    type: 'sum',
                    column: col
                }))
        ),
        filters: [],
        group_by: tableStructures.flatMap(table => 
            table.columns
                .filter(col => ['category', 'type', 'name', 'status'].some(keyword => 
                    col.toLowerCase().includes(keyword)
                ))
        ),
        order_by: { field: '', direction: 'ASC' },
        limit: 10,
        settings: {
            color: 'default',
            label: 'Auto-generated Graph'
        }
    };
}
module.exports = router;
