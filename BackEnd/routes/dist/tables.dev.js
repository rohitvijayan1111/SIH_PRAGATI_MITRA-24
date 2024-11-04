"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var table, department, recordSql, columnSql, recordValues, columnValues, columnResults, columnDataTypes, recordResults;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //console.log("Received request:", req.body);
          table = req.body.table;
          department = req.body.department;

          if (!(!table || !department)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Please provide both table and department parameters."));

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
          _context.prev = 10;
          _context.next = 13;
          return regeneratorRuntime.awrap(query(columnSql, columnValues));

        case 13:
          columnResults = _context.sent;
          columnDataTypes = columnResults.reduce(function (acc, col) {
            acc[col.Field] = col.Type;
            return acc;
          }, {}); // Fetch table records

          _context.next = 17;
          return regeneratorRuntime.awrap(query(recordSql, recordValues));

        case 17:
          recordResults = _context.sent;

          if (!(recordResults.length === 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: []
          }));

        case 20:
          res.status(200).json({
            columnDataTypes: columnDataTypes,
            data: recordResults
          });
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](10);
          console.error('Error fetching data:', _context.t0.message);
          return _context.abrupt("return", res.status(500).json({
            error: getFriendlyErrorMessage(_context.t0.code)
          }));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 23]]);
});
router.post('/create-table', function _callee2(req, res) {
  var _req$body, formName, attributes, usergroup, tableName, columns, createTableQuery, insertLockQuery;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, formName = _req$body.formName, attributes = _req$body.attributes, usergroup = _req$body.usergroup;

          if (!(!formName || !attributes || !Array.isArray(attributes))) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Invalid request data'));

        case 3:
          // Construct table name and columns
          tableName = formName.replace(/\s+/g, '_').toLowerCase(); // Convert form name to a valid table name

          columns = 'id INT AUTO_INCREMENT PRIMARY KEY, ';
          attributes.forEach(function (attr) {
            var type = attr.type === 'text' ? 'VARCHAR(255)' : attr.type === 'number' ? 'INT' : attr.type === 'date' ? 'DATE' : attr.type === 'boolean' ? 'BOOLEAN' : attr.type === 'file' ? 'VARCHAR(255)' : // File type, storing file name or path
            attr.type === 'link' ? 'VARCHAR(255)' : 'TEXT'; // Link type, storing URL or related link

            columns += "".concat(attr.name.replace(/\s+/g, '_').toLowerCase(), " ").concat(type, ", ");
          }); // Remove trailing comma and space

          columns = columns.slice(0, -2);
          createTableQuery = "CREATE TABLE ".concat(tableName, " (").concat(columns, ")");
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(query(createTableQuery));

        case 11:
          // Insert a record into the form_locks table
          insertLockQuery = "INSERT INTO form_locks (form_table_name, form_title, is_locked,usergroup,not_submitted_emails) VALUES (?, ?, ?,?,?)";
          _context2.next = 14;
          return regeneratorRuntime.awrap(query(insertLockQuery, [tableName, formName, 0, usergroup, usergroup]));

        case 14:
          // Initially, set is_locked to 0 (unlocked)
          res.send("Table ".concat(tableName, " created successfully"));
          _context2.next = 21;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](8);
          console.error('Error:', _context2.t0.message);
          res.status(500).send('Error creating table and inserting record');

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 17]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var table, dir;
    return regeneratorRuntime.async(function destination$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            table = req.body.table;
            dir = "./uploads/".concat(table);
            _context3.next = 4;
            return regeneratorRuntime.awrap(fsPromises.mkdir(dir, {
              recursive: true
            }));

          case 4:
            cb(null, dir);

          case 5:
          case "end":
            return _context3.stop();
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
});
router.post('/updaterecord', upload.single('file'), function _callee4(req, res) {
  var _req$body3, id, table, rawData, deleteFile, data, existingRows, oldFilePath, newFilePath, currentTimestamp, setClause, values, updateQuery;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.body);
          _req$body3 = req.body, id = _req$body3.id, table = _req$body3.table, rawData = _req$body3.data, deleteFile = _req$body3.deleteFile;
          data = JSON.parse(rawData);

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
          // Handling file upload and deletion
          oldFilePath = existingRows[0].document;
          newFilePath = oldFilePath;

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
          _context5.next = 46;
          return regeneratorRuntime.awrap(query(updateQuery, [].concat(_toConsumableArray(values), [id])));

        case 46:
          res.json({
            message: 'Record updated successfully'
          });
          _context5.next = 53;
          break;

        case 49:
          _context5.prev = 49;
          _context5.t2 = _context5["catch"](5);
          console.error('Error updating record:', _context5.t2);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context5.t2.code)
          });

        case 53:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 49], [16, 21], [27, 33]]);
});
router["delete"]('/deleterecord', function _callee5(req, res) {
  var _req$body4, id, table, record, filePath;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, table = _req$body4.table;

          if (!(!table || !id)) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(query('SELECT document FROM ?? WHERE id = ?', [table, id]));

        case 6:
          record = _context6.sent;

          if (!(record.length === 0)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 9:
          filePath = record[0].document;
          console.log(filePath);

          if (!filePath) {
            _context6.next = 21;
            break;
          }

          _context6.prev = 12;
          _context6.next = 15;
          return regeneratorRuntime.awrap(fsPromises.unlink(path.resolve(filePath)));

        case 15:
          console.log("File at ".concat(filePath, " deleted successfully"));
          _context6.next = 21;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](12);
          console.error('Error deleting file:', _context6.t0);

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(query('DELETE FROM ?? WHERE id = ?', [table, id]));

        case 23:
          res.json({
            message: 'Item and associated file (if any) deleted successfully'
          });
          _context6.next = 30;
          break;

        case 26:
          _context6.prev = 26;
          _context6.t1 = _context6["catch"](3);
          console.error('Error deleting item:', _context6.t1.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context6.t1.code)
          });

        case 30:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 26], [12, 18]]);
});
router.post('/locktable', function _callee6(req, res) {
  var _req$body5, id, lock;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, lock = _req$body5.lock;

          if (!(!id || lock === undefined)) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](3);
          console.error('Error updating lock status:', _context7.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/deadline', function _callee7(req, res) {
  var _req$body6, id, deadline, _ref, _ref2, formLock, assignedUsers, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, email, emailPayload;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body6 = req.body, id = _req$body6.id, deadline = _req$body6.deadline; // Validate request body

          if (!(!id || !deadline)) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'ID and deadline are required'
          }));

        case 3:
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM form_locks WHERE id = ?', [id]));

        case 6:
          _ref = _context8.sent;
          _ref2 = _slicedToArray(_ref, 1);
          formLock = _ref2[0];

          if (formLock) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: 'Form lock not found'
          }));

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap(query('UPDATE form_locks SET deadline = ? WHERE id = ?', [deadline, id]));

        case 13:
          // Fetch the email addresses from the 'assigned_to_usergroup' JSON field
          assignedUsers = JSON.parse(formLock.assigned_to_usergroup || '[]'); // Send an individual email to each assigned user

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 17;
          _iterator = assignedUsers[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 28;
            break;
          }

          user = _step.value;
          email = user[0]; // Extract email from each assigned user

          emailPayload = {
            subject: "".concat(formLock.form_title, " Form Deadline Update"),
            to: email,
            // Send email to individual user
            desc: "Dear ".concat(email, ",\n\nPlease be informed that the deadline for the ").concat(formLock.form_title, " form has been updated. The new deadline is ").concat(deadline, ".\n Ensure timely submission to avoid any delays.\n Best regards,\nIQAC")
          }; // Send email for each user

          _context8.next = 25;
          return regeneratorRuntime.awrap(axios.post('http://localhost:3000/mail/send', emailPayload));

        case 25:
          _iteratorNormalCompletion = true;
          _context8.next = 19;
          break;

        case 28:
          _context8.next = 34;
          break;

        case 30:
          _context8.prev = 30;
          _context8.t0 = _context8["catch"](17);
          _didIteratorError = true;
          _iteratorError = _context8.t0;

        case 34:
          _context8.prev = 34;
          _context8.prev = 35;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 37:
          _context8.prev = 37;

          if (!_didIteratorError) {
            _context8.next = 40;
            break;
          }

          throw _iteratorError;

        case 40:
          return _context8.finish(37);

        case 41:
          return _context8.finish(34);

        case 42:
          res.status(200).json({
            success: true,
            message: 'Deadline updated and notifications sent successfully'
          });
          _context8.next = 49;
          break;

        case 45:
          _context8.prev = 45;
          _context8.t1 = _context8["catch"](3);
          console.error('Error updating deadline:', _context8.t1.stack);
          res.status(500).json({
            error: 'An error occurred while updating the deadline'
          });

        case 49:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 45], [17, 30, 34, 42], [35,, 37, 41]]);
});
router.post('/create-shadow-user', function _callee8(req, res) {
  var _req$body7, emailId, form_id, department, role, assigned_by, form_title, deadline, checkUserQuery, userResult, insertUserQuery, fetchAssignedQuery, formResult, assignedUsers, userAlreadyAssigned, updateFormQuery, emailPayload;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body7 = req.body, emailId = _req$body7.emailId, form_id = _req$body7.form_id, department = _req$body7.department, role = _req$body7.role, assigned_by = _req$body7.assigned_by, form_title = _req$body7.form_title, deadline = _req$body7.deadline;
          _context9.prev = 1;
          // Check if the user already exists
          checkUserQuery = 'SELECT email FROM google_authenticated_users WHERE email = ?';
          _context9.next = 5;
          return regeneratorRuntime.awrap(query(checkUserQuery, [emailId]));

        case 5:
          userResult = _context9.sent;

          if (!(userResult.length === 0)) {
            _context9.next = 10;
            break;
          }

          // Insert user if not exists
          insertUserQuery = "\n        INSERT INTO google_authenticated_users (email, department, assigned_by, assigned_at, role)\n        VALUES (?, ?, ?, NOW(), ?)\n      ";
          _context9.next = 10;
          return regeneratorRuntime.awrap(query(insertUserQuery, [emailId, department, assigned_by, role]));

        case 10:
          // Fetch the current assigned_to_usergroup
          fetchAssignedQuery = 'SELECT assigned_to_usergroup FROM form_locks WHERE id = ?';
          _context9.next = 13;
          return regeneratorRuntime.awrap(query(fetchAssignedQuery, [form_id]));

        case 13:
          formResult = _context9.sent;
          assignedUsers = []; // Parse assigned_to_usergroup if it exists

          if (formResult.length > 0 && formResult[0].assigned_to_usergroup) {
            assignedUsers = JSON.parse(formResult[0].assigned_to_usergroup);
          } // Check if the user is already assigned


          userAlreadyAssigned = assignedUsers.some(function (user) {
            return user[0] === emailId;
          });

          if (!userAlreadyAssigned) {
            _context9.next = 19;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: 'User already assigned'
          }));

        case 19:
          // Add the new user with department to the nested array
          assignedUsers.push([emailId, department]); // Update form_locks with the new nested array

          updateFormQuery = "\n      UPDATE form_locks\n      SET assigned_to_usergroup = ?\n      WHERE id = ?;\n    ";
          _context9.next = 23;
          return regeneratorRuntime.awrap(query(updateFormQuery, [JSON.stringify(assignedUsers), form_id]));

        case 23:
          // Prepare and send email payload
          emailPayload = {
            subject: "".concat(form_title, " Form was assigned to you"),
            to: emailId,
            desc: "Dear ".concat(emailId, ",\n\nYou have been assigned the form titled \"").concat(form_title, "\" by the Head of Department (HOD) of ").concat(department, ". Please be informed that you have been given the responsibility to complete and submit this form before the specified deadline.\n\nGoing forward, you will receive notifications regarding any updates or reminders about the deadline, which is set for ").concat(deadline, ". Kindly ensure timely submission to avoid any delays.\n\nThank you for your cooperation.\n\nBest regards,\n").concat(assigned_by)
          };
          _context9.next = 26;
          return regeneratorRuntime.awrap(axios.post('http://localhost:3000/mail/send', emailPayload));

        case 26:
          res.status(200).json({
            success: true
          });
          _context9.next = 32;
          break;

        case 29:
          _context9.prev = 29;
          _context9.t0 = _context9["catch"](1);
          res.status(500).json({
            error: _context9.t0.message
          });

        case 32:
        case "end":
          return _context9.stop();
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
router.post('/delete', function _callee9(req, res) {
  var _req$body9, formId, tableName, deleteFormLockQuery, deleteFormLockResponse, dropTableQuery;

  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body9 = req.body, formId = _req$body9.formId, tableName = _req$body9.tableName;

          if (!(!formId || !tableName)) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            error: 'Form ID and table name are required'
          }));

        case 3:
          _context10.prev = 3;
          _context10.next = 6;
          return regeneratorRuntime.awrap(query('START TRANSACTION'));

        case 6:
          // Delete the form lock entry from form_locks table
          deleteFormLockQuery = 'DELETE FROM form_locks WHERE id = ?';
          _context10.next = 9;
          return regeneratorRuntime.awrap(query(deleteFormLockQuery, [formId]));

        case 9:
          deleteFormLockResponse = _context10.sent;

          if (!(deleteFormLockResponse.affectedRows === 0)) {
            _context10.next = 14;
            break;
          }

          _context10.next = 13;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 13:
          return _context10.abrupt("return", res.status(404).json({
            error: 'Form lock not found'
          }));

        case 14:
          // Drop the table from the database
          dropTableQuery = "DROP TABLE IF EXISTS ??"; // Using placeholders to avoid SQL injection

          _context10.next = 17;
          return regeneratorRuntime.awrap(query(dropTableQuery, [tableName]));

        case 17:
          _context10.next = 19;
          return regeneratorRuntime.awrap(query('COMMIT'));

        case 19:
          res.json({
            message: "Form lock and table ".concat(tableName, " deleted successfully")
          });
          _context10.next = 28;
          break;

        case 22:
          _context10.prev = 22;
          _context10.t0 = _context10["catch"](3);
          console.error('Error deleting form lock and table:', _context10.t0.stack);
          _context10.next = 27;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 27:
          // Rollback the transaction in case of an error
          res.status(500).json({
            error: 'An error occurred while deleting the form and table'
          });

        case 28:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 22]]);
});
router.post('/getlocktablestatus', function _callee10(req, res) {
  var _req$body10, id, table, results;

  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$body10 = req.body, id = _req$body10.id, table = _req$body10.table;

          if (!(!table || !id)) {
            _context11.next = 3;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            error: 'Table name and ID are required'
          }));

        case 3:
          _context11.prev = 3;
          _context11.next = 6;
          return regeneratorRuntime.awrap(query('SELECT is_locked FROM ?? WHERE id=?', [table, id]));

        case 6:
          results = _context11.sent;

          if (results.length > 0) {
            res.status(200).json(results[0]);
          } else {
            res.status(404).json({
              error: 'Record not found'
            });
          }

          _context11.next = 14;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](3);
          console.error('Failed to fetch lock status:', _context11.t0.stack);
          res.status(500).json({
            error: getFriendlyErrorMessage(error.code)
          });

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
module.exports = router;