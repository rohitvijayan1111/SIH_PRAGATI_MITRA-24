"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var cors = require('cors'); // Allow requests from all origins


router.use(cors());

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

router.post('/getEndIndex', function _callee(req, res) {
  var sql;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Received request:", req.body);
          sql = 'SELECT * FROM FormEndIndex;';
          _context.prev = 2;
          db.query(sql, function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            console.log('Database results:', results);
            res.status(200).json(results[0]);
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
router.post('/updateEndIndex', function _callee2(req, res) {
  var data, sql;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Received request:", req.body);
          data = req.body;
          sql = 'UPDATE FormEndIndex SET ?;';
          _context2.prev = 3;
          db.query(sql, [data], function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            console.log('Database results:', results);
            res.status(200).json(results[0]);
          });
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](3);
          console.error('Catch error:', _context2.t0.message);
          return _context2.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context2.t0.code)));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 7]]);
});
router.post('/createformrecord', function _callee3(req, res) {
  var _req$body, form_name, possible_start_index, Max_index, attributes, parsedAttributes, sql, values;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, form_name = _req$body.form_name, possible_start_index = _req$body.possible_start_index, Max_index = _req$body.Max_index, attributes = _req$body.attributes;
          console.log('Received payload:', req.body);

          if (!(!form_name || !possible_start_index || !Max_index || !attributes)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));

        case 4:
          _context3.prev = 4;
          parsedAttributes = JSON.parse(attributes);

          if (Array.isArray(parsedAttributes)) {
            _context3.next = 8;
            break;
          }

          throw new Error('Attributes should be an array');

        case 8:
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](4);
          return _context3.abrupt("return", res.status(400).json({
            error: 'Invalid attributes format'
          }));

        case 13:
          sql = 'INSERT INTO Forms (form_name,possible_start_index, Max_index, attributes) VALUES (?, ?, ?, ?)';
          values = [form_name, possible_start_index, Max_index, attributes];

          try {
            db.query(sql, values, function (err, result) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              res.status(201).send('Form created successfully');
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/getformlist', function _callee4(req, res) {
  var sql;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("Received request:", req.body);
          sql = 'SELECT * FROM form_locks;';
          _context4.prev = 2;
          db.query(sql, function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            console.log('Database results:', results);
            res.status(200).json(results);
          });
          _context4.next = 10;
          break;

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](2);
          console.error('Catch error:', _context4.t0.message);
          return _context4.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context4.t0.code)));

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 6]]);
});
router.post('/lockform', function _callee5(req, res) {
  var _req$body2, id, lock;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, lock = _req$body2.lock;

          if (!(!id || lock === undefined)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'ID and lock status are required'
          }));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(db.query('UPDATE forms SET is_locked = ? WHERE id = ?', [lock, id]));

        case 6:
          res.json({
            message: 'Item lock status updated successfully'
          });
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](3);
          console.error('Error updating lock status:', _context5.t0.stack);
          res.status(500).send(getFriendlyErrorMessage(_context5.t0.code));

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/insertrecord', function _callee6(req, res) {
  var data, sql, values;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          data = req.body;
          console.log('Received payload:', req.body);

          if (data) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));

        case 4:
          sql = 'INSERT INTO formrecords SET ?';
          values = [data];

          try {
            db.query(sql, values, function (err, result) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              res.status(201).send('Form created successfully');
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router.post('/updateformindex', function _callee7(req, res) {
  var _req$body3, form_id, data, sql, values;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body3 = req.body, form_id = _req$body3.form_id, data = _req$body3.data;
          console.log('Received payload:', req.body);

          if (data) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));

        case 4:
          sql = 'UPDATE forms SET ? WHERE id=?';
          values = [data, form_id];

          try {
            db.query(sql, values, function (err, result) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              res.status(201).send('Form created successfully');
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
});
router.post('/getformrecords', function _callee8(req, res) {
  var id, sql;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("Received request:", req.body);
          id = req.body.id;
          sql = 'SELECT start_index, end_index FROM forms WHERE id = ?';
          _context8.prev = 3;
          db.query(sql, [id], function (err, results) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }

            if (results.length === 0) {
              return res.status(404).send('End index not found');
            }

            var a = results[0].start_index;
            var b = results[0].end_index;
            var sql2 = 'SELECT * FROM formrecords WHERE id BETWEEN ? AND ? AND form_id = ?';
            db.query(sql2, [a, b, id], function (err2, results2) {
              if (err2) {
                console.error('Database error:', err2);
                return res.status(500).send(getFriendlyErrorMessage(err2.code));
              }

              res.status(200).json(results2);
            });
          });
          _context8.next = 11;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](3);
          console.error('Catch error:', _context8.t0.message);
          return _context8.abrupt("return", res.status(500).send(getFriendlyErrorMessage(_context8.t0.code)));

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 7]]);
});
router.post('/editformrecord', function _callee9(req, res) {
  var id, data, sql, values;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.body.id;
          data = req.body.record_data;
          console.log('Received payload for editing:', req.body);

          if (data) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));

        case 5:
          sql = 'UPDATE formrecords SET record_data=? WHERE id=?';
          values = [data, id];

          try {
            db.query(sql, values, function (err, result) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              res.status(201).send('Record Edited successfully');
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 8:
        case "end":
          return _context9.stop();
      }
    }
  });
});
router.post('/updateAndDeleteRecord', function _callee10(req, res) {
  var _req$body4, recordId, formId, sqlNextRecord, sqlUpdateForm, sqlDeleteRecord;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body4 = req.body, recordId = _req$body4.recordId, formId = _req$body4.formId;
          sqlNextRecord = 'SELECT id FROM formrecords WHERE id > ? AND form_id = ? ORDER BY id ASC LIMIT 1';
          sqlUpdateForm = 'UPDATE forms SET start_index = ? WHERE start_index = ?';
          sqlDeleteRecord = 'DELETE FROM formrecords WHERE id = ?';

          try {
            db.query(sqlNextRecord, [recordId, formId], function (err, results) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
              }

              var nextRecordId = results.length > 0 ? results[0].id : null;
              var updateValue = nextRecordId ? nextRecordId : null;
              db.query(sqlUpdateForm, [updateValue, recordId], function (err, result) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).send(getFriendlyErrorMessage(err.code));
                }

                db.query(sqlDeleteRecord, [recordId], function (err, result) {
                  if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send(getFriendlyErrorMessage(err.code));
                  }

                  res.status(200).send('Record deleted and foreign key reference updated successfully');
                });
              });
            });
          } catch (err) {
            console.error('Catch error:', err.message);
            res.status(500).send(getFriendlyErrorMessage(err.code));
          }

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
});
module.exports = router;