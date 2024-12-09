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

const sectionQueries = {
  'List of Courses Offered': {
    sql: `SELECT distinct department from student_tables;`,
    graph: {
      query:null,
      type:"",
    }
  },
  'Overall and Department-wise Faculty Count and Faculty-Student Ratios': {
    sql: `SELECT faculty_table.department,
       COUNT(DISTINCT faculty_table.faculty_id) AS faculty_count,
       COUNT(DISTINCT student_tables.registrationNumber) AS student_count
FROM faculty_table
LEFT JOIN student_tables ON faculty_table.department = student_tables.Department
GROUP BY faculty_table.department;
`,
    graph: {
      query:null,
      type:"",
    },
  },
  'Placement Summary': {
    sql: `SELECT company, package, COUNT(*) AS student_count
FROM student_details
WHERE placementStatus = 1
GROUP BY company, package;
;`,
    graph: {
      query:`SELECT department, COUNT(*) AS placed_students_count
FROM student_details
WHERE placementStatus = 1
GROUP BY department;
`,
      type:"line",
    }
  },
 // 'Overall Pass and Fail Percentage': {
//     sql: `SELECT 
//     SUM(CASE WHEN backlogs = 0 THEN 1 ELSE 0 END) AS overall_pass_count,
//     SUM(CASE WHEN backlogs = 1 THEN 1 ELSE 0 END) AS overall_fail_count
// FROM student_details;
// `,
//     graph: {
//       query:`SELECT 
//     SUM(CASE WHEN backlogs = 0 THEN 1 ELSE 0 END) AS overall_pass_count,
//     SUM(CASE WHEN backlogs = 1 THEN 1 ELSE 0 END) AS overall_fail_count
// FROM student_details;`,
//       type:"pie",
//     },
//   },

  'Department-wise Pass and Fail Percentage': {
    sql: `SELECT 
    department,
    SUM(CASE WHEN backlogs = 0 THEN 1 ELSE 0 END) AS pass_count,
    SUM(CASE WHEN backlogs = 1 THEN 1 ELSE 0 END) AS fail_count
FROM student_details
GROUP BY department;`,
    graph: {
      query:`SELECT 
    CASE 
        WHEN placementStatus = 1 THEN 'Pass' 
        ELSE 'Fail' 
    END AS Status, 
    COUNT(*) AS Count
FROM student_details
GROUP BY placementStatus;
`,
      type:"pie",
    }},

    'Average CGPA of Students': {
      sql: `SELECT department, AVG(cgpa) AS average_cgpa
FROM student_details
GROUP BY department;`,
      graph: {
        query:`SELECT department, AVG(cgpa) AS average_cgpa
FROM student_details
GROUP BY department;`,
        type:"bar",
      }},
    'Graduation Rate of College': {
      sql: `SELECT 
    department,
    (SUM(CASE WHEN backlogs = 0 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS graduation_percentage
FROM student_details
GROUP BY department;`,
      graph: {
        query:null,
        type:"",
      }
    },
    'Guest Lectures Organized': {
      sql: `SELECT * from work_semi where type="Guest Lecture";`,
      graph: {
        query:null,
        type:"",
      },
    },
    'Industrial Visits Organized': {
      sql: `SELECT * from IVDetails;`,
      graph: {
        query:null,
        type:"",
      },
    },
//     'University Rank Holders': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
// 'Institution Research Strategy and Summary': {
//   sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//   graph: {
//     query:"Hello",
//     type:"",
//   },
// },
//     'Total Funds Received': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
//     'Major Grants & Scholarships': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
//     'List of Ongoing Research Projects': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
//     'List of Journal Papers Published': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
//     'List of Patents Grants': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
//     'Training Programmes Offered': {
//       sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
//       graph: {
//         query:"Hello",
//         type:"",
//       },
// },
    'List of Faculties Department-wise':{
      sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
      graph: {
        query:"Hello",
        type:"",
      },
},
      'Awards Received':{
      sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
      graph: {
        query:"Hello",
        type:"",
      },
},
      'Research Works  Projects and Publications':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
  },
      'Advanced Degree / Certifications':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
  },
      'Leadership Roles':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
  },
      'Public Lectures':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
  }
  ,
  'Top Performers in Academics':{
    sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
    graph: {
      query:"Hello",
      type:"",
    },
},
      'Awards Received by Students':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Scholarships Received':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Competition Wins':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Internships':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Projects':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
    'Income / Revenue Statement':{
      sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
      graph: {
        query:"Hello",
        type:"",
      },
  },
      'Expenditure':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Net Income Statement':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Investments':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
    'New Academic, Administrative & Residential Buildings Introduced':{
      sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
      graph: {
        query:"Hello",
        type:"",
      },
  },
      'Renovations & Upgradations':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Campus Expansion – Lands Purchase Statements':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Laboratories Inaugurated':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Equipment Purchase Statements':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Utility Improvements':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
      'Sustainability & Green Campus Initializations':{
        sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
        graph: {
          query:"Hello",
          type:"",
        },
    },
    'List of Clubs':{
      sql: `SELECT * from club_details;`,
      graph: {
        query:'SELECT club_name,Students_enrolled from club_details',
        type:"bar",
      },
  },
      'List of Cells / Committees':{
        sql: `SELECT * from cells;`,
        graph: {
          query:null,
          type:"",
        },
    },
      'List of Sports Available':{
        sql: `SELECT * from sports_details;`,
        graph: {
          query:null,
          type:"",
        },
    },
      'Workshops & Seminars for Students & Faculties':{
        sql: `SELECT * from work_semi`,
        graph: {
          query:null,
          type:"",
        },
    },
      // 'Cultural Events':{
      //   sql: `SELECT overall_pass_percentage, overall_fail_percentage FROM performance_summary;`,
      //   graph: {
      //     query:"Hello",
      //     type:"",
      //   },
   // },
    'Physical Infrastructure':{
      sql:'SELECT facility_name,quantity,total_area_sqft,year_of_addition,status from physical_infrastructure;',
      graph: {
        query:'SELECT facility_name,quantity from physical_infrastructure;',
        type:"bar",
      },
    },
    'Digital Infrastructure':{
      sql:'SELECT resource_name,quantity,status from digital_infrastructure;',
      graph:{
        query:null,
        type:"",
      },
    },
    'Green Initiatives':{
      sql:'SELECT initiative_name, implementation_date,impact_description,completion_percentage from green_initiatives;',
      graph:{
        query:'SELECT initiative_name,completion_percentage from green_initiatives;',
        type:'line',
      },
    },
    'Sources of Income':{
      sql:'SELECT source, income from income_table;',
      graph:{
        query:'SELECT source, income from income_table;',
        type:'bar',
      },
    },
  'Expense statements':{
    sql:'SELECT liabilities, cost from expense_table;',
    graph:{
    query:'SELECT liabilities, cost from expense_table;',
      type:'pie',
    },
  },
'Salary statements':{
  sql:'SELECT position,count,per_head_salary,salary from salary_table;',
  graph:{
    query:null,
    type:'',
  },
},
'Revenue generated': {
  sql: `
    SELECT 
        (income_table.total_income - (expense_table.total_expenditure + salary_table.total_salaries)) AS Revenue_Generated
    FROM 
        (SELECT SUM(income) AS total_income FROM income_table) AS income_table,
        (SELECT SUM(cost) AS total_expenditure FROM expense_table) AS expense_table,
        (SELECT SUM(salary) AS total_salaries FROM salary_table) AS salary_table;
  `,
  graph: {
    query: `
      SELECT 
          'Income' AS category, SUM(income) AS value FROM income_table
      UNION ALL
      SELECT 
          'Expenditure' AS category, SUM(cost) AS value FROM expense_table
      UNION ALL
      SELECT 
          'Salaries' AS category, SUM(salary) AS value FROM salary_table;
    `,
    type: 'bar', // Or 'pie' depending on how you want to visualize.
  },
},
'Overall Performance':{
      sql:'SELECT achievement_type, COUNT(*) AS count FROM faculty_achievements GROUP BY achievement_type',
      graph:{
        query:'SELECT achievement_type, COUNT(*) AS count FROM faculty_achievements GROUP BY achievement_type',
        type:'pie',
      },
    },
'Research Works Projects and Book Publications':{
      sql:'SELECT id as faculty_ID, title as Research_paper_titles, patent_type as patents, book_title FROM faculty_achievements',
      graph:{
        query:null,
        type:'',
      },
    },
    'Awards Received':{
      sql:'SELECT id,  award_title ,awarding_body, award_category  from faculty_achievements;',
      graph:{
        query:null,
        type:'',
      },
    },
    'Conference details':{
      sql:'SELECT id,conference_title,presenter,organizer,date_presented from faculty_achievements;',
      graph:{
        query:null,
        type:'',
      },
    },
    'Paper Publications':{
      sql:'SELECT id,department,title,conferenceDetails,teamMembers,startDate,outcomes from student_achievements where achievementType="Publication";',
      graph:{
        query:null,
        type:'',
      },
    },
    'Hackathons':{
      sql:'SELECT id,department,title,teamMembers,startDate,outcomes from student_achievements where achievementType="Hackathon";',
      graph:{
        query:null,
        type:'',
      },
    },
    'Patents':{
      sql:'SELECT id,department,serialNo,title,teamMembers,research_area,outcomes from student_achievements where achievementType="Patent";',
      graph:{
        query:null,
        type:'',
      },
    },
    'Symposiums':{
      sql:'SELECT id,department,title,organizer,teamMembers,achievement from student_achievements where achievementType="Symposium";',
      graph:{
        query:null,
        type:'',
      },
    },
    'Overall Performance':{
      sql:'SELECT achievementType, COUNT(*) AS count FROM student_achievements GROUP BY achievementType;',
      graph:{
        query:'SELECT achievementType, COUNT(*) AS count FROM student_achievements GROUP BY achievementType;',
        type:'pie',
      },
    },
    'List of Faculties Department-wise':{
      sql:'SELECT Name, department, Designation FROM faculty_table;',
      graph:{
        query:'SELECT department, COUNT(*) AS faculty_count FROM faculty_table GROUP BY department;',
        type:'pie',
      },
    },
    'List of Students Department-wise':{
      sql:'SELECT Department, COUNT(*) AS NumberOfStudents FROM student_tables GROUP BY Department;',
      graph:{
        query:'SELECT Department, COUNT(*) AS NumberOfStudents FROM student_tables GROUP BY Department;',
        type:'pie',
      },
    },
    'IT List of Faculties':{
      sql:'SELECT Name, department, Designation FROM faculty_table where department="IT";',
      graph:{
        query:null,
        type:'',
      },
    },
    'Student Faculty ratio':{
      sql:'SELECT "Faculty" AS Type, COUNT(*) AS Count FROM faculty_table WHERE department = "IT" UNION ALL SELECT "Student" AS Type, COUNT(*) AS Count FROM student_tables WHERE department = "IT";',
      graph:{
        query:'SELECT "Faculty" AS Type, COUNT(*) AS Count FROM faculty_table WHERE department = "IT" UNION ALL SELECT "Student" AS Type, COUNT(*) AS Count FROM student_tables WHERE department = "IT";',
        type:'bar',
      },
    },
    'IT Students Achievements':{
      sql:'SELECT achievementType,teamMembers,organizer from student_achievements where department="IT";',
      graph:{
        query:null,
        type:'',
      },
    },
    'IT Faculty Achievements':{
      sql:'SELECT achievement_type,authors from faculty_achievements where department="IT";',
      graph:{
        query:null,
        type:'',
      },
    },
    'IT Placement details':{
      sql:'SELECT company,count(registernumber) as no_of_students,package FROM student_details WHERE department = "IT" AND placementStatus = TRUE group by registernumber;',
      graph:{
        query:null,
        type:'',
      },
    },
  'IT GuestLectures':{
    sql:'SELECT * from work_semi where dept="IT" AND type="Guest Lecture";',
    graph:{
      query:null,
      type:'',
    },
  },
  'IT Industrial Visits':{
    sql:'SELECT * from IVDetails where department="IT";',
    graph:{
      query:null,
      type:'',
    },
  },
};

const formatGraphData = (graphResults,type) => {
  if (graphResults.length === 0) return [];
  // Check if result has multiple value columns
  const keys = Object.keys(graphResults[0]);
  if (type!="pie" && type!="line" && keys.length > 1) {
    // Multi-value data transformation
    return graphResults.map(item => {
      const [name, ...valueKeys] = keys;
      const values = {};
      valueKeys.forEach(key => {
        values[key] = item[key];
      });
      return {
        name: item[name],
        values
      };
    });
  }

  // Fallback to single-value format
  return graphResults.map(item => {
    const values = Object.values(item);
    return {
      name: values[0],
      value: values[1]
    };
  });
};
router.get('/section-data', async (req, res) => {
  console.log(gemini_api_key);
  const { section } = req.query;
  console.log('Section received:', section);
  const sectionConfig = sectionQueries[section];
  console.log(sectionConfig);
  // const graphdata = [
  //   { name: 'Science', value: 30 },
  //   { name: 'Mathematics', value: 20 },
  //   { name: 'Engineering', value: 25 },
  //   { name: 'Arts', value: 15 },
  // ];

  const sqlQuery = sectionConfig.sql;
  const graphQuery = sectionConfig.graph.query;
  const graph_type=sectionConfig.graph.type;

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
    // Prepare the graph data
    let graphdata = [];
    if (graphQuery) {
      const graphResults = await query(graphQuery);
      console.log('Graph query results:', graphResults);
      console.log("Graphy Tpye"+graph_type);
      // Format the graph results into the required format
      graphdata = formatGraphData(graphResults,graph_type);
    }
    // introduction="hello",
    // summary="texting",
    res.json({
      intro: introduction,
      data: results,
      graphdata: {
        config_name: section,
        graph_type:  graph_type,
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
          subject: `${name} Report Section sections9 was assigned to you`,
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
      'SELECT sections FROM reports WHERE id = ? ', 
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
          'Department of IT',
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
    youtubeUrl, 
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
      console.log(existingEntry[0].id);
      // Update existing entry
      const updateQuery = `
        UPDATE report_section_details 
        SET 
          introduction = ?, 
          data = ?, 
          summary = ?, 
          graph_data = ?,
          youtube_url=?, 
          version = version + 1,  -- Increment the version number
          is_latest = 1          -- Mark the previous version as not latest
        WHERE id = ?
      `;
      
      await query(updateQuery, [
        introduction,
        JSON.stringify(data),
        summary,
        JSON.stringify(graphData),
        youtubeUrl,
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
(report_id, section_name, subsection_name, introduction, data, summary, graph_data, version, is_latest, youtube_url, created_by) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)

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
        youtubeUrl,
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
    const { reportId, reportSectionDetailId, descriptions } = req.body;
    console.log("Descriptions:", descriptions);
    console.log("Report section ID:", reportSectionDetailId);

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

    // Ensure descriptions is an array
    const descriptionArray = Array.isArray(descriptions) 
      ? descriptions 
      : [descriptions].filter(Boolean);

    // Process and save each image
    const imageInsertPromises = req.files.map(async (file, index) => {
      const relativePath = path.join('uploads', 'report_images', reportId.toString(), file.filename);

      // Get description for this image, default to empty string if not provided
      const description = descriptionArray[index] || '';

      // Insert record into the database
      return query(
        `INSERT INTO report_section_images (report_section_detail_id, image_url, description) VALUES (?, ?, ?)`,
        [reportSectionDetailId, relativePath, description]
      );
    });

    // Wait for all images to be processed
    await Promise.all(imageInsertPromises);

    // Fetch the inserted images with their descriptions
    const insertedImages = await query(
      `SELECT image_url, description FROM report_section_images 
       WHERE report_section_detail_id = ?`,
      [reportSectionDetailId]
    );

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: insertedImages
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      error: 'Failed to upload images',
      details: error.message,
    });
  }
});

router.get('/section-images', async (req, res) => {
  const { reportSectionDetailId } = req.query;

  if (!reportSectionDetailId) {
    return res.status(400).json({ error: 'Report Section Detail ID is required' });
  }

  try {
    // Fetch image URLs and descriptions for the specific section
    const images = await query(
      `SELECT image_url, description 
       FROM report_section_images 
       WHERE report_section_detail_id = ?`,
      [reportSectionDetailId]
    );

    // Construct response with both image URL and description
    const imageDetails = images.map(img => ({
      url: img.image_url,  // Relative path to the image
      description: img.description
    }));

    res.json({ images: imageDetails });
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

    try {
      // Check if file exists and delete it
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log('File deleted successfully');
    } catch (fileErr) {
      if (fileErr.code === 'ENOENT') {
        console.log('File not found, continuing with database deletion');
      } else {
        throw fileErr; // Re-throw if it's a different error
      }
    }

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
    console.error('Error:', err);
    
    // Differentiate between different types of errors
    if (err.code === 'EACCES') {
      return res.status(403).json({ 
        error: 'Permission denied', 
        details: 'Cannot delete the file due to permission issues' 
      });
    } else if (err.code === 'EBUSY') {
      return res.status(409).json({ 
        error: 'Resource busy', 
        details: 'File is currently in use' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to delete image', 
      details: err.message 
    });
  }
});


router.post('/create-chat', async (req, res) => {
  const { 
    reportId, 
    reportSectionDetailId, 
    sectionName, 
    subsectionName, 
    messageType = 'general' 
  } = req.body;

  try {
    // First, create a new section chat entry
    const createChatQuery = `
      INSERT INTO report_section_chats 
      (report_id, report_section_detail_id, section_name, subsection_name, message_type) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const chatResult = await query(createChatQuery, [
      reportId, 
      reportSectionDetailId, 
      sectionName, 
      subsectionName, 
      messageType
    ]);

    res.status(201).json({ 
      message: 'Chat created successfully', 
      chatId: chatResult.insertId 
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ 
      error: 'Failed to create chat', 
      details: error.message 
    });
  }
});

// Send a message in a chat
router.post('/send', async (req, res) => {
  const { 
    reportId, 
    reportSectionDetailId, 
    sectionName, 
    subsectionName, 
    message, 
    sender,
    type = 'general'
  } = req.body;

  try {
    // First, find or create the chat
    let chatId;
    const findChatQuery = `
      SELECT id FROM report_section_chats 
      WHERE report_id = ? 
      AND report_section_detail_id = ? 
      AND section_name = ? 
      AND subsection_name = ? 
      AND message_type = ?
    `;
    
    const existingChats = await query(findChatQuery, [
      reportId, 
      reportSectionDetailId, 
      sectionName, 
      subsectionName, 
      type
    ]);

    if (existingChats.length > 0) {
      chatId = existingChats[0].id;
    } else {
      // Create a new chat if not exists
      const createChatQuery = `
        INSERT INTO report_section_chats 
        (report_id, report_section_detail_id, section_name, subsection_name, message_type) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const chatResult = await query(createChatQuery, [
        reportId, 
        reportSectionDetailId, 
        sectionName, 
        subsectionName, 
        type
      ]);
      
      chatId = chatResult.insertId;
    }

    // Insert the message
    const sendMessageQuery = `
      INSERT INTO report_chat_messages 
      (chat_id, sender, message) 
      VALUES (?, ?, ?)
    `;
    
    const messageResult = await query(sendMessageQuery, [
      chatId, 
      sender, 
      message
    ]);

    // Retrieve the inserted message
    const retrieveMessageQuery = `
      SELECT * FROM report_chat_messages 
      WHERE id = ?
    `;
    
    const [insertedMessage] = await query(retrieveMessageQuery, [messageResult.insertId]);

    res.status(201).json({ 
      message: 'Message sent successfully', 
      message: insertedMessage 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message', 
      details: error.message 
    });
  }
});

// Get messages for a specific chat
router.get('/messages', async (req, res) => {
  const { 
    reportId, 
    sectionName, 
    subsectionName, 
    messageType = 'general' 
  } = req.query;

  try {
    // Retrieve all chats for the subsection with the specified message type
    const retrieveChatsQuery = `
      SELECT 
        rsc.id AS chat_id,
        rsc.message_type,
        rcm.*
      FROM report_section_chats rsc
      LEFT JOIN report_chat_messages rcm ON rsc.id = rcm.chat_id
      WHERE rsc.report_id = ? 
      AND rsc.section_name = ? 
      AND rsc.subsection_name = ? 
      AND rsc.message_type = ?
      ORDER BY rcm.timestamp ASC
    `;
    
    const chats = await query(retrieveChatsQuery, [
      reportId, 
      sectionName, 
      subsectionName, 
      messageType
    ]);

    // Group messages by chat if multiple chats exist
    const groupedMessages = chats.reduce((acc, chat) => {
      // If the chat doesn't exist in the accumulator, create an empty array
      if (!acc[chat.chat_id]) {
        acc[chat.chat_id] = [];
      }

      // Only add the message if it exists (to handle chats without messages)
      if (chat.id) {
        acc[chat.chat_id].push({
          id: chat.id,
          chat_id: chat.chat_id,
          sender: chat.sender,
          message: chat.message,
          timestamp: chat.timestamp,
          status: chat.status
        });
      }

      return acc;
    }, {});

    // Convert grouped messages to an array
    const formattedMessages = Object.values(groupedMessages);

    // If no chats or messages found, return empty array
    if (formattedMessages.length === 0) {
      return res.json({ messages: [] });
    }

    // If only one chat exists, return its messages directly
    res.json({ 
      messages: formattedMessages.length === 1 
        ? formattedMessages[0] 
        : formattedMessages 
    });

  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve messages', 
      details: error.message 
    });
  }
});
// Update message status (e.g., mark as resolved)
router.patch('/message-status', async (req, res) => {
  const { messageId, status } = req.body;

  try {
    const updateStatusQuery = `
      UPDATE report_chat_messages 
      SET status = ? 
      WHERE id = ?
    `;
    
    await query(updateStatusQuery, [status, messageId]);

    res.json({ 
      message: 'Message status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ 
      error: 'Failed to update message status', 
      details: error.message 
    });
  }
});

module.exports = router;
