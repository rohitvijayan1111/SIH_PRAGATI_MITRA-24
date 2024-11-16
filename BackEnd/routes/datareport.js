const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../config/db');
const axios = require('axios');
const query = util.promisify(db.query).bind(db);
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const multer = require('multer');
const moment = require('moment');



const fs = require('fs').promises;
const gemini_api_key = "AIzaSyBHbQhbhN55b1RR00vbUfgeoVoAZgAuj6s";
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

router.get('/section-data', async (req, res) => {
  console.log(gemini_api_key);
  const { section } = req.query;
  const graphdata = [
    { name: 'Science', value: 30 },
    { name: 'Mathematics', value: 20 },
    { name: 'Engineering', value: 25 },
    { name: 'Arts', value: 15 },
  ];

  const sqlQuery = `SELECT 
    department, 
    total_strength, 
    total_eligible_students, 
    total_registered_students, 
    total_placed_students, 
    placement_percentage 
FROM 
    placement;`;

  if (!sqlQuery) {
    return res.status(400).json({ error: "Invalid section" });
  }

  try {
    const results = await query(sqlQuery);
    console.log(results);
    // const introduction = await generateIntroduction(results);
    
    // const summary = await Promise.race([
    //   summarizeData(results),
    //   new Promise((_, reject) => 
    //     setTimeout(() => reject(new Error('Summarization timeout')), 10000)
    //   )
    // ]);

    introduction="hello",
    summary="texting",
    res.json({
      intro: introduction,
      data: results,
      graphdata: {
        config_name: "Departmental Distribution",
        graph_type: "bar",
        data: graphdata,
        colorSettings: {
          Science: "#FF6384",
          Mathematics: "#36A2EB",
          Engineering: "#FFCE56",
          Arts: "#4BC0C0",
        }
      },
      summary: summary // Include the generated summary
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
function formatSummary(summary) {
  // Check if summary is null, undefined, or not a string
  if (!summary || typeof summary !== 'string') {
    console.error('Invalid summary input:', summary);
    return "Unable to generate summary.";
  }

  try {
    // Try different formatting approaches
    // Approach 1: Split by "**"
    if (summary.includes('**')) {
      const parts = summary.split('**').filter(part => part.trim() !== '');
      
      const formattedParts = parts.map((part, index) => {
        // Even indices are headers (bold)
        if (index % 2 === 0) {
          return `**${part.trim()}**`;
        }
        
        // Odd indices are content (bulleted list)
        const listItems = part.split(/\*|\n/)
          .filter(item => item.trim() !== '')
          .map(item => `- ${item.trim()}`);
        
        return listItems.join('\n');
      });

      return formattedParts.join('\n\n');
    }

    // Approach 2: If no "**", try creating sections
    const sections = summary.split('\n\n');
    const formattedSections = sections.map(section => {
      // If section looks like a header, make it bold
      if (section.length < 50 && !section.startsWith('-')) {
        return `**${section.trim()}**`;
      }
      
      // Convert to bulleted list
      const listItems = section.split('\n')
        .filter(item => item.trim() !== '')
        .map(item => `- ${item.trim()}`);
      
      return listItems.join('\n');
    });

    return formattedSections.join('\n\n');
  } catch (error) {
    console.error('Formatting error:', error);
    return summary; // Fallback to original summary if formatting fails
  }
}

async function summarizeData(data) {
  try {
    const dataString = JSON.stringify(data, null, 2); // Pretty print for better readability

    const result = await geminiModel.generateContent(`
      Analyze the following placement data and provide a structured summary:

      Key Focus Areas:
      - Overall placement statistics
      - Department-wise performance
      - Notable trends and insights
      - Placement percentage distribution

      Formatting Guidelines:
      - Use clear, concise language
      - Highlight key metrics
      - Avoid generic phrases
      - Present actionable insights

      Data to Analyze:
      ${dataString}
    `);

    // Enhanced error checking and logging
    if (!result || !result.response) {
      console.error('No response from Gemini');
      return "Unable to generate summary due to API issues.";
    }

    const rawSummary = result.response.text();
    
    // Additional logging for debugging
    console.log('Raw Summary:', rawSummary);

    const formattedSummary = formatSummary(rawSummary);
    
    console.log('Formatted Summary:', formattedSummary);
    
    return formattedSummary;
  } catch (error) {
    console.error("Comprehensive Error in Summarization:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return "Summarization encountered an unexpected error.";
  }
}

async function generateIntroduction(data) {
  try {
    const dataString = JSON.stringify(data, null, 2); // Pretty print for better readability

    const result = await geminiModel.generateContent(`
      Based on the following placement data, generate an engaging introduction that summarizes the overall context and highlights key aspects:

      Data:
      ${dataString}

      The introduction should be concise, engaging, and provide a clear overview of the placement statistics and trends.
    `);

    // Enhanced error checking and logging
    if (!result || !result.response) {
      console.error('No response from Gemini for introduction');
      return "Unable to generate introduction due to API issues.";
    }

    const rawIntroduction = result.response.text();
    
    // Additional logging for debugging
    console.log('Raw Introduction:', rawIntroduction);
    
    return rawIntroduction;
  } catch (error) {
    console.error("Error generating introduction:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return "Introduction generation encountered an unexpected error.";
  }
}
router.post('/create-report', async (req, res) => {
  const { name, sections, assignedUsers, createdBy, deadline } = req.body;

  // Validate input
  if (!name || !sections || !createdBy) {
    return res.status(400).json({ error: 'Name, sections, and createdBy are required fields.' });
  }

  // Ensure sections is an array
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'Sections must be an array.' });
  }

  try {
    const formattedDeadline = deadline 
      ? new Date(deadline).toISOString().slice(0, 19).replace('T', ' ') 
      : null;

    // Insert main report
    const insertReportQuery = `
      INSERT INTO reports 
      (name, created_by, sections, assigned_users, deadline, status) 
      VALUES (?, ?, ?, ?, ?, 'Draft')
    `;
    
    const reportResult = await query(insertReportQuery, [
      name, 
      createdBy, 
      JSON.stringify(sections),
      JSON.stringify(assignedUsers),
      formattedDeadline
    ]);

    // Check if reportResult is valid
    if (!reportResult || !reportResult.insertId) {
      throw new Error('Failed to insert report.');
    }

    const reportId = reportResult.insertId;

    // Insert report sections
    const sectionInsertPromises = sections.map(async (section) => {
      const assignedUser = assignedUsers[section] || null;

      const insertSectionQuery = `
        INSERT INTO report_sections 
        (report_id, section_name, assigned_to) 
        VALUES (?, ?, ?)
      `;

      await query(insertSectionQuery, [
        reportId, 
        section, 
        assignedUser    
      ]);

      // Send email notifications to assigned users
      if (assignedUser) {
        const emailPayload = {
          subject: `${name} Report Section9 was assigned to you`,
          to: assignedUser,
          desc: `Dear ${assignedUser},\n\nYou have been assigned the report section titled "${section}" for the report "${name}". Please be informed that you have been given the responsibility to complete and submit this section before the specified deadline.\n\nGoing forward, you will receive notifications regarding any updates or reminders about the deadline, which is set for ${formattedDeadline}. Kindly ensure timely submission to avoid any delays.\n\nThank you for your cooperation.\n\nBest regards,\n${createdBy}`
        };
        
        // Send email using axios
        await axios.post('http://localhost:3000/mail/send', emailPayload);
      }
    });

    await Promise.all(sectionInsertPromises);

    res.status(201).json({ 
      message: 'Report created successfully', 
      reportId 
    });

  } catch (error) {
    console.error(error); // Log the full error for debugging
    res.status(500).json({ 
      error: 'Failed to create report', 
      details: error.message 
    });
  }
});

// In your reports route
router.get('/:reportId/sections', async (req, res) => {
  const { reportId } = req.params;
  const { role } = req.query;
  console.log("The id is"+reportId);
  console.log(role);
  try {
    // First, check if there are predefined sections for this report
    const [reportSections] = await query(
      'SELECT sections FROM reports WHERE id = ?', 
      [reportId]
    );

    if (reportSections && reportSections.length > 0 && reportSections[0].sections) {
      // If sections are predefined in the report, use those
      return res.json(JSON.parse(reportSections[0].sections));
    }

    // If no predefined sections, determine based on role
    let availableSections;
    switch(role) {
      case 'academic_coordinator':
        availableSections = [
          'Message from Management',
          'Curricular Design and Academic Performances',
          'Research Works & Publications',
          'Faculty Achievement',
          'Student Achievements',
          'Extra Curricular Activities',
          'Infrastructural Development',
          'Financial Statements'
        ];
        break;
      case 'Infrastructure Coordinator':
        availableSections = ['Infrastructural Development'];
        break;
      case 'Finance Coordinator':
        availableSections = ['Financial Statements'];
        break;
      default:
        availableSections = [];
    }

    res.json(availableSections);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching available sections' });
  }
});
// reportId: reportId,
// sectionName: sectionTitle,
// subsectionName: detailTitle,
// introduction: sectionData?.intro || '',
// data: sectionData?.data || [],
// summary: sectionData?.summary || '',
// graphData: sectionData?.graphdata || null,
// createdBy:
router.post('/section-details', async (req, res) => {
  const { 
    reportId,
    sectionName, 
    subsectionName, 
    introduction, 
    data, 
    summary, 
    graphData, 
    createdBy 
  } = req.body;

  console.log(req.body);
  try {
    // Check if an entry already exists
    const existingEntry = await query(
      'SELECT id, version FROM report_section_details WHERE report_id = ? AND section_name = ? AND subsection_name = ?',
      [reportId, sectionName, subsectionName]
    );

    if (existingEntry.length > 0) {
      // Update existing entry
      const updateQuery = `
        UPDATE report_section_details 
        SET 
          introduction = ?, 
          data = ?, 
          summary = ?, 
          graph_data = ?, 
          version = version + 1,  -- Increment the version number
          is_latest = 1          -- Mark the previous version as not latest
        WHERE id = ?
      `;
      
      await query(updateQuery, [
        introduction,
        JSON.stringify(data),
        summary,
        JSON.stringify(graphData),
        existingEntry[0].id
      ]);

      // Insert into version history
      const newVersion = existingEntry[0].version + 1; // Increment version number for version history
      await query(
        `INSERT INTO report_section_versions 
        (report_section_id, version_number, content, updated_by, is_latest) 
        VALUES (?, ?, ?, ?, ?)`,
        [existingEntry[0].id, newVersion, JSON.stringify({ introduction, data, summary, graphData }), createdBy, 1] // Mark as latest
      );

      res.json({ message: 'Section details updated successfully', version: newVersion });
    } else {
      // Insert new entry
      const insertQuery = `
        INSERT INTO report_section_details 
        (report_id, section_name, subsection_name, introduction, data, summary, graph_data, version, is_latest, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertResult = await query(insertQuery, [
        reportId, 
        sectionName, 
        subsectionName,
        introduction,
        JSON.stringify(data), // Save initial content
        summary,
        JSON.stringify(graphData),
        1, // Initial version
        1, // Mark as latest
        createdBy
      ]);

      // Use the inserted ID directly for the version history
      const reportSectionId = insertResult.insertId;

      // Insert into version history
      await query(
        `INSERT INTO report_section_versions 
        (report_section_id, version_number, content, updated_by, is_latest) 
        VALUES (?, ?, ?, ?, ?)`,
        [reportSectionId, 1, JSON.stringify({ introduction, data, summary, graphData }), createdBy, 1] // Mark as latest
      );

      res.status(201).json({ message: 'Section details saved successfully', version: 1 ,report_section_id:reportSectionId});
    }
  } catch (error) {
    console.error('Error saving section details:', error);
    res.status(500).json({ error: 'Failed to save section details' });
  }
});
router.get('/section-versions', async (req, res) => {
  const { reportSectionDetailId } = req.query;
  console.log("request got 2");
  console.log()
  try {
    const versions = await query(
      `SELECT version_number, content, updated_by, updated_at 
       FROM report_section_versions 
       WHERE report_section_id = ? 
       ORDER BY version_number DESC`,
      [reportSectionDetailId]
    );

    res.json({ versions });
  } catch (error) {
    console.error('Error retrieving section versions:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve section versions', 
      details: error.message 
    });
  }
});
// Retrieve Section Details with Version History
router.get('/section-details', async (req, res) => {
  console.log("request got");
  const { 
    reportId, 
    sectionName, 
    subsectionName 
  } = req.query;

  try {
    // Fetch latest version details
    const details = await query(
      `SELECT * FROM report_section_details 
      WHERE report_id = ? AND section_name = ? AND subsection_name = ? AND is_latest = 1`,
      [reportId, sectionName, subsectionName]
    );

    // If no details found
    if (details.length === 0) {
      return res.status(404).json({ 
        error: 'No details found', 
        message: 'No matching section details found' 
      });
    }

    // Fetch version history for the found details
    const versionHistory = await query(
      `SELECT version_number, content, updated_by, updated_at 
       FROM report_section_versions 
       WHERE report_section_id = ? 
       ORDER BY version_number DESC`,
      [details[0].id]
    );

    // Parse JSON fields if necessary
    if (details[0].data) {
      try {
        details[0].data = JSON.parse(details[0].data);
      } catch (parseError) {
        console.warn('Error parsing data JSON:', parseError);
      }
    }

    if (details[0].graph_data) {
      try {
        details[0].graph_data = JSON.parse(details[0].graph_data);
      } catch (parseError) {
        console.warn('Error parsing graph_data JSON:', parseError);
      }
    }

    // Respond with the details and version history
    res.json({
      details: details[0],
      versionHistory
    });
  } catch (error) {
    console.error('Error retrieving section details:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve section details', 
      details: error.message 
    });
  }
});
// Additional route to get all versions of a subsection
router.get('/section-details/versions', async (req, res) => {
  const { 
    reportId, 
    sectionName, 
    subsectionName 
  } = req.query;


  try {
    const versions = await query(
      `SELECT id, version, created_at, created_by, is_latest 
       FROM report_section_details 
       WHERE report_id = ? AND section_name = ? AND subsection_name = ? 
       ORDER BY version DESC`,
      [reportId, sectionName, subsectionName]
    );

    res.json({ versions });
  } catch (error) {
    console.error('Error retrieving section versions:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve section versions', 
      details: error.message 
    });
  }
});
router.get('/getall', async (req, res) => {
  try {
    const reports = await query('SELECT id, name, deadline FROM reports ORDER BY created_at DESC');
    res.json(reports); // Return reports directly, without wrapping in an object
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve reports', 
      details: error.message 
    });
  }
});
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const reportId = req.body.reportId;
      if (!reportId) {
        return cb(new Error('Report ID is required'), null);
      }

      const dir = path.join('./uploads/report_images', reportId.toString());
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const fileName = `${moment().format('YYYYMMDD_HHmmss')}_${file.originalname}`;
    cb(null, fileName);
  }
});

// Set up multer to handle multiple file uploads
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Route to handle image uploads
router.post('/upload-images', upload.array('images'), async (req, res) => {
  try {
    const { reportId, reportSectionDetailId } = req.body;

    // Validate required fields
    if (!reportId || !reportSectionDetailId) {
      return res.status(400).json({
        error: 'Report ID and Report Section Detail ID are required',
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Process and save each image
    const imageInsertPromises = req.files.map(async (file) => {
      const relativePath = path.join('uploads', 'report_images', reportId.toString(), file.filename);

      // Insert record into the database (assuming you have a query function)
      return query(
        `INSERT INTO report_section_images (report_section_detail_id, image_url) VALUES (?, ?)`,
        [reportSectionDetailId, relativePath]
      );
    });

    // Wait for all images to be processed
    await Promise.all(imageInsertPromises);

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: req.files.map(file => path.join('uploads', 'report_images', reportId.toString(), file.filename)),
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      error: 'Failed to upload images ',
      details: error.message,
    });
  }
});

// Endpoint to retrieve images for a section
router.get('/section-images', async (req, res) => {
  const { reportSectionDetailId } = req.query;

  if (!reportSectionDetailId) {
    return res.status(400).json({ error: 'Report Section Detail ID is required' });
  }

  try {
    // Fetch image URLs for the specific section
    const images = await query(
      `SELECT image_url FROM report_section_images 
       WHERE report_section_detail_id = ?`,
      [reportSectionDetailId]
    );

    // Construct relative URLs to the images
    const imageUrls = images.map(img => img.image_url); // Return only the relative path

    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve images', 
      details: error.message 
    });
  }
});

router.delete('/delete-image', async (req, res) => {
  const { imageUrl, reportSectionDetailId } = req.body;

  if (!imageUrl || !reportSectionDetailId) {
      return res.status(400).json({ error: 'Image URL and Report Section Detail ID are required' });
  }

  const normalizedImageUrl = imageUrl.replace(/\//g, '\\');
  const filePath = path.join(__dirname, '..', normalizedImageUrl);

  try {
      // Check and delete the file
      console.log('Normalized Image URL:', normalizedImageUrl);
      console.log('Full File Path:', filePath);

      await fs.access(filePath); // Check if the file exists
      await fs.unlink(filePath); // Delete if it exists

      // Delete from the database
      const dbResult = await query(
          `DELETE FROM report_section_images WHERE image_url = ? AND report_section_detail_id = ?`,
          [normalizedImageUrl, reportSectionDetailId]
      );

      if (dbResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Record not found in database' });
      }

      res.status(204).send(); // Successfully deleted
  } catch (err) {
      if (err.code === 'ENOENT') {
          console.error('File not found:', err);
          return res.status(404).json({ error: 'File not found' });
      }
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to delete image', details: err.message });
  }
});
module.exports = router;
