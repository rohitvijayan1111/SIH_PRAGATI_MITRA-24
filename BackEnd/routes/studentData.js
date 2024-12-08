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

//profile picture
router.put('/updateProfilePicture/:registrationNumber', upload.single('profilePicture'), async (req, res) => {
    try {
        const { registrationNumber } = req.params;
        const profilePicturePath = req.file.path.replace(/\\/g, '/'); // Normalize the path

        if (!registrationNumber || !profilePicturePath) {
            return res.status(400).json({ error: 'Registration number and profile picture are required.' });
        }

        // Save the relative path in the database
        const query = 'UPDATE student_table SET profilePicture = ? WHERE registrationNumber = ?';
        
        db.query(query, [profilePicturePath, registrationNumber], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update profile data.' });
            }
            res.status(200).json({ success: true, profilePicturePath }); // Return the new path
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



router.post('/updateProfileData', async (req, res) => {
  try {
      const userData = req.body; // Get the academic data from the request body
      
      // Extract registrationNumber from academicData, which should be unique (primary key)
      const { registrationNumber } = userData;

      if (!registrationNumber) {
          return res.status(400).json({ error: 'Registration number is required.' });
      }

      // Query to insert or update the academic data directly
      const query = `
          INSERT INTO student_table
          SET ?
          ON DUPLICATE KEY UPDATE
          ?;
      `;

      // Execute query - using academicData as SET values for both insert and update
      db.query(query, [userData, userData], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to update user data.' });
          }

          res.status(200).json({
              message: 'User data updated successfully.',
              results,
          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});


// Endpoint to fetch student profile data
router.get('/getProfileData/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;
  
        // Add more detailed logging
        console.log('Received Registration Number:', registrationNumber);
  
        if (!registrationNumber) {
            return res.status(400).json({ error: 'Registration number is required.' });
        }
  
        // Modify your query to be more flexible
        const query = 'SELECT * FROM student_table WHERE registrationNumber = ? OR registrationNumber LIKE ?';
        
        // Use two parameters to handle potential formatting issues
        db.query(query, [registrationNumber, `%${registrationNumber}%`], (err, results) => {
            if (err) {
                console.error('Database Query Error:', err);
                return res.status(500).json({ error: 'Failed to fetch profile data.' });
            }
  
            console.log('Database Query Results:', results);
  
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                console.warn(`No profile found for registration number: ${registrationNumber}`);
                res.status(404).json({ error: 'Profile not found.' });
            }
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
  });

module.exports = router;
