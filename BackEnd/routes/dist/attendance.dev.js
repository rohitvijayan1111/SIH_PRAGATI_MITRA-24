"use strict";

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

dayjs.extend(utc);
dayjs.extend(timezone);

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
router.post('/addabsent', function _callee(req, res) {
  var data, existingRecord, studentDetails, year, studentDepartment, studentType, insertQuery, updateField, updateQuery, staffDetails, staffDepartment, _insertQuery, _updateQuery;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = req.body;
          console.log('Received data:', data);

          if (data) {
            _context.next = 5;
            break;
          }

          console.error('Data is required');
          return _context.abrupt("return", res.status(400).json({
            error: 'Data is required'
          }));

        case 5:
          _context.prev = 5;

          if (!data.student_id) {
            _context.next = 13;
            break;
          }

          console.log('Processing student_id:', data.student_id);
          _context.next = 10;
          return regeneratorRuntime.awrap(query('SELECT * FROM absent_attendance_records WHERE student_id = ? AND attendance_date = ?', [data.student_id, data.attendance_date]));

        case 10:
          existingRecord = _context.sent;
          _context.next = 22;
          break;

        case 13:
          if (!data.staff_id) {
            _context.next = 20;
            break;
          }

          console.log('Processing staff_id:', data.staff_id);
          _context.next = 17;
          return regeneratorRuntime.awrap(query('SELECT * FROM absent_attendance_records WHERE staff_id = ? AND attendance_date = ?', [data.staff_id, data.attendance_date]));

        case 17:
          existingRecord = _context.sent;
          _context.next = 22;
          break;

        case 20:
          console.error('Invalid data format');
          return _context.abrupt("return", res.status(400).json({
            error: 'Invalid data format'
          }));

        case 22:
          if (!(existingRecord && existingRecord.length > 0)) {
            _context.next = 25;
            break;
          }

          console.log('Record already exists:', existingRecord);
          return _context.abrupt("return", res.status(400).json({
            error: 'Record already exists for this date and user'
          }));

        case 25:
          if (!data.student_id) {
            _context.next = 56;
            break;
          }

          _context.next = 28;
          return regeneratorRuntime.awrap(query('SELECT year, department, studentType FROM students WHERE id = ?', [data.student_id]));

        case 28:
          studentDetails = _context.sent;

          if (!(!studentDetails || studentDetails.length === 0)) {
            _context.next = 32;
            break;
          }

          console.error('Student not found or missing year/department information');
          return _context.abrupt("return", res.status(404).json({
            error: 'Student not found or missing year/department information'
          }));

        case 32:
          year = studentDetails[0].year;
          studentDepartment = studentDetails[0].department;
          studentType = studentDetails[0].studentType;

          if (!(!year || !studentDepartment)) {
            _context.next = 38;
            break;
          }

          console.error('Year or department information missing for the student');
          return _context.abrupt("return", res.status(404).json({
            error: 'Year or department information missing for the student'
          }));

        case 38:
          console.log("Student Department is " + studentDepartment);
          console.log("Data department is " + data.department_name);

          if (!(studentDepartment.toLowerCase() !== data.department_name.toLowerCase())) {
            _context.next = 43;
            break;
          }

          console.error('Department mismatch for student');
          return _context.abrupt("return", res.status(400).json({
            error: "Student is not part of your Department"
          }));

        case 43:
          // Add the studentType to the data to be inserted
          data.studentType = studentType;
          console.log('Data to insert:', data);
          insertQuery = 'INSERT INTO absent_attendance_records SET ?';
          console.log('Executing insert query:', insertQuery, data);
          _context.next = 49;
          return regeneratorRuntime.awrap(query(insertQuery, data));

        case 49:
          updateField = "todayabsentcount_year_".concat(year);
          updateQuery = "\n                UPDATE MemberCount \n                SET ".concat(updateField, " = ").concat(updateField, " + 1 \n                WHERE department_name = ?");
          console.log('Executing query:', updateQuery);
          _context.next = 54;
          return regeneratorRuntime.awrap(query(updateQuery, [data.department_name]));

        case 54:
          _context.next = 79;
          break;

        case 56:
          if (!data.staff_id) {
            _context.next = 79;
            break;
          }

          _context.next = 59;
          return regeneratorRuntime.awrap(query('SELECT department FROM staffs WHERE id = ?', [data.staff_id]));

        case 59:
          staffDetails = _context.sent;

          if (!(!staffDetails || staffDetails.length === 0)) {
            _context.next = 63;
            break;
          }

          console.error('Staff not found or missing department information');
          return _context.abrupt("return", res.status(404).json({
            error: 'Staff not found or missing department information'
          }));

        case 63:
          staffDepartment = staffDetails[0].department;

          if (staffDepartment) {
            _context.next = 67;
            break;
          }

          console.error('Department information missing for the staff');
          return _context.abrupt("return", res.status(404).json({
            error: "Staff is not part of your Department"
          }));

        case 67:
          if (!(staffDepartment.toLowerCase() !== data.department_name.toLowerCase())) {
            _context.next = 70;
            break;
          }

          console.error('Department mismatch for staff');
          return _context.abrupt("return", res.status(400).json({
            error: 'Department mismatch for staff'
          }));

        case 70:
          console.log('Data to insert:', data);
          _insertQuery = 'INSERT INTO absent_attendance_records SET ?';
          console.log('Executing insert query:', _insertQuery, data);
          _context.next = 75;
          return regeneratorRuntime.awrap(query(_insertQuery, data));

        case 75:
          _updateQuery = "\n                UPDATE MemberCount \n                SET todayabsentcount_staff = todayabsentcount_staff + 1 \n                WHERE department_name = ?";
          console.log('Executing query:', _updateQuery);
          _context.next = 79;
          return regeneratorRuntime.awrap(query(_updateQuery, [data.department_name]));

        case 79:
          res.json({
            message: 'Record inserted and count updated successfully'
          });
          _context.next = 86;
          break;

        case 82:
          _context.prev = 82;
          _context.t0 = _context["catch"](5);
          console.error('Error inserting record or updating count:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 86:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 82]]);
});

function getStudentYear(student_id) {
  var result;
  return regeneratorRuntime.async(function getStudentYear$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(query('SELECT year FROM students WHERE id = ?', [student_id]));

        case 2:
          result = _context2.sent;
          return _context2.abrupt("return", result.length > 0 ? result[0].year : null);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

router.post('/removeabsent', function _callee2(req, res) {
  var _req$body, date, rollnumber, userGroup, department_name, column, checkQuery, records, userDepartment, studentDetails, staffDetails, studentYear, updateField, decrementQuery, _decrementQuery, deleteResult;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, date = _req$body.date, rollnumber = _req$body.rollnumber, userGroup = _req$body.userGroup, department_name = _req$body.department_name;

          if (!(!date || !rollnumber || !userGroup || !department_name)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Date, Roll Number, User Group, and Department Name are required'
          }));

        case 3:
          if (!isNaN(new Date(date).getTime())) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Invalid date format'
          }));

        case 5:
          if (!(typeof rollnumber !== 'string' || rollnumber.trim() === '')) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Invalid roll number'
          }));

        case 7:
          if (['Student', 'Staff'].includes(userGroup)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Invalid user group'
          }));

        case 9:
          if (!(typeof department_name !== 'string' || department_name.trim() === '')) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Invalid department name'
          }));

        case 11:
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          _context3.prev = 12;
          // Check if the record exists
          checkQuery = "SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?");
          _context3.next = 16;
          return regeneratorRuntime.awrap(query(checkQuery, [date, rollnumber]));

        case 16:
          records = _context3.sent;

          if (!(records.length === 0)) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Attendance record not found'
          }));

        case 19:
          if (!(userGroup === 'Student')) {
            _context3.next = 28;
            break;
          }

          _context3.next = 22;
          return regeneratorRuntime.awrap(query('SELECT department FROM students WHERE id = ?', [rollnumber]));

        case 22:
          studentDetails = _context3.sent;

          if (!(!studentDetails || studentDetails.length === 0)) {
            _context3.next = 25;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Student not found or missing department information'
          }));

        case 25:
          userDepartment = studentDetails[0].department;
          _context3.next = 35;
          break;

        case 28:
          if (!(userGroup === 'Staff')) {
            _context3.next = 35;
            break;
          }

          _context3.next = 31;
          return regeneratorRuntime.awrap(query('SELECT department FROM staff WHERE id = ?', [rollnumber]));

        case 31:
          staffDetails = _context3.sent;

          if (!(!staffDetails || staffDetails.length === 0)) {
            _context3.next = 34;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Staff not found or missing department information'
          }));

        case 34:
          userDepartment = staffDetails[0].department;

        case 35:
          if (!(userDepartment.toLowerCase() !== department_name.toLowerCase())) {
            _context3.next = 37;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Department mismatch for user'
          }));

        case 37:
          _context3.next = 39;
          return regeneratorRuntime.awrap(query('START TRANSACTION'));

        case 39:
          if (!(userGroup === 'Student')) {
            _context3.next = 53;
            break;
          }

          _context3.next = 42;
          return regeneratorRuntime.awrap(getStudentYear(rollnumber));

        case 42:
          studentYear = _context3.sent;

          if (studentYear) {
            _context3.next = 47;
            break;
          }

          _context3.next = 46;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 46:
          return _context3.abrupt("return", res.status(404).json({
            error: 'Student year not found'
          }));

        case 47:
          updateField = "todayabsentcount_year_".concat(studentYear);
          decrementQuery = "\n                UPDATE MemberCount \n                SET ".concat(updateField, " = ").concat(updateField, " - 1 \n                WHERE department_name = ?");
          _context3.next = 51;
          return regeneratorRuntime.awrap(query(decrementQuery, [department_name]));

        case 51:
          _context3.next = 57;
          break;

        case 53:
          if (!(userGroup === 'Staff')) {
            _context3.next = 57;
            break;
          }

          _decrementQuery = "\n                UPDATE MemberCount \n                SET todayabsentcount_staff = todayabsentcount_staff - 1 \n                WHERE department_name = ?";
          _context3.next = 57;
          return regeneratorRuntime.awrap(query(_decrementQuery, [department_name]));

        case 57:
          _context3.next = 59;
          return regeneratorRuntime.awrap(query("DELETE FROM absent_attendance_records WHERE attendance_date=? AND ".concat(column, "=?"), [date, rollnumber]));

        case 59:
          deleteResult = _context3.sent;

          if (!(deleteResult.affectedRows === 0)) {
            _context3.next = 64;
            break;
          }

          _context3.next = 63;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 63:
          return _context3.abrupt("return", res.status(404).json({
            error: 'Record not found'
          }));

        case 64:
          _context3.next = 66;
          return regeneratorRuntime.awrap(query('COMMIT'));

        case 66:
          res.json({
            message: 'Record removed successfully'
          });
          _context3.next = 75;
          break;

        case 69:
          _context3.prev = 69;
          _context3.t0 = _context3["catch"](12);
          console.error('Error removing record:', _context3.t0);
          _context3.next = 74;
          return regeneratorRuntime.awrap(query('ROLLBACK'));

        case 74:
          res.status(500).json({
            error: 'Error removing record'
          });

        case 75:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[12, 69]]);
});
router.post('/getindividual', function _callee3(req, res) {
  var _req$body2, rollnumber, userGroup, department, column, userTable, departmentCheckQuery, departmentCheckParams, departmentCheckResult, _departmentCheckResul, name, studentType, year, attendanceQuery, attendanceResult, response;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, rollnumber = _req$body2.rollnumber, userGroup = _req$body2.userGroup, department = _req$body2.department;

          if (!(!rollnumber || !userGroup || !department)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Roll Number, User Group, and Department are required'
          }));

        case 3:
          column = userGroup === 'Student' ? 'student_id' : 'staff_id';
          userTable = userGroup === 'Student' ? 'students' : 'staffs';
          _context4.prev = 5;
          departmentCheckQuery = '';
          departmentCheckParams = [];

          if (department !== 'All') {
            departmentCheckQuery = "SELECT id, name, studentType, year FROM ".concat(userTable, " WHERE id = ? AND department = ?");
            departmentCheckParams = [rollnumber, department];
          } else {
            departmentCheckQuery = "SELECT id, name, studentType, year FROM ".concat(userTable, " WHERE id = ?");
            departmentCheckParams = [rollnumber];
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(query(departmentCheckQuery, departmentCheckParams));

        case 11:
          departmentCheckResult = _context4.sent;

          if (!(departmentCheckResult.length === 0)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "".concat(userGroup, " doesn't belong to your department or doesn't exist")
          }));

        case 14:
          // Extract student details
          _departmentCheckResul = departmentCheckResult[0], name = _departmentCheckResul.name, studentType = _departmentCheckResul.studentType, year = _departmentCheckResul.year; // Fetch attendance records

          attendanceQuery = "SELECT * FROM absent_attendance_records WHERE ".concat(column, " = ?");
          _context4.next = 18;
          return regeneratorRuntime.awrap(query(attendanceQuery, [rollnumber]));

        case 18:
          attendanceResult = _context4.sent;

          if (!(attendanceResult.length === 0)) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'No Absent Record Exists For The Given Roll Number'
          }));

        case 21:
          // Combine attendance records with student details
          response = {
            name: name,
            studentType: studentType,
            year: year,
            attendanceRecords: attendanceResult
          };
          res.json(response);
          _context4.next = 29;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](5);
          console.error('Error fetching data:', _context4.t0);
          res.status(500).json({
            error: 'Error fetching data'
          });

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 25]]);
});
router.post('/fetchtoday', function _callee4(req, res) {
  var userGroup, department, timeZone, currentDate, formattedDate, queryStr, params, results;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Received request body:', req.body);
          userGroup = req.body.selectedUserGroup;
          department = req.body.department;
          timeZone = 'Asia/Kolkata';
          currentDate = dayjs().tz(timeZone);
          formattedDate = currentDate.format('YYYY-MM-DD');

          if (!(!userGroup || !department)) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'User Group and Department are required'
          }));

        case 8:
          if (!(department === "All")) {
            _context5.next = 22;
            break;
          }

          if (!(userGroup === 'Student')) {
            _context5.next = 14;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    s.studentType AS studentType, -- Include studentType\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context5.next = 20;
          break;

        case 14:
          if (!(userGroup === 'Staff')) {
            _context5.next = 19;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context5.next = 20;
          break;

        case 19:
          return _context5.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 20:
          _context5.next = 33;
          break;

        case 22:
          if (!(userGroup === 'Student')) {
            _context5.next = 27;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.parent_mail AS parent_mail,\n                    s.studentType AS studentType, -- Include studentType\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department = ?;\n            ";
          params = [formattedDate, department];
          _context5.next = 33;
          break;

        case 27:
          if (!(userGroup === 'Staff')) {
            _context5.next = 32;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    st.email AS staff_mail,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department = ?;\n            ";
          params = [formattedDate, department];
          _context5.next = 33;
          break;

        case 32:
          return _context5.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 33:
          console.log('Executing query:', queryStr);
          console.log('With params:', params);
          _context5.prev = 35;
          _context5.next = 38;
          return regeneratorRuntime.awrap(query(queryStr, params));

        case 38:
          results = _context5.sent;

          if (!(!results || results.length === 0)) {
            _context5.next = 41;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "No ".concat(userGroup, "s Are Absent")
          }));

        case 41:
          res.json({
            message: 'Records fetched successfully',
            data: results
          });
          _context5.next = 48;
          break;

        case 44:
          _context5.prev = 44;
          _context5.t0 = _context5["catch"](35);
          console.error('Error fetching records:', _context5.t0);
          res.status(500).json({
            error: 'Error fetching records'
          });

        case 48:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[35, 44]]);
});
router.post('/fetchdatedata', function _callee5(req, res) {
  var userGroup, currentdate, department, formattedDate2, formattedDate, queryStr, params, results;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('Received request body:', req.body);
          userGroup = req.body.selectedUserGroup;
          currentdate = req.body.date;
          console.log('Received request body:', req.body);
          department = req.body.department;
          formattedDate2 = req.body.date2;
          formattedDate = currentdate;

          if (!(!userGroup || !department)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'User Group is required'
          }));

        case 9:
          if (!(department === "All")) {
            _context6.next = 23;
            break;
          }

          if (!(userGroup === 'Student')) {
            _context6.next = 15;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.studentType AS studentType,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context6.next = 21;
          break;

        case 15:
          if (!(userGroup === 'Staff')) {
            _context6.next = 20;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department IS NOT NULL;\n            ";
          params = [formattedDate];
          _context6.next = 21;
          break;

        case 20:
          return _context6.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 21:
          _context6.next = 34;
          break;

        case 23:
          if (!(userGroup === 'Student')) {
            _context6.next = 28;
            break;
          }

          queryStr = "\n                SELECT \n                    s.name AS name,\n                    s.academic_year AS academic_year,\n                    s.department AS dept,\n                    s.studentType AS studentType,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                    \n                FROM students s\n                INNER JOIN absent_attendance_records a ON s.id = a.student_id\n                WHERE a.attendance_date = ? AND s.department = ?;\n            ";
          params = [formattedDate, department];
          _context6.next = 34;
          break;

        case 28:
          if (!(userGroup === 'Staff')) {
            _context6.next = 33;
            break;
          }

          queryStr = "\n                SELECT \n                    st.name AS name,\n                    st.department AS dept,\n                    a.reason AS Reason,\n                    a.leave_type AS Leave_Type\n                FROM staffs st\n                INNER JOIN absent_attendance_records a ON st.id = a.staff_id\n                WHERE a.attendance_date = ? AND st.department = ?;\n            ";
          params = [formattedDate, department];
          _context6.next = 34;
          break;

        case 33:
          return _context6.abrupt("return", res.status(400).json({
            error: 'Invalid User Group'
          }));

        case 34:
          console.log('Executing query:', queryStr);
          console.log('With params:', params);
          _context6.prev = 36;
          _context6.next = 39;
          return regeneratorRuntime.awrap(query(queryStr, params));

        case 39:
          results = _context6.sent;

          if (!(!results || results.length === 0)) {
            _context6.next = 42;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "No ".concat(userGroup, "s Were Absent On ").concat(formattedDate2)
          }));

        case 42:
          res.json({
            message: 'Records fetched successfully',
            data: results
          });
          _context6.next = 49;
          break;

        case 45:
          _context6.prev = 45;
          _context6.t0 = _context6["catch"](36);
          console.error('Error fetching records:', _context6.t0);
          res.status(500).json({
            error: 'Error fetching records'
          });

        case 49:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[36, 45]]);
});
router.post('/attendance-summary', function _callee6(req, res) {
  var _req$body3, user, type, department, results, data, row;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body3 = req.body, user = _req$body3.user, type = _req$body3.type, department = _req$body3.department;
          console.log(req.body);

          if (department) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Department is required'
          }));

        case 4:
          _context7.prev = 4;
          _context7.next = 7;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount WHERE department_name = ?', [department]));

        case 7:
          results = _context7.sent;

          if (!(results.length === 0)) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: 'Department not found'
          }));

        case 10:
          data = [];
          row = results[0];
          console.log("ROWWW IS");
          console.log(row);

          if (type === "All") {
            data = [{
              name: "I YR",
              present: row.year_I_count - row.todayabsentcount_year_I,
              absent: row.todayabsentcount_year_I
            }, {
              name: "II YR",
              present: row.year_II_count - row.todayabsentcount_year_II,
              absent: row.todayabsentcount_year_II
            }, {
              name: "III YR",
              present: row.year_III_count - row.todayabsentcount_year_III,
              absent: row.todayabsentcount_year_III
            }, {
              name: "IV YR",
              present: row.year_IV_count - row.todayabsentcount_year_IV,
              absent: row.todayabsentcount_year_IV
            }, {
              name: 'Staff',
              present: row.staff_count - row.todayabsentcount_staff,
              absent: row.todayabsentcount_staff
            }];
          } else if (type === "Hostel") {
            data = [{
              name: "I YR",
              present: row.hostel_year_I_count - row.hostellercount_year_I,
              absent: row.hostel_year_I_count
            }, {
              name: "II YR",
              present: row.hostel_year_II_count - row.hostellercount_year_II,
              absent: row.hostel_year_II_count
            }, {
              name: "III YR",
              present: row.hostel_year_III_count - row.hostellercount_year_III,
              absent: row.hostel_year_III_count
            }, {
              name: "IV YR",
              present: row.hostel_year_IV_count - row.hostellercount_year_IV,
              absent: row.hostel_year_IV_count
            }, {
              name: 'Staff',
              present: row.staff_count - row.todayabsentcount_staff,
              absent: row.todayabsentcount_staff
            }];
          } else if (type === "Day Scholar") {
            data = [{
              name: "I YR",
              present: row.year_I_count - row.todayabsentcount_year_I - row.hostellercount_year_I,
              absent: row.todayabsentcount_year_I - row.hostellercount_year_I
            }, {
              name: "II YR",
              present: row.year_II_count - row.todayabsentcount_year_II - row.hostellercount_year_II,
              absent: row.todayabsentcount_year_II - row.hostellercount_year_II
            }, {
              name: "III YR",
              present: row.year_III_count - row.todayabsentcount_year_III - row.hostellercount_year_III,
              absent: row.todayabsentcount_year_III - row.hostellercount_year_III
            }, {
              name: "IV YR",
              present: row.year_IV_count - row.todayabsentcount_year_IV - row.hostellercount_year_IV,
              absent: row.todayabsentcount_year_IV - row.hostellercount_year_IV
            }, {
              name: 'Staff',
              present: row.staff_count - row.todayabsentcount_staff,
              absent: row.todayabsentcount_staff
            }];
          }

          console.log(type);
          console.log(data);
          res.json(data);
          _context7.next = 24;
          break;

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](4);
          console.error('Error fetching attendance summary:', _context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[4, 20]]);
});
router.post('/attendance-count-summary', function _callee7(req, res) {
  var _req$body4, type, user, department, results, row, total_student, absent_student, total_staff, absent_staff, hostel_total_student, hostel_absent_student, data;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body4 = req.body, type = _req$body4.type, user = _req$body4.user, department = _req$body4.department;

          if (department) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'Department is required'
          }));

        case 3:
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount WHERE department_name = ?', [department]));

        case 6:
          results = _context8.sent;

          if (!(results.length === 0)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: 'Department not found'
          }));

        case 9:
          row = results[0];
          total_student = row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
          absent_student = row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
          total_staff = row.staff_count;
          absent_staff = row.todayabsentcount_staff;
          hostel_total_student = row.hostel_year_I_count + row.hostel_year_II_count + row.hostel_year_III_count + row.hostel_year_IV_count;
          hostel_absent_student = row.hostellercount_year_I + row.hostellercount_year_II + row.hostellercount_year_III + row.hostellercount_year_IV;
          data = [];

          if (type == "All") {
            data = {
              Total_students: total_student,
              Student_Present: total_student - absent_student,
              Student_Absent: absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          } else if (type == "Hostel") {
            data = {
              Total_students: hostel_total_student,
              Student_Present: hostel_total_student - hostel_absent_student,
              Student_Absent: hostel_absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          } else if (type == "Day Scholar") {
            data = {
              Total_students: total_student - hostel_total_student,
              Student_Present: total_student - hostel_total_student - (absent_student - hostel_absent_student),
              Student_Absent: absent_student - hostel_absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          }

          res.json(data);
          _context8.next = 25;
          break;

        case 21:
          _context8.prev = 21;
          _context8.t0 = _context8["catch"](3);
          console.error('Error fetching attendance summary:', _context8.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 21]]);
});
router.post('/attendance-graph', function _callee8(req, res) {
  var _req$body5, user, type, department, column, typeCondition, results, currentDate, formattedDate, formattedResults;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body5 = req.body, user = _req$body5.user, type = _req$body5.type, department = _req$body5.department;
          console.log(req.body);

          if (!(!department || !user)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: 'Department and user type are required'
          }));

        case 4:
          typeCondition = '';

          if (user === 'Student') {
            column = "student_id"; // Add the type condition based on the value of 'type'

            if (type === 'Hostel') {
              typeCondition = "AND studentType = 'Hostel'";
            } else if (type === 'Day Scholar') {
              typeCondition = "AND studentType = 'Day Scholar'";
            } // If type is 'All', no additional condition is needed.

          } else {
            column = "staff_id";
          }

          _context9.prev = 6;
          _context9.next = 9;
          return regeneratorRuntime.awrap(query("SELECT date, total\n            FROM (\n                SELECT attendance_date as date, COUNT(*) as total \n                FROM absent_attendance_records \n                WHERE department_name = ? \n                AND ".concat(column, " IS NOT NULL \n                ").concat(typeCondition, " \n                GROUP BY attendance_date\n                ORDER BY attendance_date DESC\n                LIMIT 7\n            ) AS subquery\n            ORDER BY date ASC;\n            "), [department]));

        case 9:
          results = _context9.sent;
          console.log('Query results:', results);

          if (!(results.length === 0)) {
            _context9.next = 15;
            break;
          }

          currentDate = new Date();
          formattedDate = "".concat(currentDate.getDate(), "/").concat(currentDate.getMonth() + 1);
          return _context9.abrupt("return", res.json({
            name: formattedDate,
            absent: 0
          }));

        case 15:
          formattedResults = results.map(function (row) {
            var date = new Date(row.date);
            var formattedDate = "".concat(date.getDate(), "/").concat(date.getMonth() + 1);
            return {
              name: formattedDate,
              absent: row.total
            };
          });
          res.json(formattedResults);
          _context9.next = 23;
          break;

        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](6);
          console.error('Error fetching attendance summary:', _context9.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[6, 19]]);
});
router.post('/admin-attendance-summary', function _callee9(req, res) {
  var _req$body6, user, type, department, queryStr, presentField, absentField, results, data;

  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body6 = req.body, user = _req$body6.user, type = _req$body6.type, department = _req$body6.department;

          if (user) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            error: 'User type is required'
          }));

        case 3:
          if (!(user.toLowerCase() === 'student')) {
            _context10.next = 7;
            break;
          }

          if (type === "All") {
            queryStr = "\n                SELECT \n                    department_name, \n                    (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_students, \n                    (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) AS total_absent_students\n                FROM membercount \n                GROUP BY department_name\n            ";
            presentField = 'total_students';
            absentField = 'total_absent_students';
          } else if (type === "Hostel") {
            queryStr = "\n                SELECT \n                    department_name, \n                    (SUM(hostel_year_I_count) + SUM(hostel_year_II_count) + SUM(hostel_year_III_count) + SUM(hostel_year_IV_count)) AS total_hostel_students, \n                    (SUM(hostellercount_year_I) + SUM(hostellercount_year_II) + SUM(hostellercount_year_III) + SUM(hostellercount_year_IV)) AS total_absent_hostel_students\n                FROM membercount \n                GROUP BY department_name\n            ";
            presentField = 'total_hostel_students';
            absentField = 'total_absent_hostel_students';
          } else if (type === "Day Scholar") {
            queryStr = "\n                SELECT \n                    department_name, \n                    (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_day_scholar_students, \n                    (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) -\n                    (SUM(hostellercount_year_I) + SUM(hostellercount_year_II) + SUM(hostellercount_year_III) + SUM(hostellercount_year_IV)) AS total_absent_day_scholar_students\n                FROM membercount \n                GROUP BY department_name\n            ";
            presentField = 'total_day_scholar_students';
            absentField = 'total_absent_day_scholar_students';
          }

          _context10.next = 14;
          break;

        case 7:
          if (!(user.toLowerCase() === 'faculty')) {
            _context10.next = 13;
            break;
          }

          queryStr = "\n            SELECT \n                department_name, \n                SUM(staff_count) AS total_staff, \n                SUM(todayabsentcount_staff) AS total_absent_staff\n            FROM membercount \n            GROUP BY department_name\n        ";
          presentField = 'total_staff';
          absentField = 'total_absent_staff';
          _context10.next = 14;
          break;

        case 13:
          return _context10.abrupt("return", res.status(400).json({
            error: 'Invalid user type'
          }));

        case 14:
          _context10.prev = 14;
          _context10.next = 17;
          return regeneratorRuntime.awrap(query(queryStr));

        case 17:
          results = _context10.sent;

          if (!(results.length === 0)) {
            _context10.next = 20;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            error: 'No departments found'
          }));

        case 20:
          data = results.map(function (row) {
            return {
              name: row.department_name,
              present: row[presentField] - row[absentField],
              absent: row[absentField]
            };
          });
          res.json(data);
          _context10.next = 28;
          break;

        case 24:
          _context10.prev = 24;
          _context10.t0 = _context10["catch"](14);
          console.error('Error fetching attendance summary:', _context10.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 28:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[14, 24]]);
});
router.post('/admin-attendance-count-summary', function _callee10(req, res) {
  var type, results, total_student, absent_student, total_staff, absent_staff, hostel_total_student, hostel_absent_student, data;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          type = req.body.type;
          _context11.prev = 1;
          console.log("INNN");
          _context11.next = 5;
          return regeneratorRuntime.awrap(query('SELECT * FROM membercount'));

        case 5:
          results = _context11.sent;

          if (!(results.length === 0)) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            error: 'No departments found'
          }));

        case 8:
          total_student = 0;
          absent_student = 0;
          total_staff = 0;
          absent_staff = 0;
          hostel_total_student = 0;
          hostel_absent_student = 0;
          results.forEach(function (row) {
            total_student += row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
            absent_student += row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
            total_staff += row.staff_count;
            absent_staff += row.todayabsentcount_staff;
            hostel_total_student += row.hostel_year_I_count + row.hostel_year_II_count + row.hostel_year_III_count + row.hostel_year_IV_count;
            hostel_absent_student += row.hostellercount_year_I + row.hostellercount_year_II + row.hostellercount_year_III + row.hostellercount_year_IV;
          });
          data = {};

          if (type === "All") {
            data = {
              Total_students: total_student,
              Student_Present: total_student - absent_student,
              Student_Absent: absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          } else if (type === "Hostel") {
            data = {
              Total_students: hostel_total_student,
              Student_Present: hostel_total_student - hostel_absent_student,
              Student_Absent: hostel_absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          } else if (type === "Day Scholar") {
            data = {
              Total_students: total_student - hostel_total_student,
              Student_Present: total_student - hostel_total_student - (absent_student - hostel_absent_student),
              Student_Absent: absent_student - hostel_absent_student,
              Total_staff: total_staff,
              Staff_Present: total_staff - absent_staff,
              Staff_Absent: absent_staff
            };
          }

          res.json(data);
          _context11.next = 24;
          break;

        case 20:
          _context11.prev = 20;
          _context11.t0 = _context11["catch"](1);
          console.error('Error fetching attendance summary:', _context11.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 24:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[1, 20]]);
});
router.post('/admin-attendance-graph', function _callee11(req, res) {
  var _req$body7, user, type, column, typeCondition, results, currentDate, formattedDate, formattedResults;

  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body7 = req.body, user = _req$body7.user, type = _req$body7.type; // Extract type from req.body

          console.log(req.body);

          if (user) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            error: 'User type is required'
          }));

        case 4:
          typeCondition = '';

          if (user === 'Student') {
            column = "student_id"; // Add the type condition based on the value of 'type'

            if (type === 'Hostel') {
              typeCondition = "AND studentType = 'Hostel'";
            } else if (type === 'Day Scholar') {
              typeCondition = "AND studentType = 'Day Scholar'";
            } // If type is 'All', no additional condition is needed.

          } else {
            column = "staff_id";
          }

          _context12.prev = 6;
          _context12.next = 9;
          return regeneratorRuntime.awrap(query("SELECT date, total\n            FROM (\n                SELECT attendance_date AS date, COUNT(*) AS total\n                FROM absent_attendance_records\n                WHERE ".concat(column, " IS NOT NULL\n                ").concat(typeCondition, "\n                GROUP BY attendance_date\n                ORDER BY attendance_date DESC\n                LIMIT 7\n            ) AS subquery\n            ORDER BY date ASC;\n            ")));

        case 9:
          results = _context12.sent;
          console.log('Query results:', results);

          if (!(results.length === 0)) {
            _context12.next = 15;
            break;
          }

          currentDate = new Date();
          formattedDate = "".concat(currentDate.getDate(), "/").concat(currentDate.getMonth() + 1);
          return _context12.abrupt("return", res.json({
            name: formattedDate,
            absent: 0
          }));

        case 15:
          formattedResults = results.map(function (row) {
            var date = new Date(row.date);
            var formattedDate = "".concat(date.getDate(), "/").concat(date.getMonth() + 1);
            return {
              name: formattedDate,
              absent: row.total
            };
          });
          res.json(formattedResults);
          _context12.next = 23;
          break;

        case 19:
          _context12.prev = 19;
          _context12.t0 = _context12["catch"](6);
          console.error('Error fetching attendance summary:', _context12.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 23:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[6, 19]]);
});
router.post('/getname', function _callee12(req, res) {
  var _req$body8, userId, userType, table, queryStr, result;

  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body8 = req.body, userId = _req$body8.userId, userType = _req$body8.userType;
          console.log(req.body);

          if (!(!userId || !userType)) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: 'User ID and User Type are required'
          }));

        case 4:
          if (['student', 'staff'].includes(userType)) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: 'Invalid User Type'
          }));

        case 6:
          table = userType === 'student' ? 'students' : 'staffs';
          _context13.prev = 7;
          queryStr = "SELECT name FROM ".concat(table, " WHERE id = ?");
          _context13.next = 11;
          return regeneratorRuntime.awrap(query(queryStr, [userId]));

        case 11:
          result = _context13.sent;

          if (!(result.length === 0)) {
            _context13.next = 14;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            error: "".concat(userType, " not found")
          }));

        case 14:
          res.json({
            data: result[0]
          });
          _context13.next = 21;
          break;

        case 17:
          _context13.prev = 17;
          _context13.t0 = _context13["catch"](7);
          console.error('Error fetching user data:', _context13.t0);
          res.status(500).json({
            error: getFriendlyErrorMessage(_context13.t0.code)
          });

        case 21:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[7, 17]]);
});
module.exports = router;