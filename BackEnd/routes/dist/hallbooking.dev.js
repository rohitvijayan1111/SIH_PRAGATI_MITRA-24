"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

var util = require('util');

var _require = require('console'),
    error = _require.error;

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
router.get('/availablehalls', function _callee(req, res) {
  var sql, result, transformedHalls;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sql = 'SELECT * FROM halls';
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          result = _context.sent;
          transformedHalls = result.map(function (hall) {
            return {
              id: hall.id,
              name: hall.hall_name,
              image: hall.image_path,
              location: hall.hall_location,
              capacity: hall.capacity,
              facilities: hall.facilities.split(',')
            };
          });
          res.json(transformedHalls);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching halls:', _context.t0);
          res.status(500).json({
            error: 'Failed to fetch halls'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
router.get('/halls', function _callee2(req, res) {
  var sql, results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          sql = 'SELECT hall_name FROM halls';
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(query(sql));

        case 4:
          results = _context2.sent;
          res.json(results);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error('Error fetching hall names:', _context2.t0);
          res.status(500).json({
            error: 'Failed to fetch hall names'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.post('/hall-request', function _callee3(req, res) {
  var _req$body, name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed, department, emails, hallAvailabilityQuery, hodApprovalQuery, hallAvailabilityResults, hodApprovalResults, insertRequestQuery;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, speaker = _req$body.speaker, speaker_description = _req$body.speaker_description, event_date = _req$body.event_date, start_time = _req$body.start_time, end_time = _req$body.end_time, hall_name = _req$body.hall_name, participants = _req$body.participants, incharge_faculty = _req$body.incharge_faculty, facility_needed = _req$body.facility_needed, department = _req$body.department, emails = _req$body.emails;
          hallAvailabilityQuery = "\n      SELECT * FROM hall_allotment \n      WHERE hall_name = ? \n      AND event_date = ? \n      AND (\n          (start_time < ? AND end_time > ?) OR\n          (start_time < ? AND end_time > ?) OR\n          (start_time >= ? AND end_time <= ?)\n      )";
          hodApprovalQuery = "\n      SELECT * FROM hall_request \n      WHERE hall_name = ? \n      AND event_date = ? \n      AND hod_approval = 1 \n      AND (\n          (start_time < ? AND end_time > ?) OR\n          (start_time < ? AND end_time > ?) OR\n          (start_time >= ? AND end_time <= ?)\n      )";
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(query(hallAvailabilityQuery, [hall_name, event_date, start_time, start_time, end_time, end_time, start_time, end_time]));

        case 6:
          hallAvailabilityResults = _context3.sent;

          if (!(hallAvailabilityResults.length > 0)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Hall is not available for the requested time and date.'
          }));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(query(hodApprovalQuery, [hall_name, event_date, start_time, start_time, end_time, end_time, start_time, end_time]));

        case 11:
          hodApprovalResults = _context3.sent;

          if (!(hodApprovalResults.length > 0)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'An approved request already exists for this hall and time.'
          }));

        case 14:
          // Insert new hall request
          insertRequestQuery = "\n          INSERT INTO hall_request (\n              name, speaker, speaker_description, event_date, start_time, end_time, hall_name, \n              participants, incharge_faculty, facility_needed, department, emails\n          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          _context3.next = 17;
          return regeneratorRuntime.awrap(query(insertRequestQuery, [name, speaker, speaker_description, event_date, start_time, end_time, hall_name, participants, incharge_faculty, facility_needed, department, emails]));

        case 17:
          res.send('Hall request submitted successfully');
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](3);
          console.error('Error processing hall request:', _context3.t0);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context3.t0)
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 20]]);
});
router.post('/hall_requests_remove', function _callee4(req, res) {
  var id, sql, results;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.body.id;
          sql = 'DELETE FROM hall_request WHERE id = ?';
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(query(sql, [id]));

        case 5:
          results = _context4.sent;

          if (!(results.affectedRows === 0)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "No Records Removed"
          }));

        case 8:
          res.json({
            message: "Removed Successfully"
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](2);
          console.error('Error removing record:', _context4.t0);
          res.status(500).send({
            error: getFriendlyErrorMessage(_context4.t0)
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 11]]);
});
router.post('/hall_requests_remove_admin', function _callee5(req, res) {
  var id, sql, results;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.body.id;
          sql = 'DELETE FROM hall_allotment WHERE id = ?';
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(query(sql, [id]));

        case 5:
          results = _context5.sent;

          if (!(results.affectedRows === 0)) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "No Records Removed"
          }));

        case 8:
          res.json({
            message: "Removed Successfully"
          });
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](2);
          console.error('Error removing record:', _context5.t0);
          res.status(500).send({
            error: getFriendlyErrorMessage(_context5.t0)
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 11]]);
});
router.post('/hall_requests_status', function _callee6(req, res) {
  var _req$body2, department, role, sql, params, results, formattedEvents;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body2 = req.body, department = _req$body2.department, role = _req$body2.role;
          sql = 'SELECT * FROM hall_request';
          params = [];

          if (role === 'hod' || role === 'Event Coordinator') {
            sql += ' WHERE department = ?';
            params.push(department);
          }

          console.log(sql);
          _context6.prev = 5;
          _context6.next = 8;
          return regeneratorRuntime.awrap(query(sql, params));

        case 8:
          results = _context6.sent;

          if (!(results.length === 0)) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "No Hall Request Found"
          }));

        case 11:
          formattedEvents = results.map(function (event) {
            return {
              id: event.id,
              name: event.name,
              speaker: event.speaker,
              speaker_description: event.speaker_description,
              event_date: event.event_date,
              start_time: event.start_time,
              end_time: event.end_time,
              department: event.department,
              hall_name: event.hall_name,
              emails: event.emails,
              participants: event.participants,
              incharge_faculty: event.incharge_faculty,
              facility_needed: event.facility_needed,
              approvals: {
                hod: event.hod_approval === 1,
                academic_coordinator: event.academic_coordinator_approval === 1,
                principal: event.principal_approval === 1
              }
            };
          });
          res.json(formattedEvents);
          _context6.next = 19;
          break;

        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](5);
          console.error('Error fetching data:', _context6.t0);
          res.status(500).send({
            error: getFriendlyErrorMessage(_context6.t0)
          });

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 15]]);
});
router.post('/past-events', function _callee7(req, res) {
  var _req$body3, department, role, sql, results, formattedEvents;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body3 = req.body, department = _req$body3.department, role = _req$body3.role;
          sql = "\n    SELECT *\n    FROM hall_allotment\n    WHERE event_date < CURDATE()\n      OR (event_date = CURDATE() AND end_time < CURTIME())\n  ";

          if (role === 'hod' || role === 'Event Coordinator') {
            sql += ' AND department = ?';
          }

          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(query(sql, [department]));

        case 6:
          results = _context7.sent;

          if (!(results.length === 0)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: "No Past Events Available"
          }));

        case 9:
          formattedEvents = results.map(function (event) {
            return {
              id: event.id,
              name: event.name,
              speaker: event.speaker,
              speaker_description: event.speaker_description,
              event_date: event.event_date,
              start_time: event.start_time,
              end_time: event.end_time,
              department: event.department,
              hall_name: event.hall_name,
              participants: event.participants,
              incharge_faculty: event.incharge_faculty,
              facility_needed: event.facility_needed,
              approvals: {
                hod: event.hod_approval === 1,
                academic_coordinator: event.academic_coordinator_approval === 1,
                principal: event.principal_approval === 1
              }
            };
          });
          res.json(formattedEvents);
          _context7.next = 17;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](3);
          console.error('Error fetching past events:', _context7.t0);
          res.status(500).json({
            error: 'Server error occurred'
          });

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 13]]);
});
router.get('/upcoming-events', function _callee8(req, res) {
  var sql, results, formattedEvents;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("request got");
          sql = "\n    SELECT *\n    FROM hall_allotment\n    WHERE \n      (\n        event_date > CURDATE()\n        OR (event_date = CURDATE() AND start_time > CURTIME()) \n        OR (event_date = CURDATE() AND end_time >= CURTIME() AND start_time <= CURTIME())  \n      )\n    ORDER BY event_date, start_time;\n  ";
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(query(sql));

        case 5:
          results = _context8.sent;

          if (!(results.length === 0)) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: "No upcoming events found"
          }));

        case 8:
          formattedEvents = results.map(function (event) {
            return {
              id: event.id,
              name: event.name,
              speaker: event.speaker,
              speaker_description: event.speaker_description,
              date: event.event_date,
              from: event.start_time,
              to: event.end_time,
              event_date: event.event_date,
              start_time: event.start_time,
              end_time: event.end_time,
              department: event.department,
              hall_name: event.hall_name,
              participants: event.participants,
              incharge_faculty: event.incharge_faculty,
              facility_needed: event.facility_needed,
              approvals: {
                hod: event.hod_approval === 1,
                academic_coordinator: event.academic_coordinator_approval === 1,
                principal: event.principal_approval === 1
              }
            };
          });
          res.json(formattedEvents);
          _context8.next = 16;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](2);
          console.error('Error fetching upcoming events:', _context8.t0);
          res.status(500).json({
            error: 'Server error occurred'
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 12]]);
});
router.put('/approveEvent', function _callee9(req, res) {
  var _req$body4, eventId, userType, sql;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body4 = req.body, eventId = _req$body4.eventId, userType = _req$body4.userType;
          sql = "UPDATE hall_request SET `".concat(userType, "_approval` = 1 WHERE id = ?");
          _context9.next = 4;
          return regeneratorRuntime.awrap(query(sql, [eventId], function (err, result) {
            if (err) {
              console.error('Error updating approval:', err);
              res.status(500).json({
                error: 'Error updating approval'
              });
            } else {
              console.log("".concat(userType, " approval updated for event ID ").concat(eventId));
              res.status(200).json({
                message: 'Approval updated successfully'
              });
            }
          }));

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
});
router.post('/addToHallAllotment', function _callee10(req, res) {
  var data, sql;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("THE REQUESTEDD BODY IS " + req.body);
          data = req.body;
          delete data.approvals;
          delete data.emails;
          sql = "INSERT INTO hall_allotment SET ?";
          _context10.next = 7;
          return regeneratorRuntime.awrap(query(sql, [data], function (err, result) {
            if (err) {
              console.error('Error adding to hall allotment:', err);
              res.status(500).json({
                error: 'Error adding to hall allotment'
              });
            } else {
              console.log('Event added to hall allotment');
              res.status(200).json({
                message: 'Event added to hall allotment successfully'
              });
            }
          }));

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
});
router["delete"]('/deletehallrequest/:id', function _callee11(req, res) {
  var id, sql, results;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          id = req.params.id;
          sql = 'DELETE FROM hall_request WHERE id = ?';
          _context11.prev = 2;
          _context11.next = 5;
          return regeneratorRuntime.awrap(query(sql, [id]));

        case 5:
          results = _context11.sent;

          if (!(results.affectedRows === 0)) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Hall request not found'
          }));

        case 8:
          res.status(200).json({
            message: 'Hall request deleted successfully'
          });
          _context11.next = 15;
          break;

        case 11:
          _context11.prev = 11;
          _context11.t0 = _context11["catch"](2);
          console.error('Error deleting hall request:', _context11.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 15:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[2, 11]]);
});
module.exports = router;