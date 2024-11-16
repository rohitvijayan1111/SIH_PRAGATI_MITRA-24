const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3002; // Use a different port than your existing server.js

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  };
  app.use(cors(corsOptions));
  
app.use(bodyParser.json());

let dbConnection;

// Route to get the list of all available databases
app.get('/api/databases', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123',
  });

  connection.query('SHOW DATABASES', (err, results) => {
    if (err) return res.status(500).send('Error fetching databases');
    res.send(results.map(db => db.Database));
    connection.end();
  });
});

// Route to select a database based on the name provided
app.post('/api/select-database', (req, res) => {
  const { dbName } = req.body;
  
  dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123',
    database: dbName,
  });

  dbConnection.connect(err => {
    if (err) return res.status(500).send('Failed to connect to database');
    res.send({ message: `Connected to ${dbName}` });
  });
});

// Route to fetch tables from the selected database
app.get('/api/tables/:database', (req, res) => {
    const { database } = req.params;
    
    // Validate the database name (optional, but recommended)
    if (!database || typeof database !== 'string') {
      return res.status(400).send('Invalid database name');
    }
  
    dbConnection.query(
      'SHOW TABLES FROM ??',
      [database],
      (err, results) => {
        if (err) return res.status(500).send('Error fetching tables');
        res.send(results.map(table => Object.values(table)[0]));
      }
    );
  });

// Route to fetch table content based on the selected table
app.get('/api/table-content/:database/:table', (req, res) => {
  const { database, table } = req.params;

  dbConnection.query(`SELECT * FROM ${database}.${table}`, (err, results) => {
    if (err) return res.status(500).send('Error fetching table content');
    res.send(results);
  });
});

app.listen(PORT, () => {
  console.log(`Dynamic Database Server running on http://localhost:${PORT}`);
});
