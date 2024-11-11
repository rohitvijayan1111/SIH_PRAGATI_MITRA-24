const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../config/db');
const query = util.promisify(db.query).bind(db);
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

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
    const introduction = await generateIntroduction(results);
    
    const summary = await Promise.race([
      summarizeData(results),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Summarization timeout')), 10000)
      )
    ]);
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

module.exports = router;