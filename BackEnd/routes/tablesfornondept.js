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
    const table = req.body.table;
  
    if (!table) {
      return res.status(400).send("Please provide the table parameter.");
    }
  
    let recordSql = 'SELECT * FROM ?? ';
    const columnSql = 'SHOW COLUMNS FROM ??';
    const recordValues = [table];
    const columnValues = [table];
  
    // Remove department filter logic
    recordSql += 'ORDER BY id'; // You can change this order by field if needed
  
    try {
      const columnResults = await query(columnSql, columnValues);
      const columnDataTypes = columnResults.reduce((acc, col) => {
        acc[col.Field] = col.Type;
        return acc;
      }, {});
  
      // Fetch table records without department filter
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

module.exports = router;  