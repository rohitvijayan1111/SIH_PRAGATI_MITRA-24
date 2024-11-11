// routes/importdb.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../config/db'); // Import the DB connection from server.js

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads'); // Absolute path for the uploads directory
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create uploads directory if it doesn't exist
    }
    cb(null, uploadPath); // Store files in the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const stripSQLComments = (sql) => {
  // Remove any MySQL specific comments
  return sql.replace(/\/\*.*?\*\//gs, '');  // Removes comments enclosed with /*! */
};

const upload = multer({ storage: storage });

// Route to upload SQL file
router.post('/upload-sql', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Path to the uploaded file
  const sqlFilePath = path.join(__dirname, '../uploads', req.file.filename);

  // Function to import the SQL file into the database
  const importSQLFile = (filePath, callback) => {
    // Read the SQL file
    fs.readFile(filePath, 'utf8', (err, sqlContent) => {
      if (err) {
        console.error('Error reading SQL file:', err);
        return callback(err);
      }

      // Strip MySQL-specific comments from the SQL content
      const cleanSQL = stripSQLComments(sqlContent);

      // Execute the cleaned SQL queries
      db.query(cleanSQL, (err, result) => {
        if (err) {
          console.error('Error executing SQL file:', err);
          return callback(err);
        }
        console.log('SQL file imported successfully');
        callback(null, result); // Return the result if the SQL is executed successfully
      });
    });
  };

  // Pass the uploaded file to the DB import handler
  importSQLFile(sqlFilePath, (err, result) => {
    if (err) {
      console.error('Error importing SQL file:', err);
      return res.status(500).json({ error: 'Failed to import SQL file' });
    }

    console.log('SQL file imported successfully');
    res.status(200).json({ message: 'SQL file imported successfully', result });
  });
});

// Route to get list of tables
router.get('/tables', (req, res) => {
  db.query('SHOW TABLES', (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return res.status(500).json({ error: 'Failed to fetch tables' });
    }
    res.json(tables.map((table) => table[`Tables_in_${db.config.database}`]));
  });
});

// Route to get data from a selected table
router.get('/tables/:tableName', (req, res) => {
  const { tableName } = req.params;
  db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (err) {
      console.error('Error fetching table data:', err);
      return res.status(500).json({ error: 'Failed to fetch table data' });
    }
    res.json(rows);
  });
});

module.exports = router; // Export the router to be used in server.js
