const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const { request } = require('http');

dayjs.extend(utc);
dayjs.extend(timezone);

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

router.post('/addabsent', async (req, res) => {
    const data = req.body;
    console.log('Received data:', data);

    if (!data) {
        console.error('Data is required');
        return res.status(400).json({ error: 'Data is required' });
    }

    try {
        let existingRecord;

        if (data.student_id) {
            console.log('Processing student_id:', data.student_id);
            existingRecord = await query('SELECT * FROM absent_attendance_records WHERE student_id = ? AND attendance_date = ?', [data.student_id, data.attendance_date]);
        } else if (data.staff_id) {
            console.log('Processing staff_id:', data.staff_id);
            existingRecord = await query('SELECT * FROM absent_attendance_records WHERE staff_id = ? AND attendance_date = ?', [data.staff_id, data.attendance_date]);
        } else {
            console.error('Invalid data format');
            return res.status(400).json({ error: 'Invalid data format' });
        }

        if (existingRecord && existingRecord.length > 0) {
            console.log('Record already exists:', existingRecord);
            return res.status(400).json({ error: 'Record already exists for this date and user' });
        }

        if (data.student_id) {
            const studentDetails = await query('SELECT year, department, studentType FROM students WHERE id = ?', [data.student_id]);

            if (!studentDetails || studentDetails.length === 0) {
                console.error('Student not found or missing year/department information');
                return res.status(404).json({ error: 'Student not found or missing year/department information' });
            }

            const year = studentDetails[0].year;
            const studentDepartment = studentDetails[0].department;
            const studentType = studentDetails[0].studentType;

            if (!year || !studentDepartment) {
                console.error('Year or department information missing for the student');
                return res.status(404).json({ error: 'Year or department information missing for the student' });
            }

            console.log("Student Department is " + studentDepartment);
            console.log("Data department is " + data.department_name);
            if (studentDepartment.toLowerCase() !== data.department_name.toLowerCase()) {
                console.error('Department mismatch for student');
                return res.status(400).json({ error: `Student is not part of your Department` });
            }

            // Add the studentType to the data to be inserted
            data.studentType = studentType;

            console.log('Data to insert:', data);
            const insertQuery = 'INSERT INTO absent_attendance_records SET ?';
            console.log('Executing insert query:', insertQuery, data);
            await query(insertQuery, data);

            const updateField = `todayabsentcount_year_${year}`;
            const updateQuery = `
                UPDATE MemberCount 
                SET ${updateField} = ${updateField} + 1 
                WHERE department_name = ?`;
            console.log('Executing query:', updateQuery);
            await query(updateQuery, [data.department_name]);

        } else if (data.staff_id) {
            const staffDetails = await query('SELECT department FROM staffs WHERE id = ?', [data.staff_id]);

            if (!staffDetails || staffDetails.length === 0) {
                console.error('Staff not found or missing department information');
                return res.status(404).json({ error: 'Staff not found or missing department information' });
            }

            const staffDepartment = staffDetails[0].department;

            if (!staffDepartment) {
                console.error('Department information missing for the staff');
                return res.status(404).json({ error: `Staff is not part of your Department` });
            }

            if (staffDepartment.toLowerCase() !== data.department_name.toLowerCase()) {
                console.error('Department mismatch for staff');
                return res.status(400).json({ error: 'Department mismatch for staff' });
            }

            console.log('Data to insert:', data);
            const insertQuery = 'INSERT INTO absent_attendance_records SET ?';
            console.log('Executing insert query:', insertQuery, data);
            await query(insertQuery, data);

            const updateQuery = `
                UPDATE MemberCount 
                SET todayabsentcount_staff = todayabsentcount_staff + 1 
                WHERE department_name = ?`;
            console.log('Executing query:', updateQuery);
            await query(updateQuery, [data.department_name]);
        }

        res.json({ message: 'Record inserted and count updated successfully' });
    } catch (error) {
        console.error('Error inserting record or updating count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getStudentYear(student_id) {
    const result = await query('SELECT year FROM students WHERE id = ?', [student_id]);
    return result.length > 0 ? result[0].year : null;
}

router.post('/removeabsent', async (req, res) => {
    const { date, rollnumber, userGroup, department_name } = req.body;

    if (!date || !rollnumber || !userGroup || !department_name) {
        return res.status(400).json({ error: 'Date, Roll Number, User Group, and Department Name are required' });
    }

    if (isNaN(new Date(date).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    if (typeof rollnumber !== 'string' || rollnumber.trim() === '') {
        return res.status(400).json({ error: 'Invalid roll number' });
    }

    if (!['Student', 'Staff'].includes(userGroup)) {
        return res.status(400).json({ error: 'Invalid user group' });
    }

    if (typeof department_name !== 'string' || department_name.trim() === '') {
        return res.status(400).json({ error: 'Invalid department name' });
    }

    const column = userGroup === 'Student' ? 'student_id' : 'staff_id';

    try {
        // Check if the record exists
        const checkQuery = `SELECT * FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`;
        const records = await query(checkQuery, [date, rollnumber]);

        if (records.length === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        // Retrieve department for student or staff
        let userDepartment;
        if (userGroup === 'Student') {
            const studentDetails = await query('SELECT department FROM students WHERE id = ?', [rollnumber]);

            if (!studentDetails || studentDetails.length === 0) {
                return res.status(404).json({ error: 'Student not found or missing department information' });
            }

            userDepartment = studentDetails[0].department;
        } else if (userGroup === 'Staff') {
            const staffDetails = await query('SELECT department FROM staff WHERE id = ?', [rollnumber]);

            if (!staffDetails || staffDetails.length === 0) {
                return res.status(404).json({ error: 'Staff not found or missing department information' });
            }

            userDepartment = staffDetails[0].department;
        }

        if (userDepartment.toLowerCase() !== department_name.toLowerCase()) {
            return res.status(400).json({ error: 'Department mismatch for user' });
        }

        await query('START TRANSACTION');

        // Update the member count
        if (userGroup === 'Student') {
            const studentYear = await getStudentYear(rollnumber);
            if (!studentYear) {
                await query('ROLLBACK');
                return res.status(404).json({ error: 'Student year not found' });
            }

            const updateField = `todayabsentcount_year_${studentYear}`;
            const decrementQuery = `
                UPDATE MemberCount 
                SET ${updateField} = ${updateField} - 1 
                WHERE department_name = ?`;
            await query(decrementQuery, [department_name]);

        } else if (userGroup === 'Staff') {
            const decrementQuery = `
                UPDATE MemberCount 
                SET todayabsentcount_staff = todayabsentcount_staff - 1 
                WHERE department_name = ?`;
            await query(decrementQuery, [department_name]);
        }

        // Delete the record
        const deleteResult = await query(`DELETE FROM absent_attendance_records WHERE attendance_date=? AND ${column}=?`, [date, rollnumber]);
        if (deleteResult.affectedRows === 0) {
            await query('ROLLBACK');
            return res.status(404).json({ error: 'Record not found' });
        }

        await query('COMMIT');
        res.json({ message: 'Record removed successfully' });

    } catch (error) {
        console.error('Error removing record:', error);
        await query('ROLLBACK');
        res.status(500).json({ error: 'Error removing record' });
    }
});

router.post('/getindividual', async (req, res) => {
    const { rollnumber, userGroup, department } = req.body;

    if (!rollnumber || !userGroup || !department) {
        return res.status(400).json({ error: 'Roll Number, User Group, and Department are required' });
    }

    const column = userGroup === 'Student' ? 'student_id' : 'staff_id';
    const userTable = userGroup === 'Student' ? 'students' : 'staffs';

    try {
        let departmentCheckQuery = '';
        let departmentCheckParams = [];

        if (department !== 'All') {
            departmentCheckQuery = `SELECT id, name, studentType, year FROM ${userTable} WHERE id = ? AND department = ?`;
            departmentCheckParams = [rollnumber, department];
        } else {
            departmentCheckQuery = `SELECT id, name, studentType, year FROM ${userTable} WHERE id = ?`;
            departmentCheckParams = [rollnumber];
        }

        const departmentCheckResult = await query(departmentCheckQuery, departmentCheckParams);

        if (departmentCheckResult.length === 0) {
            return res.status(400).json({ error: `${userGroup} doesn't belong to your department or doesn't exist` });
        }

        // Extract student details
        const { name, studentType, year } = departmentCheckResult[0];

        // Fetch attendance records
        const attendanceQuery = `SELECT * FROM absent_attendance_records WHERE ${column} = ?`;
        const attendanceResult = await query(attendanceQuery, [rollnumber]);

        if (attendanceResult.length === 0) {
            return res.status(400).json({ error: 'No Absent Record Exists For The Given Roll Number' });
        }

        // Combine attendance records with student details
        const response = {
            name,
            studentType,
            year,
            attendanceRecords: attendanceResult,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

router.post('/fetchtoday', async (req, res) => {
    console.log('Received request body:', req.body);
    const userGroup = req.body.selectedUserGroup;
    const department = req.body.department;
    const timeZone = 'Asia/Kolkata';
    const currentDate = dayjs().tz(timeZone);
    const formattedDate = currentDate.format('YYYY-MM-DD');
    if (!userGroup || !department) {
        return res.status(400).json({ error: 'User Group and Department are required' });
    }

    let queryStr, params;
    if (department === "All") {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    s.studentType AS studentType, -- Include studentType
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    } else {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.parent_mail AS parent_mail,
                    s.studentType AS studentType, -- Include studentType
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department = ?;
            `;
            params = [formattedDate, department];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    st.email AS staff_mail,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department = ?;
            `;
            params = [formattedDate, department];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    }

    console.log('Executing query:', queryStr);
    console.log('With params:', params);

    try {
        const results = await query(queryStr, params);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: `No ${userGroup}s Are Absent` });
        }

        res.json({ message: 'Records fetched successfully', data: results });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records' });
    }
});

router.post('/fetchdatedata', async (req, res) => {
    console.log('Received request body:', req.body);
    const userGroup = req.body.selectedUserGroup;
    const currentdate = req.body.date;
    console.log('Received request body:', req.body);
    const department = req.body.department;
    const formattedDate2=req.body.date2;
    const formattedDate = currentdate;
    if (!userGroup || !department) {
        return res.status(400).json({ error: 'User Group is required' });
    }

    let queryStr, params;
    if (department==="All") {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.studentType AS studentType,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department IS NOT NULL;
            `;
            params = [formattedDate];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    } else {
        if (userGroup === 'Student') {
            queryStr = `
                SELECT 
                    s.name AS name,
                    s.academic_year AS academic_year,
                    s.department AS dept,
                    s.studentType AS studentType,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                    
                FROM students s
                INNER JOIN absent_attendance_records a ON s.id = a.student_id
                WHERE a.attendance_date = ? AND s.department = ?;
            `;
            params = [formattedDate, department];
        } else if (userGroup === 'Staff') {
            queryStr = `
                SELECT 
                    st.name AS name,
                    st.department AS dept,
                    a.reason AS Reason,
                    a.leave_type AS Leave_Type
                FROM staffs st
                INNER JOIN absent_attendance_records a ON st.id = a.staff_id
                WHERE a.attendance_date = ? AND st.department = ?;
            `;
            params = [formattedDate, department];
        } else {
            return res.status(400).json({ error: 'Invalid User Group' });
        }
    }

    console.log('Executing query:', queryStr);
    console.log('With params:', params);

    try {
        const results = await query(queryStr, params);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: `No ${userGroup}s Were Absent On ${formattedDate2}` });
        }

        res.json({ message: 'Records fetched successfully', data: results });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records' });
    }
});
router.post('/attendance-summary', async (req, res) => {
    const { user, type, department } = req.body;
    console.log(req.body);

    if (!department) {
        return res.status(400).json({ error: 'Department is required' });
    }

    try {
        const results = await query('SELECT * FROM membercount WHERE department_name = ?', [department]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        let data = [];
        const row = results[0];
        console.log("ROWWW IS");
        console.log(row);
        if (type === "All") {
            data = [
                {
                    name: "I YR",
                    present: row.year_I_count - row.todayabsentcount_year_I,
                    absent: row.todayabsentcount_year_I,
                },
                {
                    name: "II YR",
                    present: row.year_II_count - row.todayabsentcount_year_II,
                    absent: row.todayabsentcount_year_II,
                },
                {
                    name: "III YR",
                    present: row.year_III_count - row.todayabsentcount_year_III,
                    absent: row.todayabsentcount_year_III,
                },
                {
                    name: "IV YR",
                    present: row.year_IV_count - row.todayabsentcount_year_IV,
                    absent: row.todayabsentcount_year_IV,
                },
                {
                    name: 'Staff',
                    present: row.staff_count - row.todayabsentcount_staff,
                    absent: row.todayabsentcount_staff
                }
            ];
        } else if (type ==="Hostel") {
            data = [
                {
                    name: "I YR",
                    present: row.hostel_year_I_count - row.hostellercount_year_I,
                    absent: row.hostel_year_I_count,
                },
                {
                    name: "II YR",
                    present: row.hostel_year_II_count - row.hostellercount_year_II,
                    absent: row.hostel_year_II_count,
                },
                {
                    name: "III YR",
                    present: row.hostel_year_III_count - row.hostellercount_year_III,
                    absent: row.hostel_year_III_count,
                },
                {
                    name: "IV YR",
                    present: row.hostel_year_IV_count - row.hostellercount_year_IV,
                    absent: row.hostel_year_IV_count,
                },
                {
                    name: 'Staff',
                    present: row.staff_count - row.todayabsentcount_staff,
                    absent: row.todayabsentcount_staff
                }
            ];
        } else if (type === "Day Scholar") {
            data = [
                {
                    name: "I YR",
                    present: row.year_I_count - row.todayabsentcount_year_I - row.hostellercount_year_I,
                    absent: row.todayabsentcount_year_I - row.hostellercount_year_I,
                },
                {
                    name: "II YR",
                    present: row.year_II_count - row.todayabsentcount_year_II - row.hostellercount_year_II,
                    absent: row.todayabsentcount_year_II - row.hostellercount_year_II,
                },
                {
                    name: "III YR",
                    present: row.year_III_count - row.todayabsentcount_year_III - row.hostellercount_year_III,
                    absent: row.todayabsentcount_year_III - row.hostellercount_year_III,
                },
                {
                    name: "IV YR",
                    present: row.year_IV_count - row.todayabsentcount_year_IV - row.hostellercount_year_IV,
                    absent: row.todayabsentcount_year_IV - row.hostellercount_year_IV,
                },
                {
                    name: 'Staff',
                    present: row.staff_count - row.todayabsentcount_staff,
                    absent: row.todayabsentcount_staff
                }
            ];
        }
        console.log(type);
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/attendance-count-summary', async (req, res) => {
    const {type,user,department } = req.body;
    
    if (!department) {
        return res.status(400).json({ error: 'Department is required' });
    }

    try {
        const results = await query('SELECT * FROM membercount WHERE department_name = ?', [department]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const row = results[0];

        const total_student = row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
        const absent_student = row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
        const total_staff = row.staff_count;
        const absent_staff = row.todayabsentcount_staff;
        const hostel_total_student=row.hostel_year_I_count+row.hostel_year_II_count+row.hostel_year_III_count+row.hostel_year_IV_count;
        const hostel_absent_student = row.hostellercount_year_I + row.hostellercount_year_II + row.hostellercount_year_III + row.hostellercount_year_IV;
        let data=[]
        if(type=="All"){ 
        data = {
            Total_students: total_student,
            Student_Present: total_student - absent_student,
            Student_Absent: absent_student,
            Total_staff: total_staff,
            Staff_Present: total_staff - absent_staff,
            Staff_Absent: absent_staff
        };
        }
        else if(type=="Hostel")
        {
            data = {
                Total_students:hostel_total_student,
                Student_Present: hostel_total_student-hostel_absent_student,
                Student_Absent: hostel_absent_student,
                Total_staff: total_staff,
                Staff_Present: total_staff - absent_staff,
                Staff_Absent: absent_staff
            };
        }
        else if(type=="Day Scholar")
            {
                data = {
                    Total_students:total_student-hostel_total_student,
                    Student_Present: total_student-hostel_total_student-(absent_student-hostel_absent_student),
                    Student_Absent: absent_student-hostel_absent_student,
                    Total_staff: total_staff,
                    Staff_Present: total_staff - absent_staff,
                    Staff_Absent: absent_staff
                };
            }
        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/attendance-graph', async (req, res) => {
    const { user, type, department } = req.body;
    console.log(req.body);

    if (!department || !user) {
        return res.status(400).json({ error: 'Department and user type are required' });
    }

    let column;
    let typeCondition = '';

    if (user === 'Student') {
        column = "student_id";

        // Add the type condition based on the value of 'type'
        if (type === 'Hostel') {
            typeCondition = "AND studentType = 'Hostel'";
        } else if (type === 'Day Scholar') {
            typeCondition = "AND studentType = 'Day Scholar'";
        }
        // If type is 'All', no additional condition is needed.
    } else {
        column = "staff_id";
    }

    try {
        const results = await query(
            `SELECT date, total
            FROM (
                SELECT attendance_date as date, COUNT(*) as total 
                FROM absent_attendance_records 
                WHERE department_name = ? 
                AND ${column} IS NOT NULL 
                ${typeCondition} 
                GROUP BY attendance_date
                ORDER BY attendance_date DESC
                LIMIT 7
            ) AS subquery
            ORDER BY date ASC;
            `,
            [department]
        );
        console.log('Query results:', results);

        if (results.length === 0) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
            return res.json({
                name: formattedDate,
                absent: 0
            });
        }

        const formattedResults = results.map(row => {
            const date = new Date(row.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return {
                name: formattedDate,
                absent: row.total
            };
        });

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/admin-attendance-summary', async (req, res) => {
    const { user, type, department } = req.body;

    if (!user) {
        return res.status(400).json({ error: 'User type is required' });
    }

    let queryStr;
    let presentField;
    let absentField;

    if (user.toLowerCase() === 'student') {
        if (type === "All") {
            queryStr = `
                SELECT 
                    department_name, 
                    (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_students, 
                    (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) AS total_absent_students
                FROM membercount 
                GROUP BY department_name
            `;
            presentField = 'total_students';
            absentField = 'total_absent_students';
        } else if (type === "Hostel") {
            queryStr = `
                SELECT 
                    department_name, 
                    (SUM(hostel_year_I_count) + SUM(hostel_year_II_count) + SUM(hostel_year_III_count) + SUM(hostel_year_IV_count)) AS total_hostel_students, 
                    (SUM(hostellercount_year_I) + SUM(hostellercount_year_II) + SUM(hostellercount_year_III) + SUM(hostellercount_year_IV)) AS total_absent_hostel_students
                FROM membercount 
                GROUP BY department_name
            `;
            presentField = 'total_hostel_students';
            absentField = 'total_absent_hostel_students';
        } else if (type === "Day Scholar") {
            queryStr = `
                SELECT 
                    department_name, 
                    (SUM(year_I_count) + SUM(year_II_count) + SUM(year_III_count) + SUM(year_IV_count)) AS total_day_scholar_students, 
                    (SUM(todayabsentcount_year_I) + SUM(todayabsentcount_year_II) + SUM(todayabsentcount_year_III) + SUM(todayabsentcount_year_IV)) -
                    (SUM(hostellercount_year_I) + SUM(hostellercount_year_II) + SUM(hostellercount_year_III) + SUM(hostellercount_year_IV)) AS total_absent_day_scholar_students
                FROM membercount 
                GROUP BY department_name
            `;
            presentField = 'total_day_scholar_students';
            absentField = 'total_absent_day_scholar_students';
        }
    } else if (user.toLowerCase() === 'faculty') {
        queryStr = `
            SELECT 
                department_name, 
                SUM(staff_count) AS total_staff, 
                SUM(todayabsentcount_staff) AS total_absent_staff
            FROM membercount 
            GROUP BY department_name
        `;
        presentField = 'total_staff';
        absentField = 'total_absent_staff';
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    try {
        const results = await query(queryStr);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No departments found' });
        }

        const data = results.map(row => ({
            name: row.department_name,
            present: row[presentField] - row[absentField],
            absent: row[absentField]
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/admin-attendance-count-summary', async (req, res) => {
    const { type } = req.body; 
    try {
        console.log("INNN");
        const results = await query('SELECT * FROM membercount');
        if (results.length === 0) {
            return res.status(404).json({ error: 'No departments found' });
        }

        let total_student = 0;
        let absent_student = 0;
        let total_staff = 0;
        let absent_staff = 0;

        let hostel_total_student = 0;
        let hostel_absent_student = 0;

        results.forEach(row => {
            total_student += row.year_I_count + row.year_II_count + row.year_III_count + row.year_IV_count;
            absent_student += row.todayabsentcount_year_I + row.todayabsentcount_year_II + row.todayabsentcount_year_III + row.todayabsentcount_year_IV;
            total_staff += row.staff_count;
            absent_staff += row.todayabsentcount_staff;

            hostel_total_student += row.hostel_year_I_count + row.hostel_year_II_count + row.hostel_year_III_count + row.hostel_year_IV_count;
            hostel_absent_student += row.hostellercount_year_I + row.hostellercount_year_II + row.hostellercount_year_III + row.hostellercount_year_IV;
        });

        let data = {};

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
                Student_Present: (total_student - hostel_total_student) - (absent_student - hostel_absent_student),
                Student_Absent: absent_student - hostel_absent_student,
                Total_staff: total_staff,
                Staff_Present: total_staff - absent_staff,
                Staff_Absent: absent_staff
            };
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/admin-attendance-graph', async (req, res) => {
    const { user, type } = req.body;  // Extract type from req.body
    console.log(req.body);
    
    if (!user) {
        return res.status(400).json({ error: 'User type is required' });
    }

    let column;
    let typeCondition = '';

    if (user === 'Student') {
        column = "student_id";

        // Add the type condition based on the value of 'type'
        if (type === 'Hostel') {
            typeCondition = "AND studentType = 'Hostel'";
        } else if (type === 'Day Scholar') {
            typeCondition = "AND studentType = 'Day Scholar'";
        }
        // If type is 'All', no additional condition is needed.
    } else {
        column = "staff_id";
    }

    try {
        const results = await query(
            `SELECT date, total
            FROM (
                SELECT attendance_date AS date, COUNT(*) AS total
                FROM absent_attendance_records
                WHERE ${column} IS NOT NULL
                ${typeCondition}
                GROUP BY attendance_date
                ORDER BY attendance_date DESC
                LIMIT 7
            ) AS subquery
            ORDER BY date ASC;
            `
        );
        console.log('Query results:', results);

        if (results.length === 0) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
            return res.json({
                name: formattedDate,
                absent: 0
            });
        }

        const formattedResults = results.map(row => {
            const date = new Date(row.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return {
                name: formattedDate,
                absent: row.total
            };
        });

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/getname', async (req, res) => {
    const { userId, userType } = req.body;
    console.log(req.body);
    if (!userId || !userType) {
        return res.status(400).json({ error: 'User ID and User Type are required' });
    }

    if (!['student', 'staff'].includes(userType)) {
        return res.status(400).json({ error: 'Invalid User Type' });
    }

    const table = userType === 'student' ? 'students' : 'staffs';
    try {
        const queryStr = `SELECT name FROM ${table} WHERE id = ?`;
        const result = await query(queryStr, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ error: `${userType} not found` });
        }

        res.json({ data: result[0] });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
    }
});
module.exports = router;
