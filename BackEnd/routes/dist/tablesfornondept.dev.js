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
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var table, dir;
    return regeneratorRuntime.async(function destination$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            table = req.body.table;
            dir = "./uploads/".concat(table);
            _context.next = 4;
            return regeneratorRuntime.awrap(fsPromises.mkdir(dir, {
              recursive: true
            }));

          case 4:
            cb(null, dir);

          case 5:
          case "end":
            return _context.stop();
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
}; // Get table data


router.post('/gettable', function _callee(req, res) {
  var table, recordSql, columnSql, recordValues, columnValues, columnResults, columnDataTypes, recordResults;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          table = req.body.table;

          if (table) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Please provide the table parameter."));

        case 3:
          recordSql = 'SELECT * FROM ?? ';
          columnSql = 'SHOW COLUMNS FROM ??';
          recordValues = [table];
          columnValues = [table];
          recordSql += 'ORDER BY id'; // You can change this order by field if needed

          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 11:
          columnResults = _context2.sent;
          columnDataTypes = columnResults.reduce(function (acc, col) {
            acc[col.Field] = col.Type;
            return acc;
          }, {});
          _context2.next = 15;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 15:
          recordResults = _context2.sent;

          if (!(recordResults.length === 0)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: []
          }));

        case 18:
          res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: recordResults
          });
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](8);
          console.error('Error fetching data:', _context2.t0.message);
          return _context2.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context2.t0.code)
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 21]]);
}); // Delete record by ID

router["delete"]('/deleterecord', function _callee2(req, res) {
  var _req$body, id, table;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, table = _req$body.table;

          if (!(!table || !id)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 6:
          res.json({
            message: 'Item deleted successfully'
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](3);
          console.error('Error deleting item:', _context3.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context3.t0.code)
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 9]]);
}); // Insert new record

router.post('/insertrecord', upload.single('file'), function _callee3(req, res) {
  var _req$body2, table, data, filePath, friendlyMessage;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, table = _req$body2.table, data = _objectWithoutProperties(_req$body2, ["table"]);

          if (!(!table || !data)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Data and table are required'
          }));

        case 3:
          _context4.prev = 3;
          filePath = null;

          if (req.file) {
            filePath = req.file.path;
            data.document = filePath;
          }

          _context4.next = 8;
          return regeneratorRuntime.awrap(query('INSERT INTO ?? SET ?', [table, data]));

        case 8:
          res.json({
            message: 'Record inserted successfully'
          });
          _context4.next = 16;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](3);
          console.error('Error inserting record:', _context4.t0);
          friendlyMessage = getFriendlyErrorMessage(_context4.t0.code);
          res.status(500).json({
            error: "".concat(friendlyMessage)
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 11]]);
}); // Update record by ID

router.post('/updaterecord', upload.single('file'), function _callee4(req, res) {
  var _req$body3, id, table, rawData, deleteFile, data, existingRows, oldFilePath, newFilePath, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.body);
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table, rawData = _req$body3.data, deleteFile = _req$body3.deleteFile;
          data = JSON.parse(rawData); // Check if id and table are provided

          if (!(!id || !table)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Id and table are required'
          }));

        case 5:
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(query('SELECT * FROM ?? WHERE id = ?', [table, id]));

        case 8:
          existingRows = _context5.sent;

          if (!(existingRows.length === 0)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 11:
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath; // File upload logic

          if (!req.file) {
            _context5.next = 26;
            break;
          }

          newFilePath = req.file.path;

          if (!(oldFilePath && oldFilePath !== newFilePath)) {
            _context5.next = 24;
            break;
          }

          _context5.prev = 16;
          _context5.next = 19;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](16);
          console.error('Error deleting old file:', _context5.t0);

        case 24:
          _context5.next = 36;
          break;

        case 26:
          if (!(deleteFile === 'true' && oldFilePath)) {
            _context5.next = 36;
            break;
          }

          _context5.prev = 27;
          _context5.next = 30;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(oldFilePath)));

        case 30:
          newFilePath = ''; // Clear the document path in the database

          _context5.next = 36;
          break;

        case 33:
          _context5.prev = 33;
          _context5.t1 = _context5["catch"](27);
          console.error('Error deleting old file:', _context5.t1);

        case 36:
          // Update the document path in data if a new file is uploaded
          if (newFilePath) {
            data.document = newFilePath;
          } // Construct the SET clause dynamically with proper escaping


          setClause = Object.keys(data).map(function (key) {
            return "`".concat(key, "` = ?");
          }).join(', ');
          values = Object.values(data); // Construct and execute the update query

          updateQuery = "UPDATE `".concat(table, "` SET ").concat(setClause, " WHERE id = ?");
          console.log('SQL Query:', updateQuery);
          console.log('Values:', [].concat(_toConsumableArray(values), [id]));
          _context5.next = 44;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 44:
          // Send a successful response
          res.json({
            message: 'Record updated successfully'
          });
          _context5.next = 51;
          break;

        case 47:
          _context5.prev = 47;
          _context5.t2 = _context5["catch"](5);
          console.error('Error updating record:', _context5.t2);
          res.status(500).json({
            error: 'Failed to update record'
          });

        case 51:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 47], [16, 21], [27, 33]]);
});
module.exports = router;