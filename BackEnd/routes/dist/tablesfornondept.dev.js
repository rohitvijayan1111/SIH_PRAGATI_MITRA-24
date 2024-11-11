"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

router.post('/gettable', function _callee(req, res) {
  var table, recordSql, columnSql, recordValues, columnValues, columnResults, columnDataTypes, recordResults;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          table = req.body.table;

          if (table) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Please provide the table parameter."));

        case 3:
          recordSql = 'SELECT * FROM ?? ';
          columnSql = 'SHOW COLUMNS FROM ??';
          recordValues = [table];
          columnValues = [table]; // Remove department filter logic

          recordSql += 'ORDER BY id'; // You can change this order by field if needed

          _context.prev = 8;
          _context.next = 11;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 11:
          columnResults = _context.sent;
          columnDataTypes = columnResults.reduce(function (acc, col) {
            acc[col.Field] = col.Type;
            return acc;
          }, {}); // Fetch table records without department filter

          _context.next = 15;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 15:
          recordResults = _context.sent;

          if (!(recordResults.length === 0)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: []
          }));

        case 18:
          res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: recordResults
          });
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](8);
          console.error('Error fetching data:', _context.t0.message);
          return _context.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context.t0.code)
          }));

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 21]]);
});
router["delete"]('/deleterecord', function _callee2(req, res) {
  var _req$body, id, table, record, filePath;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, table = _req$body.table;

          if (!(!table || !id)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(query('SELECT document FROM ?? WHERE id = ?', [table, id]));

        case 6:
          record = _context2.sent;

          if (!(record.length === 0)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          filePath = record[0].document;
          console.log(filePath);

          if (!filePath) {
            _context2.next = 21;
            break;
          }

          _context2.prev = 12;
          _context2.next = 15;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(filePath)));

        case 15:
          console.log("File at ".concat(filePath, " deleted successfully"));
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](12);
          console.error('Error deleting file:', _context2.t0);

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 23:
          res.json({
            message: 'Item and associated file (if any) deleted successfully'
          });
          _context2.next = 30;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t1 = _context2["catch"](3);
          console.error('Error deleting item:', _context2.t1.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context2.t1.code)
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 26], [12, 18]]);
});
router.post('/insertrecord', upload.single('file'), function _callee3(req, res) {
  var _req$body2, table, data, filePath, friendlyMessage;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, table = _req$body2.table, data = _objectWithoutProperties(_req$body2, ["table"]);

          if (!(!table || !data)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context3.prev = 3;
          filePath = null;

          if (req.file) {
            filePath = req.file.path;
            data.document = filePath;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 8:
          res.json({
            message: 'Record inserted successfully'
          });
          _context3.next = 16;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](3);
          console.error('Error inserting record:', _context3.t0);
          friendlyMessage = getFriendlyErrorMessage(_context3.t0.code);
          res.status(500).json({
            error: "".concat(friendlyMessage)
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router.post('/updaterecord', upload.single('file'), function _callee4(req, res) {
  var _req$body3, id, table, rawData, deleteFile, data, existingRows, oldFilePath, newFilePath, currentTimestamp, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.body);
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table, rawData = _req$body3.data, deleteFile = _req$body3.deleteFile;
          data = JSON.parse(rawData);

          if (!(!id || !table)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Id and table are required'
          }));

        case 5:
          _context4.prev = 5;
          _context4.next = 8;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 8:
          existingRows = _context4.sent;

          if (!(existingRows.length === 0)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 11:
          // Handling file upload and deletion
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath;

          if (!req.file) {
            _context4.next = 26;
            break;
          }

          newFilePath = req.file.path;

          if (!(oldFilePath && oldFilePath !== newFilePath)) {
            _context4.next = 24;
            break;
          }

          _context4.prev = 16;
          _context4.next = 19;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 19:
          _context4.next = 24;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](16);
          console.error('Error deleting old file:', _context4.t0);

        case 24:
          _context4.next = 36;
          break;

        case 26:
          if (!(deleteFile === 'true' && oldFilePath)) {
            _context4.next = 36;
            break;
          }

          _context4.prev = 27;
          _context4.next = 30;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 30:
          newFilePath = ''; // Clear the document path in the database

          _context4.next = 36;
          break;

        case 33:
          _context4.prev = 33;
          _context4.t1 = _context4["catch"](27);
          console.error('Error deleting old file:', _context4.t1);

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
          _context4.next = 46;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 46:
          res.json({
            message: 'Record updated successfully'
          });
          _context4.next = 53;
          break;

        case 49:
          _context4.prev = 49;
          _context4.t2 = _context4["catch"](5);
          console.error('Error updating record:', _context4.t2);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context4.t2.code)
          });

        case 53:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 49], [16, 21], [27, 33]]);
});
router["delete"]('/deleterecord', function _callee5(req, res) {
  var _req$body4, id, table, record, filePath;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, table = _req$body4.table;

          if (!(!table || !id)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(query('SELECT document FROM ?? WHERE id = ?', [table, id]));

        case 6:
          record = _context5.sent;

          if (!(record.length === 0)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          filePath = record[0].document;
          console.log(filePath);

          if (!filePath) {
            _context5.next = 21;
            break;
          }

          _context5.prev = 12;
          _context5.next = 15;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(filePath)));

        case 15:
          console.log("File at ".concat(filePath, " deleted successfully"));
          _context5.next = 21;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](12);
          console.error('Error deleting file:', _context5.t0);

        case 21:
          _context5.next = 23;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 23:
          res.json({
            message: 'Item and associated file (if any) deleted successfully'
          });
          _context5.next = 30;
          break;

        case 26:
          _context5.prev = 26;
          _context5.t1 = _context5["catch"](3);
          console.error('Error deleting item:', _context5.t1.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context5.t1.code)
          });

        case 30:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 26], [12, 18]]);
});
module.exports = router;