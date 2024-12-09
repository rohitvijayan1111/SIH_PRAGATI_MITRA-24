const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET route to fetch expense data
router.get('/expense', (req, res) => {
  const query = 'SELECT * FROM expense_table';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    // Loop through results if needed
    results.forEach(result => {
      result.total_cost = result.cost;  // If you want to add calculated fields like total_cost
    });
    res.status(200).json(results);  // Send the modified data back
  });
});

// PUT route to update existing expense data
router.put('/expense/:id', (req, res) => {
  const { id } = req.params;
  const { liabilities, cost } = req.body;

  // Optionally add total_cost calculation here
  const total_cost = cost;  // If you have any custom logic for total_cost, add it here

  const query = 'UPDATE expense_table SET liabilities = ?, cost = ? WHERE id = ?';
  db.query(query, [liabilities, cost, id], (err) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Expense data updated successfully!' });
  });
});

// POST route to add new expense data
router.post('/expense', (req, res) => {
  const { liabilities, cost } = req.body;

  // Optionally add total_cost calculation here
  const total_cost = cost;  // Total cost logic, if needed

  const query = 'INSERT INTO expense_table (liabilities, cost) VALUES (?, ?)';
  db.query(query, [liabilities, cost], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'New expense data added successfully!' });
  });
});

// DELETE route to delete an expense record
router.delete('/expense/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM expense_table WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Expense data deleted successfully!' });
  });
});

router.get('/get-expenses', (req, res) => {
  const query = 'SELECT liabilities, cost FROM expense_table';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching expense data:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Export the router
module.exports = router;
