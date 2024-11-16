"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var moment = require('moment');

var dayjs = require('dayjs');

var timezone = require('dayjs/plugin/timezone');

var utc = require('dayjs/plugin/utc');

var _require = require('http'),
    request = _require.request;

var _require2 = require('console'),
    Console = _require2.Console;

dayjs.extend(utc);
dayjs.extend(timezone);

function buildQueryFromConfig(graph) {
  var query = 'SELECT '; // 1. Aggregations (if specified)

  var aggregationExpressions = '';

  if (graph.aggregations) {
    var aggregations = JSON.parse(graph.aggregations);
    aggregationExpressions = aggregations.map(function (agg) {
      switch (agg.type) {
        case 'sum':
          return "SUM(".concat(agg.column, ") AS ").concat(agg.column, "_sum");

        case 'count':
          return "COUNT(".concat(agg.column, ") AS ").concat(agg.column, "_count");

        case 'avg':
          return "AVG(".concat(agg.column, ") AS ").concat(agg.column, "_avg");

        default:
          return '';
      }
    }).filter(Boolean).join(', ');
  } // If no valid aggregations, default to *


  aggregationExpressions = aggregationExpressions || '*'; // 2. Group By (if specified)

  var groupByColumns = '';

  if (graph.group_by) {
    groupByColumns = JSON.parse(graph.group_by).filter(Boolean).join(', ');
  } // 3. Construct the SELECT clause


  if (groupByColumns) {
    // If there are group by columns, include them before the aggregation
    query += "".concat(groupByColumns, ", ");
  } // Add aggregation expressions to SELECT (if any)


  query += aggregationExpressions; // 4. Data Sources (Tables)

  var tables = JSON.parse(graph.data_sources);
  query += " FROM ".concat(tables.join(', ')); // 5. Join Conditions (if specified)

  if (graph.join_conditions) {
    var joins = JSON.parse(graph.join_conditions);
    joins.forEach(function (join) {
      if (join.type && join.table2 && join.table1 && join.column1 && join.column2) {
        query += " ".concat(join.type, " JOIN ").concat(join.table2, " ON ").concat(join.table1, ".").concat(join.column1, " = ").concat(join.table2, ".").concat(join.column2);
      }
    });
  } // 6. Filters (if specified)


  if (graph.filters) {
    var filters = JSON.parse(graph.filters);
    var filterConditions = filters.filter(function (filter) {
      return filter.column && filter.operator && filter.value !== undefined && filter.value !== '';
    }).map(function (filter) {
      return "".concat(filter.column, " ").concat(filter.operator, " '").concat(filter.value, "'");
    }).join(' AND ');
    if (filterConditions) query += " WHERE ".concat(filterConditions);
  } // 7. Group By (if specified)


  if (groupByColumns) {
    query += " GROUP BY ".concat(groupByColumns);
  } // 8. Order By (if specified and valid)


  if (graph.order_by) {
    var orderBy = JSON.parse(graph.order_by);

    if (orderBy.field && orderBy.direction) {
      query += " ORDER BY ".concat(orderBy.field, " ").concat(orderBy.direction);
    }
  } // 9. Limit (if specified)


  if (graph.limit && Number.isInteger(graph.limit)) {
    query += " LIMIT ".concat(graph.limit);
  }

  console.log(query);
  return query;
}

var getFriendlyErrorMessage = function getFriendlyErrorMessage(errCode) {
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

var query = util.promisify(db.query).bind(db);
router.get('/createdashboardquery', function _callee(req, res) {
  var userId, dashboardConfigs, dashboardData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, config, graph_type, data_sources, aggregation, filters, order_by, limit, baseTable, joins, aggregationType, aggregationColumn, groupBy, sqlQuery, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, join, joinType, joinTable, joinCondition, parsedFilters, whereConditions, orderBy, result, friendlyMessage;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.query.user_id;

          if (userId) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'User ID is required'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM user_dashboards WHERE user_id = ?', [userId]));

        case 6:
          dashboardConfigs = _context.sent;

          if (!(!dashboardConfigs || dashboardConfigs.length === 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: 'No dashboard configurations found for this user'
          }));

        case 9:
          dashboardData = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 13;
          _iterator = dashboardConfigs[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 57;
            break;
          }

          config = _step.value;
          graph_type = config.graph_type, data_sources = config.data_sources, aggregation = config.aggregation, filters = config.filters, order_by = config.order_by, limit = config.limit;
          baseTable = JSON.parse(data_sources).tables[0];
          joins = JSON.parse(data_sources).joins || [];
          aggregationType = JSON.parse(aggregation).type;
          aggregationColumn = JSON.parse(aggregation).columns[0];
          groupBy = JSON.parse(aggregation).group_by || [];
          sqlQuery = "SELECT ".concat(aggregationType, "(").concat(aggregationColumn, ") AS ").concat(aggregationType, "_").concat(aggregationColumn);

          if (groupBy.length > 0) {
            sqlQuery += ", ".concat(groupBy.join(', '));
          }

          sqlQuery += " FROM ".concat(baseTable);
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 29;

          for (_iterator2 = joins[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            join = _step2.value;
            joinType = join.type || 'INNER JOIN';
            joinTable = join.table;
            joinCondition = Object.entries(join.on).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  value = _ref2[1];

              return "".concat(key, " = ").concat(value);
            }).join(' AND ');
            sqlQuery += " ".concat(joinType, " ").concat(joinTable, " ON ").concat(joinCondition);
          }

          _context.next = 37;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](29);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 37:
          _context.prev = 37;
          _context.prev = 38;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 40:
          _context.prev = 40;

          if (!_didIteratorError2) {
            _context.next = 43;
            break;
          }

          throw _iteratorError2;

        case 43:
          return _context.finish(40);

        case 44:
          return _context.finish(37);

        case 45:
          parsedFilters = JSON.parse(filters || '[]');

          if (parsedFilters.length > 0) {
            whereConditions = parsedFilters.map(function (filter) {
              return "".concat(filter.field, " ").concat(filter.operator, " ").concat(db.escape(filter.value));
            }).join(' AND ');
            sqlQuery += " WHERE ".concat(whereConditions);
          }

          if (groupBy.length > 0) {
            sqlQuery += " GROUP BY ".concat(groupBy.join(', '));
          }

          if (order_by) {
            orderBy = JSON.parse(order_by);
            sqlQuery += " ORDER BY ".concat(orderBy.field, " ").concat(orderBy.direction);
          }

          if (limit) {
            sqlQuery += " LIMIT ".concat(limit);
          }

          _context.next = 52;
          return regeneratorRuntime.awrap(query(sqlQuery));

        case 52:
          result = _context.sent;
          dashboardData.push({
            config_name: config.config_name,
            graph_type: graph_type,
            data: result,
            settings: JSON.parse(config.settings || '{}')
          });

        case 54:
          _iteratorNormalCompletion = true;
          _context.next = 15;
          break;

        case 57:
          _context.next = 63;
          break;

        case 59:
          _context.prev = 59;
          _context.t1 = _context["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 63:
          _context.prev = 63;
          _context.prev = 64;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 66:
          _context.prev = 66;

          if (!_didIteratorError) {
            _context.next = 69;
            break;
          }

          throw _iteratorError;

        case 69:
          return _context.finish(66);

        case 70:
          return _context.finish(63);

        case 71:
          res.json(dashboardData);
          _context.next = 79;
          break;

        case 74:
          _context.prev = 74;
          _context.t2 = _context["catch"](3);
          console.error('Error fetching or processing dashboard data:', _context.t2);
          friendlyMessage = getFriendlyErrorMessage(_context.t2.code);
          res.status(500).json({
            error: friendlyMessage || 'Internal Server Error'
          });

        case 79:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 74], [13, 59, 63, 71], [29, 33, 37, 45], [38,, 40, 44], [64,, 66, 70]]);
});
router.post('/creategraph', function _callee2(req, res) {
  var _req$body, user_id, config_name, graph_type, data_sources, join_conditions, aggregations, filters, order_by, limit, settings, group_by, insertQuery, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, user_id = _req$body.user_id, config_name = _req$body.config_name, graph_type = _req$body.graph_type, data_sources = _req$body.data_sources, join_conditions = _req$body.join_conditions, aggregations = _req$body.aggregations, filters = _req$body.filters, order_by = _req$body.order_by, limit = _req$body.limit, settings = _req$body.settings, group_by = _req$body.group_by;
          console.log(req.body);
          insertQuery = "\n            INSERT INTO user_graphs (\n                user_id, config_name, graph_type, data_sources, join_conditions, \n                aggregations, filters, order_by, `limit`, settings, group_by\n            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ";
          _context2.next = 6;
          return regeneratorRuntime.awrap(query(insertQuery, [user_id, config_name, graph_type, JSON.stringify(data_sources), JSON.stringify(join_conditions), JSON.stringify(aggregations), JSON.stringify(filters), JSON.stringify(order_by), limit, JSON.stringify(settings), JSON.stringify(group_by)]));

        case 6:
          result = _context2.sent;
          res.status(201).json({
            success: true,
            graphId: result.insertId
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error("Error inserting graph configuration:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Failed to create graph configuration",
            error: _context2.t0
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
var COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884", "#c658ff", "#42aaff", "#ff6b6b", "#d6a4e1", "#83d3a2", "#82a3d8", "#c9aaf9"];
router.get('/getgraphs/:userId', function _callee4(req, res) {
  var userId, graphs, graphData;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userId = req.params.userId;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(query('SELECT * FROM user_graphs WHERE user_id = ?', [userId]));

        case 4:
          graphs = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Promise.all(graphs.map(function _callee3(graph) {
            var sqlQuery, result, colorSettings, transformedData;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    sqlQuery = buildQueryFromConfig(graph);
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(query(sqlQuery));

                  case 3:
                    result = _context3.sent;
                    // Generate color settings for the graph (optional, based on your current logic)
                    colorSettings = {};
                    result[0] && Object.keys(result[0]).forEach(function (key, index) {
                      if (key !== 'name') colorSettings[key] = COLORS[index % COLORS.length];
                    }); // Transform the data into { name, value } format

                    transformedData = result.map(function (item) {
                      var keys = Object.keys(item); // Assuming the first key is the group-by column (e.g., department)

                      var name = item[keys[0]]; // The first column in the result, like 'department'
                      // The second key will be the aggregate value (e.g., id_count)

                      var value = item[keys[1]]; // The second column in the result, like 'id_count'

                      return {
                        name: name,
                        value: value
                      };
                    });
                    return _context3.abrupt("return", {
                      config_name: graph.config_name,
                      graph_type: graph.graph_type,
                      data: transformedData,
                      // Pass the transformed data
                      colorSettings: colorSettings
                    });

                  case 8:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 7:
          graphData = _context4.sent;
          res.json({
            success: true,
            graphs: graphData
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);
          console.error("Error fetching user graphs:", _context4.t0);
          res.status(500).json({
            success: false,
            error: "Error fetching graphs"
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
module.exports = router;