// excel.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import your database connection


router.get('/forms', (req, res) => {
    db.query('SELECT * FROM gforms', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
  // API to save a new form
  // API to save a new form
router.post('/forms', (req, res) => {
    const { name, clientId, apiKey, sheetId, sheetRange } = req.body;
    
    const sql = 'INSERT INTO gforms (name, clientId, apiKey, sheetId, sheetRange) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, clientId, apiKey, sheetId, sheetRange], (err, result) => {
      if (err) {
        console.error(err);  // Log error for debugging
        res.status(500).json({ message: 'Error inserting form into database' });
        return;
      }
      res.json({ message: 'Form added', formId: result.insertId });
    });
  });
  
  
  // API to fetch form details by ID
  router.get('/forms/:id', (req, res) => {
    const sql = 'SELECT * FROM gforms WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  });

  router.delete('/forms/:id', (req, res) => {
    const sql = 'DELETE FROM gforms WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.error('Error deleting form:', err);
        res.status(500).json({ message: 'Error deleting form from database' });
        return;
      }
      res.json({ message: 'Form deleted' });
    });
  });

module.exports = router;