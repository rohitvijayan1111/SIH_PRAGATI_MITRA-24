const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Import the path module
const db = require('../config/db');
const dayjs = require('dayjs'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/faculty_achievements');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


router.post('/submit', upload.single('document'), async (req, res) => {
    const {
        achievementType,
        title,
        description,
        date: formDate,
        authors,
        journal,
        publicationDate,
        researchArea,
        paperType,
        conferenceDetails,
        patentNumber,
        patentType,
        filedDate,
        patentStatus,
        issueDate,
        awardTitle,
        awardingBody,
        category,
        awardDescription,
        recipient,
        recognitionLevel,
        conferenceTitle,
        presenter,
        location,
        datePresented,
        topic,
        organizer,
        bookTitle,
        author_name,
        publisher,
        isbn,
        book_category,
        inventors,
        department,
        paperDetails,
    } = req.body;


    const formattedpublicationDate =  publicationDate ? dayjs( publicationDate).format('YYYY-MM-DD') : null;
    const formattedfiledDate = filedDate ? dayjs(filedDate).format('YYYY-MM-DD') : null;
    const formattedissueDate = issueDate ? dayjs(issueDate).format('YYYY-MM-DD') : null;

    const documentPath = req.file ? req.file.path : null;

    const query = `
        INSERT INTO faculty_achievements SET ?
    `;

    
    const values = {
        achievement_type: achievementType || null,
        title: title || null,
        description: description || null,
        date: formDate || null,
        authors: authors || null,
        journal: journal || null,
        publication_date: publicationDate || null,
        research_area: researchArea || null,
        paper_type: paperType || null,
        conference_details: conferenceDetails || null,
        patent_number: patentNumber || null,
        patent_type: patentType || null,
        filed_date: filedDate || null,
        patent_status: patentStatus || null,
        issue_date: issueDate || null,
        award_title: awardTitle || null,
        awarding_body: awardingBody || null,
        award_category: category || null,
        award_description: awardDescription || null,
        recipient: recipient || null,
        recognition_level: recognitionLevel || null,
        conference_title: conferenceTitle || null,
        presenter: presenter || null,
        location: location || null,
        date_presented: datePresented || null,
        topic: topic || null,
        organizer: organizer || null,
        book_title: bookTitle || null,
        author_name: author_name || null,
        publisher: publisher || null,
        isbn: isbn || null,
        book_category: book_category || null,
        document_path: documentPath || null,
        inventors: inventors || null, 
        department: department || null,
        paperDetails: paperDetails || null,
    };

    try {
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting values:', err);
                res.status(500).send({ message: 'Internal Server Error', error: err.message });
                return;
            }
            res.status(200).send({ message: 'Achievement submitted successfully' });
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
