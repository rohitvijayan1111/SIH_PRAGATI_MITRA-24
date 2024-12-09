const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const dayjs = require('dayjs');
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/student_achievements');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post('/submit', upload.single('document'), (req, res) => {
    const {
        student_id,
        achievementType,
        serialNo,
        title,
        teamMembers,
        description,
        technologyUsed,
        conferenceDetails,
        startDate,
        endDate,
        outcomes,
        location,
        organizer,
        event_type,
        achievement,
        research_area ,
        patentnumber,
        department ,
        paperDetails,
    } = req.body;

 

    if (!student_id) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;
    const documentLink = req.file ? req.file.path : null;
console.log(patentnumber);
    const query = `
        INSERT INTO student_achievements (
            student_id, achievementType, serialNo, title, teamMembers, description,
            location, technologyUsed, conferenceDetails, startDate, endDate, outcomes, research_area,
            documentLink, organizer, event_type, achievement,  patentnumber,department, paperDetails 
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?);
    `;

    const values = [
        student_id, achievementType, serialNo, title, teamMembers, description, location, 
        technologyUsed, conferenceDetails, formattedStartDate, formattedEndDate, outcomes, research_area, documentLink,
        organizer, event_type, achievement,patentnumber, department,  paperDetails 
    ];

    
    db.query(query, values, (err) => {
        if (err) {
            console.error('Error inserting achievement:', err);
            return res.status(500).json({ message: 'Error inserting achievement' });
        }
        res.status(201).json({ message: 'Achievement submitted successfully' });
    });
});

module.exports = router;
