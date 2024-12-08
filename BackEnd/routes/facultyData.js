// // // Assuming you have already set up your Express server
// // const express = require('express');
// // const router = express.Router();
// // const db = require('../db'); // Adjust the path to your database connection file

// // // POST method to update personal and professional details of faculty
// // router.post('/api/updateFacultyDetails', async (req, res) => {
// //   const {
// //     faculty_id,
// //     Name,
// //     Designation,
// //     Email,
// //     Phone,
// //     DateOfJoining,
// //     Qualification,
// //     Experience,
// //     PapersPublished,
// //     Conferences,
// //     BooksPublished,
// //     Patents,
// //     Awards,
// //     GoogleScholarId,
// //     ScopusId,
// //   } = req.body;

// //   try {
// //     // SQL query to update faculty details based on the faculty_id
// //     const updateQuery = `
// //       UPDATE faculty_table 
// //       SET 
// //         Name = ?, 
// //         Designation = ?, 
// //         Email = ?, 
// //         Phone = ?, 
// //         DateOfJoining = ?, 
// //         Qualification = ?, 
// //         Experience = ?, 
// //         PapersPublished = ?, 
// //         Conferences = ?, 
// //         BooksPublished = ?, 
// //         Patents = ?, 
// //         Awards = ?, 
// //         GoogleScholarId = ?, 
// //         ScopusId = ?
// //       WHERE faculty_id = ?`;

// //     await db.query(updateQuery, [
// //       Name,
// //       Designation,
// //       Email,
// //       Phone,
// //       DateOfJoining,
// //       Qualification,
// //       Experience,
// //       PapersPublished,
// //       Conferences,
// //       BooksPublished,
// //       Patents,
// //       Awards,
// //       GoogleScholarId,
// //       ScopusId,
// //       faculty_id,
// //     ]);

// //     res.status(200).json({ message: 'Faculty details updated successfully' });
// //   } catch (error) {
// //     console.error('Error updating faculty details:', error);
// //     res.status(500).json({ error: 'Failed to update faculty details' });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('../config/db'); // Import the database connection

// const router = express.Router();
// const PORT = 3000; // Change to your desired port

// // Middleware
// router.use(bodyParser.json());

// // Update personal details endpoint
// router.post('/api/updatePersonalDetails', (req, res) => {
//     const {
//         faculty_id,
//         Name,
//         Designation,
//         Email,
//         Phone,
//         DateOfJoining,
//         Qualification,
//         Experience,
//     } = req.body;

//     // SQL query to update personal details
//     const query = `
//         UPDATE faculty_table SET
//             Name = ?,
//             Designation = ?,
//             Email = ?,
//             Phone = ?,
//             DateOfJoining = ?,
//             Qualification = ?,
//             Experience = ?
//         WHERE faculty_id = ?
//     `;
//     console.log(faculty_id);

//     const values = [
//         Name,
//         Designation,
//         Email,
//         Phone,
//         DateOfJoining,
//         Qualification,
//         Experience,
//         faculty_id
//     ];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error updating personal details:', err);
//             return res.status(500).json({ message: 'Failed to update personal details' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Faculty not found' });
//         }

//         res.status(200).json({ message: 'Personal details updated successfully' });
//     });
// });

// // Update other details endpoint
// router.post('/api/updateOtherDetails', (req, res) => {
//     const {
//         faculty_id,
//         PapersPublished,
//         Conferences,
//         BooksPublished,
//         Patents,
//         Awards,
//         GoogleScholarId,
//         ScopusId,
//     } = req.body;

//     // SQL query to update other details
//     const query = `
//         UPDATE faculty_table SET
//             PapersPublished = ?,
//             Conferences = ?,
//             BooksPublished = ?,
//             Patents = ?,
//             Awards = ?,
//             GoogleScholarId = ?,
//             ScopusId = ?
//         WHERE faculty_id = ?
//     `;

//     const values = [
//         PapersPublished,
//         Conferences,
//         BooksPublished,
//         Patents,
//         Awards,
//         GoogleScholarId,
//         ScopusId,
//         faculty_id
//     ];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error updating other details:', err);
//             return res.status(500).json({ message: 'Failed to update other details' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Faculty not found' });
//         }

//         res.status(200).json({ message: 'Other details updated successfully' });
//     });
// });

// // Start the server
// // router.listen(PORT, () => {
// //     console.log(`Server is running on http://localhost:${PORT}`);
// // });
// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import your database connection
const multer = require('multer'); // Import multer

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use timestamp to avoid filename collisions
    }
});

const upload = multer({ storage });

// Update faculty profile picture
router.put('/updateProfilePicture/:facultyId', upload.single('profilePicture'), async (req, res) => {
    try {
        const { facultyId } = req.params;
        const profilePicturePath = req.file.path.replace(/\\/g, '/'); // Normalize the path

        if (!facultyId || !profilePicturePath) {
            return res.status(400).json({ error: 'Faculty ID and profile picture are required.' });
        }

        // Save the relative path in the database
        const query = 'UPDATE faculty_table SET profilePicture = ? WHERE faculty_id = ?';
        
        db.query(query, [profilePicturePath, facultyId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update profile picture.' });
            }
            res.status(200).json({ success: true, profilePicturePath }); // Return the new path
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Update faculty data
router.post('/updateProfileData', async (req, res) => {
    try {
        const facultyData = req.body; // Get the faculty data from the request body
        
        // Extract faculty_id from facultyData, which should be unique (primary key)
        const { faculty_id } = facultyData;

        if (!faculty_id) {
            return res.status(400).json({ error: 'Faculty ID is required.' });
        }

        // Query to insert or update the faculty data directly
        const query = `
            INSERT INTO faculty_table
            SET ?
            ON DUPLICATE KEY UPDATE
            ?;
        `;

        // Execute query - using facultyData as SET values for both insert and update
        db.query(query, [facultyData, facultyData], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update faculty data.' });
            }

            res.status(200).json({
                message: 'Faculty data updated successfully.',
                results,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint to fetch faculty profile data
router.get('/getProfileData/:facultyId', async (req, res) => {
    try {
        const { facultyId } = req.params;

        if (!facultyId) {
            return res.status(400).json({ error: 'Faculty ID is required.' });
        }

        const query = 'SELECT * FROM faculty_table WHERE faculty_id = ?';
        
        db.query(query, [facultyId], (err, results) => {
            if (err) {
                console.error('Database Query Error:', err);
                return res.status(500).json({ error: 'Failed to fetch profile data.' });
            }

            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Profile not found.' });
            }
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;