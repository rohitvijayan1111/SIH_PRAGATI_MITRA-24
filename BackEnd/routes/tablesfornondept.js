const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');
const moment = require('moment');
const path = require('path'); 
const multer = require('multer');
const fs = require('fs');
const query = util.promisify(db.query).bind(db);

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

// Get table data
router.post('/gettable', async (req, res) => {
  const table = req.body.table;

  if (!table) {
    return res.status(400).send("Please provide the table parameter.");
  }

  let recordSql = 'SELECT * FROM ?? ';
  const columnSql = 'SHOW COLUMNS FROM ??';
  const recordValues = [table];
  const columnValues = [table];

  recordSql += 'ORDER BY id'; // You can change this order by field if needed

  try {
    const columnResults = await query(columnSql, columnValues);
    const columnDataTypes = columnResults.reduce((acc, col) => {
      acc[col.Field] = col.Type;
      return acc;
    }, {});

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

// Delete record by ID
router.delete('/deleterecord', async (req, res) => {
  const { id, table } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Table name and ID are required' });
  }

  try {
    // Delete the record from the table based on the provided id
    await query('DELETE FROM ?? WHERE id = ?', [table, id]);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.stack);
    res.status(500).json({ error: getFriendlyErrorMessage(error.code) });
  }
});

// Insert new record
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

// Update record by ID
router.post('/updaterecord', upload.single('file'), async (req, res) => {
  console.log(req.body);
  const { id, table, data: rawData, deleteFile } = req.body;
  const data = JSON.parse(rawData);

  // Check if id and table are provided
  if (!id || !table) {
    return res.status(400).json({ error: 'Id and table are required' });
  }

  try {
    // Fetch existing row to check if the record exists
    const existingRows = await query('SELECT * FROM ?? WHERE id = ?', [table, id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const oldFilePath = existingRows[0].document;
    let newFilePath = oldFilePath;

    // File upload logic
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

    // Update the document path in data if a new file is uploaded
    if (newFilePath) {
      data.document = newFilePath;
    }

    // Construct the SET clause dynamically with proper escaping
    const setClause = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(data);

    // Construct and execute the update query
    const updateQuery = `UPDATE \`${table}\` SET ${setClause} WHERE id = ?`;
    console.log('SQL Query:', updateQuery);
    console.log('Values:', [...values, id]);

    await query(updateQuery, [...values, id]);

    // Send a successful response
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

module.exports = router;