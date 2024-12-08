// const express = require('express');
// const router = express.Router();
// const db = require('../config/db'); // Assuming you have a configured DB connection

// // POST route to handle salary data submission
// router.post('/salary', (req, res) => {
//   const salaryData = req.body; // Assuming salaryData is an array

//   console.log(req.body); // Log the whole request body for debugging

//   // Validate that salaryData is an array
//   if (!Array.isArray(salaryData) || salaryData.length === 0) {
//     return res.status(400).json({ message: 'No salary data provided' });
//   }

//   // Loop through each record in salaryData array and insert into the database
//   salaryData.forEach((record, index) => {
//     const { position, count, salary } = record;
//     console.log(position);
//     // Validate the data for each record
//     if (!position || !count || !salary) {
//       console.log(`Invalid data at index ${index}:`, record);
//       return;
//     }

//     // Insert the salary data into the database (adjust the query as per your DB schema)
//     const query = 'INSERT INTO salary_table (position, count, salary) VALUES (?, ?, ?)';
//     db.query(query, [position, count, salary], (err, result) => {
//       if (err) {
//         console.error('Error inserting data:', err);
//         return res.status(500).json({ message: 'Server error' });
//       }
//       // Continue to the next record if no error occurred
//       if (index === salaryData.length - 1) {
//         // Send success message after all records are inserted
//         res.status(200).json({ message: 'Salary data saved successfully!' });
//       }
//     });
//   });
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const db = require('../config/db'); // Assuming you have a configured DB connection

// // POST route to handle salary data submission
// router.post('/salary', (req, res) => {
//   const salaryData = req.body; // Assuming salaryData is an array

//   console.log(req.body); // Log the whole request body for debugging

//   // Validate that salaryData is an array
//   if (!Array.isArray(salaryData) || salaryData.length === 0) {
//     return res.status(400).json({ message: 'No salary data provided' });
//   }

//   // Loop through each record in salaryData array and insert into the database
//   salaryData.forEach((record, index) => {
//     const { position, count, salary } = record;
//     console.log(position);
//     // Validate the data for each record
//     if (!position || !count || !salary) {
//       console.log(`Invalid data at index ${index}:`, record);
//       return;
//     }

//     // Insert the salary data into the database (adjust the query as per your DB schema)
//     const query = 'INSERT INTO salary_table (position, count, salary) VALUES (?, ?, ?)';
//     db.query(query, [position, count, salary], (err, result) => {
//       if (err) {
//         console.error('Error inserting data:', err);
//         return res.status(500).json({ message: 'Server error' });
//       }
//       // Continue to the next record if no error occurred
//       if (index === salaryData.length - 1) {
//         // Send success message after all records are inserted
//         res.status(200).json({ message: 'Salary data saved successfully!' });
//       }
//     });
//   });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET route to fetch salary data
router.get('/salary', (req, res) => {
  const query = 'SELECT * FROM salary_table';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json(results);
  });
});

// PUT route to update existing salary data
router.put('/salary/:id', (req, res) => {
  const { id } = req.params;
  const { position, count, per_head_salary } = req.body;
  const salary = count * per_head_salary; // Calculate salary

  const query = 'UPDATE salary_table SET position = ?, count = ?, per_head_salary = ?, salary = ? WHERE id = ?';
  db.query(query, [position, count, per_head_salary, salary, id], (err) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Salary data updated successfully!' });
  });
});

// POST route to add new salary data
router.post('/salary', (req, res) => {
  const { position, count, per_head_salary } = req.body;
  const salary = count * per_head_salary; // Calculate salary

  const query = 'INSERT INTO salary_table (position, count, per_head_salary, salary) VALUES (?, ?, ?, ?)';
  db.query(query, [position, count, per_head_salary, salary], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'New salary data added successfully!' });
  });
});

// DELETE route to delete a salary record
router.delete('/salary/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM salary_table WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Salary data deleted successfully!' });
  });
});

module.exports = router;
