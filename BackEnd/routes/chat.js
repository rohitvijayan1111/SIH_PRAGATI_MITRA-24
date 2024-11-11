// excel.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import your database connection

router.post('/addMessage', (req, res) => {
    const { sender, message } = req.body;
    const query = `INSERT INTO chat_messages (sender, message) VALUES (?, ?)`;
    db.query(query, [sender, message], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Message added');
    });
});

router.get('/messages', (req, res) => {
    const query = `SELECT sender, message, DATE(timestamp) as date, TIME(timestamp) as time 
FROM chat_messages 
ORDER BY timestamp;
`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

module.exports = router;