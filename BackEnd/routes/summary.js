const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming you have the MySQL database connection

// Route for getting financial summary totals
router.get('/totals', (req, res) => {
  const query = `
    SELECT
      (SELECT SUM(salary) FROM salary_table) AS total_salary,
      (SELECT SUM(income) FROM income_table) AS total_income,
      (SELECT SUM(cost) FROM expense_table) AS total_expense;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching totals:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Return financial summary as JSON
    res.json({
      total_salary: results[0].total_salary || 0,
      total_income: results[0].total_income || 0,
      total_expense: results[0].total_expense || 0,
    });
  });
});

module.exports = router;
