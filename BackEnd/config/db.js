const mysql = require('mysql');


const db = mysql.createConnection({
  host: 'localhost',     
  user: 'root',        
  password: 'pass123',  
  database: 'rmkec'  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = db;
