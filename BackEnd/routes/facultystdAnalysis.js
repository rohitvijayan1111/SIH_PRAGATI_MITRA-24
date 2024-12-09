const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/student-achievements-count', async (req, res) => {
    const Query = 'SELECT achievementType, COUNT(*) AS count FROM student_achievements GROUP BY achievementType';
    db.query(Query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        res.json(result);
    });
});

router.get('/faculty-achievements-count', async (req, res) => {
    const query = `
        SELECT achievement_type, department, COUNT(*) AS count 
        FROM faculty_achievements 
        GROUP BY achievement_type, department
    `;    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        res.json(result);
    });
});

module.exports = router;
