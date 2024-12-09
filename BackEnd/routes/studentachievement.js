const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/details/:type', (req, res) => {
    const { type } = req.params;
    let query = '';
    
   
    switch (type) {
      case 'Symposium':
        query = 'SELECT * FROM student_achievements WHERE achievementType = "Symposium"';
        break;
      case 'Patent':
        query = 'SELECT * FROM student_achievements WHERE achievementType = "Patent"';
        break;
      case 'Paper Publication':
        query = 'SELECT * FROM student_achievements WHERE achievementType = "Paper Publication"';
        break;
      case 'Hackathon':
        query = 'SELECT * FROM student_achievements WHERE achievementType = "Hackathon"';
        break;
      default:
        return res.status(400).json({ message: 'Invalid achievement type' });
    }

   
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ message: 'Error fetching data' });
      }
      res.json(result); 
    });
});

module.exports = router; 