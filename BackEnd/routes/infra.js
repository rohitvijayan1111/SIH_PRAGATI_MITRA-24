const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Adjust path as needed

// Routes for infrastructure
router.get('/getTotalBuildingsCompleted', (req, res) => {
  const query = 'SELECT SUM(quantity) AS totalBuildingsCompleted FROM physical_infrastructure WHERE status = "Completed"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching completed buildings:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ 
      totalBuildingsCompleted: results[0].totalBuildingsCompleted || 0
    });
  });
});
router.get('/getGreenInitiativesData', (req, res) => {
    const query = 'SELECT initiative_name, completion_percentage FROM green_initiatives';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching green initiatives data:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json(results);
    });
  });
  
// Add other routes similarly
router.get('/getTotalBuildingsOngoing', (req, res) => {
  const query = 'SELECT SUM(quantity) AS totalBuildingsOngoing FROM physical_infrastructure WHERE status = "Ongoing"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching ongoing buildings:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ 
      totalBuildingsOngoing: results[0].totalBuildingsOngoing || 0
    });
  });
});

router.get('/getMaintenanceCompletionPercentage', (req, res) => {
  const query = `
    SELECT 
      ROUND((COUNT(CASE WHEN status = 'Completed' THEN 1 END) / COUNT(*)) * 100, 2) AS maintenanceCompletionPercentage 
    FROM maintenance
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching maintenance completion percentage:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ 
      maintenanceCompletionPercentage: results[0].maintenanceCompletionPercentage || 0
    });
  });
});

router.get('/getGreenInitiativesCount', (req, res) => {
  const query = 'SELECT COUNT(initiative_name) AS greenInitiativesCount FROM green_initiatives';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching green initiatives count:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ 
      greenInitiativesCount: results[0].greenInitiativesCount || 0
    });
  });
});

module.exports = router;