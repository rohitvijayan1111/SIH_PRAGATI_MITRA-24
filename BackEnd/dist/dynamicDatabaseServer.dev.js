"use strict";

var express = require('express');

var mysql = require('mysql2');

var cors = require('cors');

var bodyParser = require('body-parser');

var app = express();
var PORT = 3002; // Use a different port than your existing server.js

var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
var dbConnection; // Route to get the list of all available databases

app.get('/api/databases', function (req, res) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123'
  });
  connection.query('SHOW DATABASES', function (err, results) {
    if (err) return res.status(500).send('Error fetching databases');
    res.send(results.map(function (db) {
      return db.Database;
    }));
    connection.end();
  });
}); // Route to select a database based on the name provided

app.post('/api/select-database', function (req, res) {
  var dbName = req.body.dbName;
  dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123',
    database: dbName
  });
  dbConnection.connect(function (err) {
    if (err) return res.status(500).send('Failed to connect to database');
    res.send({
      message: "Connected to ".concat(dbName)
    });
  });
}); // Route to fetch tables from the selected database

app.get('/api/tables/:database', function (req, res) {
  var database = req.params.database; // Validate the database name (optional, but recommended)

  if (!database || typeof database !== 'string') {
    return res.status(400).send('Invalid database name');
  }

  dbConnection.query('SHOW TABLES FROM ??', [database], function (err, results) {
    if (err) return res.status(500).send('Error fetching tables');
    res.send(results.map(function (table) {
      return Object.values(table)[0];
    }));
  });
}); // Route to fetch table content based on the selected table

app.get('/api/table-content/:database/:table', function (req, res) {
  var _req$params = req.params,
      database = _req$params.database,
      table = _req$params.table;
  dbConnection.query("SELECT * FROM ".concat(database, ".").concat(table), function (err, results) {
    if (err) return res.status(500).send('Error fetching table content');
    res.send(results);
  });
});
app.listen(PORT, function () {
  console.log("Dynamic Database Server running on http://localhost:".concat(PORT));
});