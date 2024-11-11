"use strict";

var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass123',
  database: 'rmkec'
});
db.connect(function (err) {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the MySQL database.');
});
module.exports = db;