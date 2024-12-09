const express = require('express');
const db = require('../config/db');
const router = express.Router();


router.get('/:type', (req, res) => {
    const { type } = req.params;
    const decodedType = decodeURIComponent(type); 
    const query = `SELECT * FROM faculty_achievements WHERE achievement_type = ?`;

    db.query(query, [decodedType], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        res.json(results);
    });
});



module.exports = router; 