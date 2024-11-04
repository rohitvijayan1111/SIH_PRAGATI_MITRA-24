const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');
const path = require('path'); 
const multer = require('multer');
const fs = require('fs');
const query = util.promisify(db.query).bind(db);
const fsPromises = require('fs').promises; // For async operations
const axios = require('axios');
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

router.post('/gettable', async (req, res) => {
  //console.log("Received request:", req.body);
  const table = req.body.table;
  const department = req.body.department;

  if (!table || !department) {
    return res.status(400).send("Please provide both table and department parameters.");
  }

  let recordSql = 'SELECT * FROM ?? ';
  const columnSql = 'SHOW COLUMNS FROM ??';
  const recordValues = [table];
  const columnValues = [table];

  if (department !== "All") {
    recordSql += 'WHERE department = ? ';
    recordValues.push(department);
  }

  recordSql += 'ORDER BY department';

  try {
    const columnResults = await query(columnSql, columnValues);
    const columnDataTypes = columnResults.reduce((acc, col) => {
      acc[col.Field] = col.Type;
      return acc;
    }, {});

    // Fetch table records
    const recordResults = await query(recordSql, recordValues);

    if (recordResults.length === 0) {
      return res.status(200).json({ columnDataTypes, data: [] });
    }

    res.status(200).json({ columnDataTypes, data: recordResults });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    return res.status(500).json({ error: getFriendlyErrorMessage(err.code) });
  }
});
router.post('/create-table', async (req, res) => {
  const { formName, attributes,usergroup } = req.body;

  if (!formName || !attributes || !Array.isArray(attributes)) {
    return res.status(400).send('Invalid request data');
  }

  // Construct table name and columns
  const tableName = formName.replace(/\s+/g, '_').toLowerCase(); // Convert form name to a valid table name
  let columns = 'id INT AUTO_INCREMENT PRIMARY KEY, ';
  attributes.forEach((attr) => {
    const type = attr.type === 'text' ? 'VARCHAR(255)' :
                 attr.type === 'number' ? 'INT' :
                 attr.type === 'date' ? 'DATE' :
                 attr.type === 'boolean' ? 'BOOLEAN' :
                 attr.type === 'file' ? 'VARCHAR(255)' : // File type, storing file name or path
                 attr.type === 'link' ? 'VARCHAR(255)' : 'TEXT'; // Link type, storing URL or related link
    columns += `${attr.name.replace(/\s+/g, '_').toLowerCase()} ${type}, `;
  });

  // Remove trailing comma and space
  columns = columns.slice(0, -2);

  const createTableQuery = `CREATE TABLE ${tableName} (${columns})`;
  
  try {
    // Create the new table
    await query(createTableQuery);

    // Insert a record into the form_locks table
    const insertLockQuery = `INSERT INTO form_locks (form_table_name, form_title, is_locked,usergroup,not_submitted_emails) VALUES (?, ?, ?,?,?)`;
    await query(insertLockQuery, [tableName, formName, 0,usergroup,usergroup]); // Initially, set is_locked to 0 (unlocked)

    res.send(`Table ${tableName} created successfully`);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Error creating table and inserting record');
  }
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const table = req.body.table;
    const dir = `./uploads/${table}`;
    await fsPromises.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = `${moment().format('YYYYMMDD_HHmmss')}_${file.originalname}`;
    cb(null, fileName); 
  }
});

const upload = multer({ storage: storage });

router.post('/insertrecord', upload.single('file'), async (req, res) => {
  const { table, ...data } = req.body;

  if (!table || !data) {
    return res.status(400).json({ error: 'Data and table are required' });
  }

  try {
    let filePath = null;
    if (req.file) {
      filePath = req.file.path;
      data.document = filePath;
    }

    await query('INSERT INTO ?? SET ?', [table, data]);

    res.json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    res.status(500).json({ error: `${friendlyMessage}` });
  }
});

router.post('/updaterecord', upload.single('file'), async (req, res) => {
  console.log(req.body);
  const { id, table, data: rawData, deleteFile } = req.body;
  const data = JSON.parse(rawData);

  if (!id || !table) {
    return res.status(400).json({ error: 'Id and table are required' });
  }

  try {
    const existingRows = await query('SELECT * FROM ?? WHERE id = ?', [table, id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Handling file upload and deletion
    const oldFilePath = existingRows[0].document;
    let newFilePath = oldFilePath;

    if (req.file) {
      newFilePath = req.file.path;
      if (oldFilePath && oldFilePath !== newFilePath) {
        try {
          await fsPromises.unlink(path.resolve(oldFilePath));
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
    } else if (deleteFile === 'true' && oldFilePath) {
      try {
        await fsPromises.unlink(path.resolve(oldFilePath));
        newFilePath = ''; // Clear the document path in the database
      } catch (unlinkError) {
        console.error('Error deleting old file:', unlinkError);
      }
    }

    if (newFilePath) {
      data.document = newFilePath;
    }

    // Add current timestamp for createdAt/updatedAt
    const currentTimestamp = new Date();
    data.createdAt = currentTimestamp;

    // Construct the SET clause dynamically with proper escaping
    const setClause = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(data);

    const updateQuery = `UPDATE \`${table}\` SET ${setClause}, createdAt = NOW() WHERE id = ?`; // NOW() adds the current timestamp
    console.log('SQL Query:', updateQuery);
    console.log('Values:', [...values, id]);

    await query(updateQuery, [...values, id]);

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});
router.delete('/deleterecord', async (req, res) => {
  const { id, table } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }

  try {
    const record = await query('SELECT document FROM ?? WHERE id = ?', [table, id]);

    if (record.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const filePath = record[0].document;
    console.log(filePath);
    if (filePath) {
      try {
        await fsPromises.unlink(path.resolve(filePath));
        console.log(`File at ${filePath} deleted successfully`);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
        
      }
    }

    await query('DELETE FROM ?? WHERE id = ?', [table, id]);

    res.json({ message: 'Item and associated file (if any) deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.stack);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});
router.post('/locktable', async (req, res) => {
  const { id, lock } = req.body;

  if (!id || lock === undefined) {
    return res.status(400).json({ error: 'ID and lock status are required' });
  }

  try {
    await query('UPDATE form_locks SET is_locked = ? WHERE id = ?', [lock, id]);
    res.json({ message: 'Item lock status updated successfully' });
  } catch (err) {
    console.error('Error updating lock status:', err.stack);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});
router.post('/deadline', async (req, res) => {
  const { id, deadline } = req.body;

  // Validate request body
  if (!id || !deadline) {
    return res.status(400).json({ error: 'ID and deadline are required' });
  }

  try {
    // Get the form lock data by ID
    const [formLock] = await query('SELECT * FROM form_locks WHERE id = ?', [id]);

    if (!formLock) {
      return res.status(404).json({ error: 'Form lock not found' });
    }

    // Update the deadline in the database
    await query('UPDATE form_locks SET deadline = ? WHERE id = ?', [deadline, id]);

    // Fetch the email addresses from the 'assigned_to_usergroup' JSON field
    const assignedUsers = JSON.parse(formLock.assigned_to_usergroup || '[]');

    // Send an individual email to each assigned user
    for (const user of assignedUsers) {
      const email = user[0]; // Extract email from each assigned user

      const emailPayload = {
        subject: `${formLock.form_title} Form Deadline Update`,
        to: email, // Send email to individual user
        desc: `Dear ${email},\n\nPlease be informed that the deadline for the ${formLock.form_title} form has been updated. The new deadline is ${deadline}.\n Ensure timely submission to avoid any delays.\n Best regards,\nIQAC`,
      };

      // Send email for each user
      await axios.post('http://localhost:3000/mail/send', emailPayload);
    }

    res.status(200).json({ success: true, message: 'Deadline updated and notifications sent successfully' });

  } catch (err) {
    console.error('Error updating deadline:', err.stack);
    res.status(500).json({ error: 'An error occurred while updating the deadline' });
  }
});

router.post('/create-shadow-user', async (req, res) => {
  const { emailId, form_id, department, role, assigned_by, form_title, deadline } = req.body;

  try {
    // Check if the user already exists
    const checkUserQuery = 'SELECT email FROM google_authenticated_users WHERE email = ?';
    const userResult = await query(checkUserQuery, [emailId]);

    if (userResult.length === 0) {
      // Insert user if not exists
      const insertUserQuery = `
        INSERT INTO google_authenticated_users (email, department, assigned_by, assigned_at, role)
        VALUES (?, ?, ?, NOW(), ?)
      `;
      await query(insertUserQuery, [emailId, department, assigned_by, role]);
    }

    // Fetch the current assigned_to_usergroup
    const fetchAssignedQuery = 'SELECT assigned_to_usergroup FROM form_locks WHERE id = ?';
    const formResult = await query(fetchAssignedQuery, [form_id]);

    let assignedUsers = [];

    // Parse assigned_to_usergroup if it exists
    if (formResult.length > 0 && formResult[0].assigned_to_usergroup) {
      assignedUsers = JSON.parse(formResult[0].assigned_to_usergroup);
    }

    // Check if the user is already assigned
    const userAlreadyAssigned = assignedUsers.some(user => user[0] === emailId);

    if (userAlreadyAssigned) {
      return res.status(400).json({ error: 'User already assigned' });
    }

    // Add the new user with department to the nested array
    assignedUsers.push([emailId, department]);

    // Update form_locks with the new nested array
    const updateFormQuery = `
      UPDATE form_locks
      SET assigned_to_usergroup = ?
      WHERE id = ?;
    `;
    await query(updateFormQuery, [JSON.stringify(assignedUsers), form_id]);

    // Prepare and send email payload
    const emailPayload = {
      subject: `${form_title} Form was assigned to you`,
      to: emailId,
      desc: `Dear ${emailId},\n\nYou have been assigned the form titled "${form_title}" by the Head of Department (HOD) of ${department}. Please be informed that you have been given the responsibility to complete and submit this form before the specified deadline.\n\nGoing forward, you will receive notifications regarding any updates or reminders about the deadline, which is set for ${deadline}. Kindly ensure timely submission to avoid any delays.\n\nThank you for your cooperation.\n\nBest regards,\n${assigned_by}`,
    };

    await axios.post('http://localhost:3000/mail/send', emailPayload);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/deleteFormUser', (req, res) => {
  const { formId, email, department } = req.body;

  // First, retrieve the current assigned_to_usergroup JSON array
  const selectQuery = 'SELECT assigned_to_usergroup FROM form_locks WHERE id = ?';
  
  db.query(selectQuery, [formId], (err, results) => {
    if (err) {
      console.error('Error fetching form data:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch form data' });
    }

    if (results.length === 0 || !results[0].assigned_to_usergroup) {
      return res.status(404).json({ success: false, error: 'Form not found or no assigned users' });
    }

    let assignedUsers;
    try {
      assignedUsers = JSON.parse(results[0].assigned_to_usergroup);
    } catch (jsonError) {
      console.error('Error parsing assigned_to_usergroup JSON:', jsonError);
      return res.status(500).json({ success: false, error: 'Failed to parse user data' });
    }

    // Filter out the user based on email and department
    const updatedUsers = assignedUsers.filter(
      user => !(user[0] === email && user[1] === department)
    );

    // Update the database with the modified JSON array
    const updateQuery = 'UPDATE form_locks SET assigned_to_usergroup = ? WHERE id = ?';
    db.query(updateQuery, [JSON.stringify(updatedUsers), formId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error updating form data:', updateErr);
        return res.status(500).json({ success: false, error: 'Failed to update form data' });
      }

      return res.json({ success: true, message: 'User deleted successfully' });
    });
  });
});

router.post('/delete', async (req, res) => {
  const { formId, tableName } = req.body;

  if (!formId || !tableName) {
    return res.status(400).json({ error: 'Form ID and table name are required' });
  }

  try {
    // Start transaction to ensure both operations are done together
    await query('START TRANSACTION');

    // Delete the form lock entry from form_locks table
    const deleteFormLockQuery = 'DELETE FROM form_locks WHERE id = ?';
    const deleteFormLockResponse = await query(deleteFormLockQuery, [formId]);

    // Check if any rows were deleted
    if (deleteFormLockResponse.affectedRows === 0) {
      await query('ROLLBACK'); // Rollback in case of no entry found
      return res.status(404).json({ error: 'Form lock not found' });
    }

    // Drop the table from the database
    const dropTableQuery = `DROP TABLE IF EXISTS ??`; // Using placeholders to avoid SQL injection
    await query(dropTableQuery, [tableName]);

    // Commit the transaction
    await query('COMMIT');

    res.json({ message: `Form lock and table ${tableName} deleted successfully` });
  } catch (err) {
    console.error('Error deleting form lock and table:', err.stack);
    await query('ROLLBACK'); // Rollback the transaction in case of an error
    res.status(500).json({ error: 'An error occurred while deleting the form and table' });
  }
});

router.post('/getlocktablestatus', async (req, res) => {
  const { id, table } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }

  try {
    const results = await query('SELECT is_locked FROM ?? WHERE id=?', [table, id]);
    if (results.length > 0) {
      res.status(200).json(results[0]); 
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    console.error('Failed to fetch lock status:', err.stack);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});

module.exports = router;