"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var moment = require('moment');

var path = require('path');

var multer = require('multer');

var fs = require('fs');

var query = util.promisify(db.query).bind(db);

var fsPromises = require('fs').promises; // For async operations


var axios = require('axios');

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

router.get('/gettablelist', function _callee(req, res) {
  var sql;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Received request:", req.query);
          sql = 'SELECT form_table_name, form_title FROM form_locks;';
          _context.prev = 2;
          db.query(sql, function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('No forms found');
            } // Map results to an array of objects containing both the title and table name


            var tables = results.map(function (row) {
              return {
                tableName: row.form_table_name,
                title: row.form_title
              };
            });
            console.log('Database results:', tables);
            res.status(200).json({
              tables: tables
            });
          });
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](2);
          console.error('Catch error:', _context.t0.message);
          return _context.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context.t0.code)));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 6]]);
});
router.post('/columns', function _callee2(req, res) {
  var tables, columnsData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, table, _ref, _ref2, row;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tables = req.body.tables; // Get table names from the request body

          console.log("Received tables:", tables);

          if (!(!Array.isArray(tables) || tables.length === 0)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Tables array is required and should not be empty'
          }));

        case 4:
          _context2.prev = 4;
          columnsData = {}; // Loop through each table and fetch its column names by selecting one record

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 9;
          _iterator = tables[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 22;
            break;
          }

          table = _step.value;
          _context2.next = 15;
          return regeneratorRuntime.awrap(query("SELECT * FROM ?? LIMIT 1", [table]));

        case 15:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 1);
          row = _ref2[0];

          if (row) {
            columnsData[table] = Object.keys(row); // Get column names from the keys of the row object
          } else {
            console.error("No records found for table ".concat(table));
            columnsData[table] = []; // Return an empty array if no records are found
          }

        case 19:
          _iteratorNormalCompletion = true;
          _context2.next = 11;
          break;

        case 22:
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 28:
          _context2.prev = 28;
          _context2.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context2.prev = 31;

          if (!_didIteratorError) {
            _context2.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context2.finish(31);

        case 35:
          return _context2.finish(28);

        case 36:
          res.json({
            columns: columnsData
          });
          _context2.next = 43;
          break;

        case 39:
          _context2.prev = 39;
          _context2.t1 = _context2["catch"](4);
          console.error('Error fetching columns:', _context2.t1);
          res.status(500).json({
            error: 'Error fetching columns from database'
          });

        case 43:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 39], [9, 24, 28, 36], [29,, 31, 35]]);
});
router.post('/getFormId', function _callee3(req, res) {
  var tableName, queryStr, results, _results$, form_id, form_title;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          tableName = req.body.tableName;

          if (tableName) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Table name is required'
          }));

        case 3:
          queryStr = "SELECT id as form_id,form_title FROM form_locks WHERE form_table_name = ? LIMIT 1";
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(query(queryStr, [tableName]));

        case 7:
          results = _context3.sent;

          if (!(results.length > 0)) {
            _context3.next = 13;
            break;
          }

          // Return both form_id and form_title
          _results$ = results[0], form_id = _results$.form_id, form_title = _results$.form_title;
          return _context3.abrupt("return", res.json({
            form_id: form_id,
            form_title: form_title
          }));

        case 13:
          return _context3.abrupt("return", res.status(404).json({
            error: 'Form ID not found for the specified table'
          }));

        case 14:
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](4);
          console.error('Error fetching form ID:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context3.t0.code)
          }));

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 16]]);
});
router.post('/gettable', function _callee4(req, res) {
  var table, department, recordSql, columnSql, recordValues, columnValues, columnResults, columnDataTypes, recordResults;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          //console.log("Received request:", req.body);
          table = req.body.table;
          department = req.body.department;

          if (!(!table || !department)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("Please provide both table and department parameters."));

        case 4:
          recordSql = 'SELECT * FROM ?? ';
          columnSql = 'SHOW COLUMNS FROM ??';
          recordValues = [table];
          columnValues = [table];

          if (department !== "All") {
            recordSql += 'WHERE department = ? ';
            recordValues.push(department);
          }

          recordSql += 'ORDER BY department';
          _context4.prev = 10;
          _context4.next = 13;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 13:
          columnResults = _context4.sent;
          columnDataTypes = columnResults.reduce(function (acc, col) {
            acc[col.Field] = col.Type;
            return acc;
          }, {}); // Fetch table records

          _context4.next = 17;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 17:
          recordResults = _context4.sent;

          if (!(recordResults.length === 0)) {
            _context4.next = 20;
            break;
          }

          return _context4.abrupt("return", res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: []
          }));

        case 20:
          res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: recordResults
          });
          _context4.next = 27;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](10);
          console.error('Error fetching data:', _context4.t0.message);
          return _context4.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context4.t0.code)
          }));

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[10, 23]]);
});
router.post('/create-table', function _callee5(req, res) {
  var _req$body, formName, attributes, usergroup, tableName, columns, createTableQuery, insertLockQuery;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, formName = _req$body.formName, attributes = _req$body.attributes, usergroup = _req$body.usergroup;

          if (!(!formName || !attributes || !Array.isArray(attributes))) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).send('Invalid request data'));

        case 3:
          // Construct table name and columns
          tableName = formName.replace(/\s+/g, '_').toLowerCase(); // Add default columns: id, createdAt

          columns = "\n    id INT AUTO_INCREMENT PRIMARY KEY, \n    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  "; // Add custom attributes

          attributes.forEach(function (attr) {
            var type = attr.type === 'text' ? 'VARCHAR(255)' : attr.type === 'number' ? 'INT' : attr.type === 'date' ? 'DATE' : attr.type === 'boolean' ? 'BOOLEAN' : attr.type === 'file' ? 'VARCHAR(255)' : attr.type === 'link' ? 'VARCHAR(255)' : 'TEXT';
            columns += "".concat(attr.name.replace(/\s+/g, '_').toLowerCase(), " ").concat(type, ", ");
          }); // Remove trailing comma and space

          columns = columns.slice(0, -2);
          createTableQuery = "CREATE TABLE ".concat(tableName, " (").concat(columns, ")");
          _context5.prev = 8;
          _context5.next = 11;
          return regeneratorRuntime.awrap(query(createTableQuery));

        case 11:
          // Insert a record into the form_locks table
          insertLockQuery = "INSERT INTO form_locks (form_table_name, form_title, is_locked, assigned_to_usergroup) VALUES (?, ?, ?, ?)";
          _context5.next = 14;
          return regeneratorRuntime.awrap(query(insertLockQuery, [tableName, formName, 0, usergroup]));

        case 14:
          res.send("Table ".concat(tableName, " created successfully"));
          _context5.next = 21;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](8);
          console.error('Error:', _context5.t0.message);
          res.status(500).send('Error creating table and inserting record');

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[8, 17]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var table, dir;
    return regeneratorRuntime.async(function destination$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            table = req.body.table;
            dir = "./uploads/".concat(table);
            _context6.next = 4;
            return regeneratorRuntime.awrap(fsPromises.mkdir(dir, {
              recursive: true
            }));

          case 4:
            cb(null, dir);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  filename: function filename(req, file, cb) {
    var fileName = "".concat(moment().format('YYYYMMDD_HHmmss'), "_").concat(file.originalname);
    cb(null, fileName);
  }
});
var upload = multer({
  storage: storage
});
router.post('/insertrecord', upload.single('file'), function _callee6(req, res) {
  var _req$body2, table, data, filePath, friendlyMessage;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, table = _req$body2.table, data = _objectWithoutProperties(_req$body2, ["table"]);

          if (!(!table || !data)) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context7.prev = 3;
          filePath = null;

          if (req.file) {
            filePath = req.file.path;
            data.document = filePath;
          }

          _context7.next = 8;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 8:
          res.json({
            message: 'Record inserted successfully'
          });
          _context7.next = 16;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](3);
          console.error('Error inserting record:', _context7.t0);
          friendlyMessage = getFriendlyErrorMessage(_context7.t0.code);
          res.status(500).json({
            error: "".concat(friendlyMessage)
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router.post('/updaterecord', upload.single('file'), function _callee7(req, res) {
  var _req$body3, id, table, rawData, deleteFile, data, existingRows, oldFilePath, newFilePath, currentTimestamp, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log(req.body);
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table, rawData = _req$body3.data, deleteFile = _req$body3.deleteFile;
          data = JSON.parse(rawData);

          if (!(!id || !table)) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'Id and table are required'
          }));

        case 5:
          _context8.prev = 5;
          _context8.next = 8;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 8:
          existingRows = _context8.sent;

          if (!(existingRows.length === 0)) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 11:
          // Handling file upload and deletion
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath;

          if (!req.file) {
            _context8.next = 26;
            break;
          }

          newFilePath = req.file.path;

          if (!(oldFilePath && oldFilePath !== newFilePath)) {
            _context8.next = 24;
            break;
          }

          _context8.prev = 16;
          _context8.next = 19;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 19:
          _context8.next = 24;
          break;

        case 21:
          _context8.prev = 21;
          _context8.t0 = _context8["catch"](16);
          console.error('Error deleting old file:', _context8.t0);

        case 24:
          _context8.next = 36;
          break;

        case 26:
          if (!(deleteFile === 'true' && oldFilePath)) {
            _context8.next = 36;
            break;
          }

          _context8.prev = 27;
          _context8.next = 30;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 30:
          newFilePath = ''; // Clear the document path in the database

          _context8.next = 36;
          break;

        case 33:
          _context8.prev = 33;
          _context8.t1 = _context8["catch"](27);
          console.error('Error deleting old file:', _context8.t1);

        case 36:
          if (newFilePath) {
            data.document = newFilePath;
          } // Add current timestamp for createdAt/updatedAt


          currentTimestamp = new Date();
          data.createdAt = currentTimestamp; // Construct the SET clause dynamically with proper escaping

          setClause = Object.keys(data).map(function (key) {
            return "`".concat(key, "` = ?");
          }).join(', ');
          values = Object.values(data);
          updateQuery = "UPDATE `".concat(table, "` SET ").concat(setClause, ", createdAt = NOW() WHERE id = ?"); // NOW() adds the current timestamp

          console.log('SQL Query:', updateQuery);
          console.log('Values:', [].concat(_toConsumableArray(values), [id]));
          _context8.next = 46;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 46:
          res.json({
            message: 'Record updated successfully'
          });
          _context8.next = 53;
          break;

        case 49:
          _context8.prev = 49;
          _context8.t2 = _context8["catch"](5);
          console.error('Error updating record:', _context8.t2);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context8.t2.code)
          });

        case 53:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[5, 49], [16, 21], [27, 33]]);
});
router["delete"]('/deleterecord', function _callee8(req, res) {
  var _req$body4, id, table, record, filePath;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, table = _req$body4.table;

          if (!(!table || !id)) {
            _context9.next = 3;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context9.prev = 3;
          _context9.next = 6;
          return regeneratorRuntime.awrap(query('SELECT document FROM ?? WHERE id = ?', [table, id]));

        case 6:
          record = _context9.sent;

          if (!(record.length === 0)) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          filePath = record[0].document;
          console.log(filePath);

          if (!filePath) {
            _context9.next = 21;
            break;
          }

          _context9.prev = 12;
          _context9.next = 15;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(filePath)));

        case 15:
          console.log("File at ".concat(filePath, " deleted successfully"));
          _context9.next = 21;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](12);
          console.error('Error deleting file:', _context9.t0);

        case 21:
          _context9.next = 23;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 23:
          res.json({
            message: 'Item and associated file (if any) deleted successfully'
          });
          _context9.next = 30;
          break;

        case 26:
          _context9.prev = 26;
          _context9.t1 = _context9["catch"](3);
          console.error('Error deleting item:', _context9.t1.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context9.t1.code)
          });

        case 30:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[3, 26], [12, 18]]);
});
router.post('/locktable', function _callee9(req, res) {
  var _req$body5, id, lock;

  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, lock = _req$body5.lock;

          if (!(!id || lock === undefined)) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context10.prev = 3;
          _context10.next = 6;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](3);
          console.error('Error updating lock status:', _context10.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/deadline', function _callee10(req, res) {
  var _req$body6, id, deadline, _ref3, _ref4, formLock, assignedUsers, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, user, email, emailPayload;

  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$body6 = req.body, id = _req$body6.id, deadline = _req$body6.deadline; // Validate request body

          if (!(!id || !deadline)) {
            _context11.next = 3;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            error: 'ID and deadline are required'
          }));

        case 3:
          _context11.prev = 3;
          _context11.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM form_locks WHERE id = ?', [id]));

        case 6:
          _ref3 = _context11.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          formLock = _ref4[0];

          if (formLock) {
            _context11.next = 11;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            error: 'Form lock not found'
          }));

        case 11:
          _context11.next = 13;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET deadline = ? WHERE id = ?', [deadline, id]));

        case 13:
          // Fetch the email addresses from the 'assigned_to_usergroup' JSON field
          assignedUsers = JSON.parse(formLock.assigned_to_usergroup || '[]'); // Send an individual email to each assigned user

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context11.prev = 17;
          _iterator2 = assignedUsers[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context11.next = 34;
            break;
          }

          user = _step2.value;
          email = user[0]; // Extract email from each assigned user

          emailPayload = {
            subject: "".concat(formLock.form_title, " Form Deadline Update"),
            to: email,
            // Send email to individual user
            desc: "Dear ".concat(email, ",\n\nPlease be informed that the deadline for the ").concat(formLock.form_title, " form has been updated. The new deadline is ").concat(deadline, ".\n Ensure timely submission to avoid any delays.\n Best regards,\nIQAC")
          }; // Send email for each user

          _context11.prev = 23;
          _context11.next = 26;
          return regeneratorRuntime.awrap(axios.post('http://localhost:3000/mail/send', emailPayload));

        case 26:
          _context11.next = 31;
          break;

        case 28:
          _context11.prev = 28;
          _context11.t0 = _context11["catch"](23);
          console.error("Failed to send email to ".concat(email, ":"), _context11.t0.response ? _context11.t0.response.data : _context11.t0.message);

        case 31:
          _iteratorNormalCompletion2 = true;
          _context11.next = 19;
          break;

        case 34:
          _context11.next = 40;
          break;

        case 36:
          _context11.prev = 36;
          _context11.t1 = _context11["catch"](17);
          _didIteratorError2 = true;
          _iteratorError2 = _context11.t1;

        case 40:
          _context11.prev = 40;
          _context11.prev = 41;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 43:
          _context11.prev = 43;

          if (!_didIteratorError2) {
            _context11.next = 46;
            break;
          }

          throw _iteratorError2;

        case 46:
          return _context11.finish(43);

        case 47:
          return _context11.finish(40);

        case 48:
          res.status(200).json({
            success: true,
            message: 'Deadline updated and notifications sent successfully'
          });
          _context11.next = 55;
          break;

        case 51:
          _context11.prev = 51;
          _context11.t2 = _context11["catch"](3);
          console.error('Error updating deadline:', _context11.t2.stack);
          res.status(500).json({
            error: 'An error occurred while updating the deadline'
          });

        case 55:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[3, 51], [17, 36, 40, 48], [23, 28], [41,, 43, 47]]);
});
router.post('/create-shadow-user', function _callee11(req, res) {
  var _req$body7, emailId, form_id, department, role, assigned_by, form_title, deadline, checkUserQuery, userResult, insertUserQuery, fetchAssignedQuery, formResult, assignedUsers, userAlreadyAssigned, updateFormQuery, emailPayload;

  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body7 = req.body, emailId = _req$body7.emailId, form_id = _req$body7.form_id, department = _req$body7.department, role = _req$body7.role, assigned_by = _req$body7.assigned_by, form_title = _req$body7.form_title, deadline = _req$body7.deadline;
          _context12.prev = 1;
          // Check if the user already exists
          checkUserQuery = 'SELECT email FROM google_authenticated_users WHERE email = ?';
          _context12.next = 5;
          return regeneratorRuntime.awrap(query(checkUserQuery, [emailId]));

        case 5:
          userResult = _context12.sent;

          if (!(userResult.length === 0)) {
            _context12.next = 10;
            break;
          }

          // Insert user if not exists
          insertUserQuery = "\n        INSERT INTO google_authenticated_users (email, department, assigned_by, assigned_at, role)\n        VALUES (?, ?, ?, NOW(), ?)\n      ";
          _context12.next = 10;
          return regeneratorRuntime.awrap(query(insertUserQuery, [emailId, department, assigned_by, role]));

        case 10:
          // Fetch the current assigned_to_usergroup
          fetchAssignedQuery = 'SELECT assigned_to_usergroup FROM form_locks WHERE id = ?';
          _context12.next = 13;
          return regeneratorRuntime.awrap(query(fetchAssignedQuery, [form_id]));

        case 13:
          formResult = _context12.sent;
          assignedUsers = []; // Parse assigned_to_usergroup if it exists

          if (formResult.length > 0 && formResult[0].assigned_to_usergroup) {
            assignedUsers = JSON.parse(formResult[0].assigned_to_usergroup);
          } // Check if the user is already assigned


          userAlreadyAssigned = assignedUsers.some(function (user) {
            return user[0] === emailId;
          });

          if (!userAlreadyAssigned) {
            _context12.next = 19;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            error: 'User already assigned'
          }));

        case 19:
          // Add the new user with department to the nested array
          assignedUsers.push([emailId, department]); // Update form_locks with the new nested array

          updateFormQuery = "\n      UPDATE form_locks\n      SET assigned_to_usergroup = ?\n      WHERE id = ?;\n    ";
          _context12.next = 23;
          return regeneratorRuntime.awrap(query(updateFormQuery, [JSON.stringify(assignedUsers), form_id]));

        case 23:
          // Prepare and send email payload
          emailPayload = {
            subject: "".concat(form_title, " Form was assigned to you"),
            to: emailId,
            desc: "Dear ".concat(emailId, ",\n\nYou have been assigned the form titled \"").concat(form_title, "\" by the Head of Department (HOD) of ").concat(department, ". Please be informed that you have been given the responsibility to complete and submit this form before the specified deadline.\n\nGoing forward, you will receive notifications regarding any updates or reminders about the deadline, which is set for ").concat(deadline, ". Kindly ensure timely submission to avoid any delays.\n\nThank you for your cooperation.\n\nBest regards,\n").concat(assigned_by)
          };
          _context12.next = 26;
          return regeneratorRuntime.awrap(axios.post('http://localhost:3000/mail/send', emailPayload));

        case 26:
          res.status(200).json({
            success: true
          });
          _context12.next = 32;
          break;

        case 29:
          _context12.prev = 29;
          _context12.t0 = _context12["catch"](1);
          res.status(500).json({
            error: _context12.t0.message
          });

        case 32:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[1, 29]]);
});
router.post('/deleteFormUser', function (req, res) {
  var _req$body8 = req.body,
      formId = _req$body8.formId,
      email = _req$body8.email,
      department = _req$body8.department; // First, retrieve the current assigned_to_usergroup JSON array

  var selectQuery = 'SELECT assigned_to_usergroup FROM form_locks WHERE id = ?';
  db.query(selectQuery, [formId], function (err, results) {
    if (err) {
      console.error('Error fetching form data:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch form data'
      });
    }

    if (results.length === 0 || !results[0].assigned_to_usergroup) {
      return res.status(404).json({
        success: false,
        error: 'Form not found or no assigned users'
      });
    }

    var assignedUsers;

    try {
      assignedUsers = JSON.parse(results[0].assigned_to_usergroup);
    } catch (jsonError) {
      console.error('Error parsing assigned_to_usergroup JSON:', jsonError);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse user data'
      });
    } // Filter out the user based on email and department


    var updatedUsers = assignedUsers.filter(function (user) {
      return !(user[0] === email && user[1] === department);
    }); // Update the database with the modified JSON array

    var updateQuery = 'UPDATE form_locks SET assigned_to_usergroup = ? WHERE id = ?';
    db.query(updateQuery, [JSON.stringify(updatedUsers), formId], function (updateErr, updateResults) {
      if (updateErr) {
        console.error('Error updating form data:', updateErr);
        return res.status(500).json({
          success: false,
          error: 'Failed to update form data'
        });
      }

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    });
  });
});
router.post('/delete', function _callee12(req, res) {
  var _req$body9, formId, tableName, deleteFormLockQuery, deleteFormLockResponse, dropTableQuery;

  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body9 = req.body, formId = _req$body9.formId, tableName = _req$body9.tableName;

          if (!(!formId || !tableName)) {
            _context13.next = 3;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: 'Form ID and table name are required'
          }));

        case 3:
          _context13.prev = 3;
          _context13.next = 6;
          return regeneratorRuntime.awrap(query('START TRANSACTION'));

        case 6:
          // Delete the form lock entry from form_locks table
          deleteFormLockQuery = 'DELETE FROM form_locks WHERE id = ?';
          _context13.next = 9;
          return regeneratorRuntime.awrap(query(deleteFormLockQuery, [formId]));

        case 9:
          deleteFormLockResponse = _context13.sent;

          if (!(deleteFormLockResponse.affectedRows === 0)) {
            _context13.next = 14;
            break;
          }

          _context13.next = 13;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 13:
          return _context13.abrupt("return", res.status(404).json({
            error: 'Form lock not found'
          }));

        case 14:
          // Drop the table from the database
          dropTableQuery = "DROP TABLE IF EXISTS ??"; // Using placeholders to avoid SQL injection

          _context13.next = 17;
          return regeneratorRuntime.awrap(query(dropTableQuery, [tableName]));

        case 17:
          _context13.next = 19;
          return regeneratorRuntime.awrap(query('COMMIT'));

        case 19:
          res.json({
            message: "Form lock and table ".concat(tableName, " deleted successfully")
          });
          _context13.next = 28;
          break;

        case 22:
          _context13.prev = 22;
          _context13.t0 = _context13["catch"](3);
          console.error('Error deleting form lock and table:', _context13.t0.stack);
          _context13.next = 27;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 27:
          // Rollback the transaction in case of an error
          res.status(500).json({
            error: 'An error occurred while deleting the form and table'
          });

        case 28:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[3, 22]]);
});
router.post('/getlocktablestatus', function _callee13(req, res) {
  var _req$body10, id, table, results;

  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _req$body10 = req.body, id = _req$body10.id, table = _req$body10.table;

          if (!(!table || !id)) {
            _context14.next = 3;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context14.prev = 3;
          _context14.next = 6;
          return regeneratorRuntime.awrap(query('SELECT is_locked FROM ?? WHERE id=?', [table, id]));

        case 6:
          results = _context14.sent;

          if (results.length > 0) {
            res.status(200).json(results[0]);
          } else {
            res.status(404).json({
              error: 'Record not found'
            });
          }

          _context14.next = 14;
          break;

        case 10:
          _context14.prev = 10;
          _context14.t0 = _context14["catch"](3);
          console.error('Failed to fetch lock status:', _context14.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 14:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
module.exports = router;