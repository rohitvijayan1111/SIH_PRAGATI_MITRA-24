"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var router = express.Router();

var util = require('util');

var db = require('../config/db');

var axios = require('axios');

var query = util.promisify(db.query).bind(db);

var path = require('path');

var _require = require("@google/generative-ai"),
    GoogleGenerativeAI = _require.GoogleGenerativeAI;

require('dotenv').config();

var multer = require('multer');

var moment = require('moment');

var fs = require('fs').promises;

var gemini_api_key = "AIzaSyBHbQhbhN55b1RR00vbUfgeoVoAZgAuj6s";
var googleAI = new GoogleGenerativeAI(gemini_api_key);
var geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096
};
var geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig: geminiConfig
});
router.get('/section-data', function _callee(req, res) {
  var section, graphdata, sqlQuery, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(gemini_api_key);
          section = req.query.section;
          graphdata = [{
            name: 'Science',
            value: 30
          }, {
            name: 'Mathematics',
            value: 20
          }, {
            name: 'Engineering',
            value: 25
          }, {
            name: 'Arts',
            value: 15
          }];
          sqlQuery = "SELECT \n    department, \n    total_strength, \n    total_eligible_students, \n    total_registered_students, \n    total_placed_students, \n    placement_percentage \nFROM \n    placement;";

          if (sqlQuery) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Invalid section"
          }));

        case 6:
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(query(sqlQuery));

        case 9:
          results = _context.sent;
          console.log(results); // const introduction = await generateIntroduction(results);
          // const summary = await Promise.race([
          //   summarizeData(results),
          //   new Promise((_, reject) => 
          //     setTimeout(() => reject(new Error('Summarization timeout')), 10000)
          //   )
          // ]);

          introduction = "hello", summary = "texting", res.json({
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
                Arts: "#4BC0C0"
              }
            },
            summary: summary // Include the generated summary

          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](6);
          console.log(_context.t0.message);
          res.status(500).json({
            error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 14]]);
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
      var parts = summary.split('**').filter(function (part) {
        return part.trim() !== '';
      });
      var formattedParts = parts.map(function (part, index) {
        // Even indices are headers (bold)
        if (index % 2 === 0) {
          return "**".concat(part.trim(), "**");
        } // Odd indices are content (bulleted list)


        var listItems = part.split(/\*|\n/).filter(function (item) {
          return item.trim() !== '';
        }).map(function (item) {
          return "- ".concat(item.trim());
        });
        return listItems.join('\n');
      });
      return formattedParts.join('\n\n');
    } // Approach 2: If no "**", try creating sections


    var sections = summary.split('\n\n');
    var formattedSections = sections.map(function (section) {
      // If section looks like a header, make it bold
      if (section.length < 50 && !section.startsWith('-')) {
        return "**".concat(section.trim(), "**");
      } // Convert to bulleted list


      var listItems = section.split('\n').filter(function (item) {
        return item.trim() !== '';
      }).map(function (item) {
        return "- ".concat(item.trim());
      });
      return listItems.join('\n');
    });
    return formattedSections.join('\n\n');
  } catch (error) {
    console.error('Formatting error:', error);
    return summary; // Fallback to original summary if formatting fails
  }
}

function summarizeData(data) {
  var dataString, result, rawSummary, formattedSummary;
  return regeneratorRuntime.async(function summarizeData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataString = JSON.stringify(data, null, 2); // Pretty print for better readability

          _context2.next = 4;
          return regeneratorRuntime.awrap(geminiModel.generateContent("\n      Analyze the following placement data and provide a structured summary:\n\n      Key Focus Areas:\n      - Overall placement statistics\n      - Department-wise performance\n      - Notable trends and insights\n      - Placement percentage distribution\n\n      Formatting Guidelines:\n      - Use clear, concise language\n      - Highlight key metrics\n      - Avoid generic phrases\n      - Present actionable insights\n\n      Data to Analyze:\n      ".concat(dataString, "\n    ")));

        case 4:
          result = _context2.sent;

          if (!(!result || !result.response)) {
            _context2.next = 8;
            break;
          }

          console.error('No response from Gemini');
          return _context2.abrupt("return", "Unable to generate summary due to API issues.");

        case 8:
          rawSummary = result.response.text(); // Additional logging for debugging

          console.log('Raw Summary:', rawSummary);
          formattedSummary = formatSummary(rawSummary);
          console.log('Formatted Summary:', formattedSummary);
          return _context2.abrupt("return", formattedSummary);

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error("Comprehensive Error in Summarization:", {
            message: _context2.t0.message,
            stack: _context2.t0.stack,
            name: _context2.t0.name
          });
          return _context2.abrupt("return", "Summarization encountered an unexpected error.");

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

function generateIntroduction(data) {
  var dataString, result, rawIntroduction;
  return regeneratorRuntime.async(function generateIntroduction$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataString = JSON.stringify(data, null, 2); // Pretty print for better readability

          _context3.next = 4;
          return regeneratorRuntime.awrap(geminiModel.generateContent("\n      Based on the following placement data, generate an engaging introduction that summarizes the overall context and highlights key aspects:\n\n      Data:\n      ".concat(dataString, "\n\n      The introduction should be concise, engaging, and provide a clear overview of the placement statistics and trends.\n    ")));

        case 4:
          result = _context3.sent;

          if (!(!result || !result.response)) {
            _context3.next = 8;
            break;
          }

          console.error('No response from Gemini for introduction');
          return _context3.abrupt("return", "Unable to generate introduction due to API issues.");

        case 8:
          rawIntroduction = result.response.text(); // Additional logging for debugging

          console.log('Raw Introduction:', rawIntroduction);
          return _context3.abrupt("return", rawIntroduction);

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error("Error generating introduction:", {
            message: _context3.t0.message,
            stack: _context3.t0.stack,
            name: _context3.t0.name
          });
          return _context3.abrupt("return", "Introduction generation encountered an unexpected error.");

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

router.post('/create-report', function _callee3(req, res) {
  var _req$body, name, sections, assignedUsers, createdBy, deadline, formattedDeadline, insertReportQuery, reportResult, reportId, sectionInsertPromises;

  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, sections = _req$body.sections, assignedUsers = _req$body.assignedUsers, createdBy = _req$body.createdBy, deadline = _req$body.deadline; // Validate input

          if (!(!name || !sections || !createdBy)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Name, sections, and createdBy are required fields.'
          }));

        case 3:
          if (Array.isArray(sections)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Sections must be an array.'
          }));

        case 5:
          _context5.prev = 5;
          formattedDeadline = deadline ? new Date(deadline).toISOString().slice(0, 19).replace('T', ' ') : null; // Insert main report

          insertReportQuery = "\n      INSERT INTO reports \n      (name, created_by, sections, assigned_users, deadline, status) \n      VALUES (?, ?, ?, ?, ?, 'Draft')\n    ";
          _context5.next = 10;
          return regeneratorRuntime.awrap(query(insertReportQuery, [name, createdBy, JSON.stringify(sections), JSON.stringify(assignedUsers), formattedDeadline]));

        case 10:
          reportResult = _context5.sent;

          if (!(!reportResult || !reportResult.insertId)) {
            _context5.next = 13;
            break;
          }

          throw new Error('Failed to insert report.');

        case 13:
          reportId = reportResult.insertId; // Insert report sections

          sectionInsertPromises = sections.map(function _callee2(section) {
            var assignedUser, insertSectionQuery, emailPayload;
            return regeneratorRuntime.async(function _callee2$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    assignedUser = assignedUsers[section] || null;
                    insertSectionQuery = "\n        INSERT INTO report_sections \n        (report_id, section_name, assigned_to) \n        VALUES (?, ?, ?)\n      ";
                    _context4.next = 4;
                    return regeneratorRuntime.awrap(query(insertSectionQuery, [reportId, section, assignedUser]));

                  case 4:
                    if (!assignedUser) {
                      _context4.next = 8;
                      break;
                    }

                    emailPayload = {
                      subject: "".concat(name, " Report Section9 was assigned to you"),
                      to: assignedUser,
                      desc: "Dear ".concat(assignedUser, ",\n\nYou have been assigned the report section titled \"").concat(section, "\" for the report \"").concat(name, "\". Please be informed that you have been given the responsibility to complete and submit this section before the specified deadline.\n\nGoing forward, you will receive notifications regarding any updates or reminders about the deadline, which is set for ").concat(formattedDeadline, ". Kindly ensure timely submission to avoid any delays.\n\nThank you for your cooperation.\n\nBest regards,\n").concat(createdBy)
                    }; // Send email using axios

                    _context4.next = 8;
                    return regeneratorRuntime.awrap(axios.post('http://localhost:3000/mail/send', emailPayload));

                  case 8:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });
          _context5.next = 17;
          return regeneratorRuntime.awrap(Promise.all(sectionInsertPromises));

        case 17:
          res.status(201).json({
            message: 'Report created successfully',
            reportId: reportId
          });
          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](5);
          console.error(_context5.t0); // Log the full error for debugging

          res.status(500).json({
            error: 'Failed to create report',
            details: _context5.t0.message
          });

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 20]]);
}); // In your reports route

router.get('/:reportId/sections', function _callee4(req, res) {
  var reportId, role, _ref, _ref2, reportSections, availableSections;

  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          reportId = req.params.reportId;
          role = req.query.role;
          console.log("The id is" + reportId);
          console.log(role);
          _context6.prev = 4;
          _context6.next = 7;
          return regeneratorRuntime.awrap(query('SELECT sections FROM reports WHERE id = ?', [reportId]));

        case 7:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 1);
          reportSections = _ref2[0];

          if (!(reportSections && reportSections.length > 0 && reportSections[0].sections)) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", res.json(JSON.parse(reportSections[0].sections)));

        case 12:
          _context6.t0 = role;
          _context6.next = _context6.t0 === 'academic_coordinator' ? 15 : _context6.t0 === 'Infrastructure Coordinator' ? 17 : _context6.t0 === 'Finance Coordinator' ? 19 : 21;
          break;

        case 15:
          availableSections = ['Message from Management', 'Curricular Design and Academic Performances', 'Research Works & Publications', 'Faculty Achievement', 'Student Achievements', 'Extra Curricular Activities', 'Infrastructural Development', 'Financial Statements'];
          return _context6.abrupt("break", 22);

        case 17:
          availableSections = ['Infrastructural Development'];
          return _context6.abrupt("break", 22);

        case 19:
          availableSections = ['Financial Statements'];
          return _context6.abrupt("break", 22);

        case 21:
          availableSections = [];

        case 22:
          res.json(availableSections);
          _context6.next = 28;
          break;

        case 25:
          _context6.prev = 25;
          _context6.t1 = _context6["catch"](4);
          res.status(500).json({
            error: 'Error fetching available sections'
          });

        case 28:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 25]]);
}); // reportId: reportId,
// sectionName: sectionTitle,
// subsectionName: detailTitle,
// introduction: sectionData?.intro || '',
// data: sectionData?.data || [],
// summary: sectionData?.summary || '',
// graphData: sectionData?.graphdata || null,
// createdBy:

router.post('/section-details', function _callee5(req, res) {
  var _req$body2, reportId, sectionName, subsectionName, introduction, data, summary, graphData, createdBy, existingEntry, updateQuery, newVersion, insertQuery, insertResult, reportSectionId;

  return regeneratorRuntime.async(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, reportId = _req$body2.reportId, sectionName = _req$body2.sectionName, subsectionName = _req$body2.subsectionName, introduction = _req$body2.introduction, data = _req$body2.data, summary = _req$body2.summary, graphData = _req$body2.graphData, createdBy = _req$body2.createdBy;
          console.log(req.body);
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(query('SELECT id, version FROM report_section_details WHERE report_id = ? AND section_name = ? AND subsection_name = ?', [reportId, sectionName, subsectionName]));

        case 5:
          existingEntry = _context7.sent;

          if (!(existingEntry.length > 0)) {
            _context7.next = 16;
            break;
          }

          // Update existing entry
          updateQuery = "\n        UPDATE report_section_details \n        SET \n          introduction = ?, \n          data = ?, \n          summary = ?, \n          graph_data = ?, \n          version = version + 1,  -- Increment the version number\n          is_latest = 1          -- Mark the previous version as not latest\n        WHERE id = ?\n      ";
          _context7.next = 10;
          return regeneratorRuntime.awrap(query(updateQuery, [introduction, JSON.stringify(data), summary, JSON.stringify(graphData), existingEntry[0].id]));

        case 10:
          // Insert into version history
          newVersion = existingEntry[0].version + 1; // Increment version number for version history

          _context7.next = 13;
          return regeneratorRuntime.awrap(query("INSERT INTO report_section_versions \n        (report_section_id, version_number, content, updated_by, is_latest) \n        VALUES (?, ?, ?, ?, ?)", [existingEntry[0].id, newVersion, JSON.stringify({
            introduction: introduction,
            data: data,
            summary: summary,
            graphData: graphData
          }), createdBy, 1] // Mark as latest
          ));

        case 13:
          res.json({
            message: 'Section details updated successfully',
            version: newVersion
          });
          _context7.next = 24;
          break;

        case 16:
          // Insert new entry
          insertQuery = "\n        INSERT INTO report_section_details \n        (report_id, section_name, subsection_name, introduction, data, summary, graph_data, version, is_latest, created_by) \n        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n      ";
          _context7.next = 19;
          return regeneratorRuntime.awrap(query(insertQuery, [reportId, sectionName, subsectionName, introduction, JSON.stringify(data), // Save initial content
          summary, JSON.stringify(graphData), 1, // Initial version
          1, // Mark as latest
          createdBy]));

        case 19:
          insertResult = _context7.sent;
          // Use the inserted ID directly for the version history
          reportSectionId = insertResult.insertId; // Insert into version history

          _context7.next = 23;
          return regeneratorRuntime.awrap(query("INSERT INTO report_section_versions \n        (report_section_id, version_number, content, updated_by, is_latest) \n        VALUES (?, ?, ?, ?, ?)", [reportSectionId, 1, JSON.stringify({
            introduction: introduction,
            data: data,
            summary: summary,
            graphData: graphData
          }), createdBy, 1] // Mark as latest
          ));

        case 23:
          res.status(201).json({
            message: 'Section details saved successfully',
            version: 1,
            report_section_id: reportSectionId
          });

        case 24:
          _context7.next = 30;
          break;

        case 26:
          _context7.prev = 26;
          _context7.t0 = _context7["catch"](2);
          console.error('Error saving section details:', _context7.t0);
          res.status(500).json({
            error: 'Failed to save section details'
          });

        case 30:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 26]]);
});
router.get('/section-versions', function _callee6(req, res) {
  var reportSectionDetailId, versions;
  return regeneratorRuntime.async(function _callee6$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          reportSectionDetailId = req.query.reportSectionDetailId;
          console.log("request got 2");
          console.log();
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(query("SELECT version_number, content, updated_by, updated_at \n       FROM report_section_versions \n       WHERE report_section_id = ? \n       ORDER BY version_number DESC", [reportSectionDetailId]));

        case 6:
          versions = _context8.sent;
          res.json({
            versions: versions
          });
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](3);
          console.error('Error retrieving section versions:', _context8.t0);
          res.status(500).json({
            error: 'Failed to retrieve section versions',
            details: _context8.t0.message
          });

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 10]]);
}); // Retrieve Section Details with Version History

router.get('/section-details', function _callee7(req, res) {
  var _req$query, reportId, sectionName, subsectionName, details, versionHistory;

  return regeneratorRuntime.async(function _callee7$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("request got");
          _req$query = req.query, reportId = _req$query.reportId, sectionName = _req$query.sectionName, subsectionName = _req$query.subsectionName;
          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(query("SELECT * FROM report_section_details \n      WHERE report_id = ? AND section_name = ? AND subsection_name = ? AND is_latest = 1", [reportId, sectionName, subsectionName]));

        case 5:
          details = _context9.sent;

          if (!(details.length === 0)) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: 'No details found',
            message: 'No matching section details found'
          }));

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(query("SELECT version_number, content, updated_by, updated_at \n       FROM report_section_versions \n       WHERE report_section_id = ? \n       ORDER BY version_number DESC", [details[0].id]));

        case 10:
          versionHistory = _context9.sent;

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
          } // Respond with the details and version history


          res.json({
            details: details[0],
            versionHistory: versionHistory
          });
          _context9.next = 20;
          break;

        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](2);
          console.error('Error retrieving section details:', _context9.t0);
          res.status(500).json({
            error: 'Failed to retrieve section details',
            details: _context9.t0.message
          });

        case 20:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 16]]);
}); // Additional route to get all versions of a subsection

router.get('/section-details/versions', function _callee8(req, res) {
  var _req$query2, reportId, sectionName, subsectionName, versions;

  return regeneratorRuntime.async(function _callee8$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$query2 = req.query, reportId = _req$query2.reportId, sectionName = _req$query2.sectionName, subsectionName = _req$query2.subsectionName;
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(query("SELECT id, version, created_at, created_by, is_latest \n       FROM report_section_details \n       WHERE report_id = ? AND section_name = ? AND subsection_name = ? \n       ORDER BY version DESC", [reportId, sectionName, subsectionName]));

        case 4:
          versions = _context10.sent;
          res.json({
            versions: versions
          });
          _context10.next = 12;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);
          console.error('Error retrieving section versions:', _context10.t0);
          res.status(500).json({
            error: 'Failed to retrieve section versions',
            details: _context10.t0.message
          });

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/getall', function _callee9(req, res) {
  var reports;
  return regeneratorRuntime.async(function _callee9$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(query('SELECT id, name, deadline FROM reports ORDER BY created_at DESC'));

        case 3:
          reports = _context11.sent;
          res.json(reports); // Return reports directly, without wrapping in an object

          _context11.next = 11;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.error('Error retrieving reports:', _context11.t0);
          res.status(500).json({
            error: 'Failed to retrieve reports',
            details: _context11.t0.message
          });

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var reportId, dir;
    return regeneratorRuntime.async(function destination$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            reportId = req.body.reportId;

            if (reportId) {
              _context12.next = 4;
              break;
            }

            return _context12.abrupt("return", cb(new Error('Report ID is required'), null));

          case 4:
            dir = path.join('./uploads/report_images', reportId.toString());
            _context12.next = 7;
            return regeneratorRuntime.awrap(fs.mkdir(dir, {
              recursive: true
            }));

          case 7:
            cb(null, dir);
            _context12.next = 13;
            break;

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](0);
            cb(_context12.t0, null);

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  filename: function filename(req, file, cb) {
    var fileName = "".concat(moment().format('YYYYMMDD_HHmmss'), "_").concat(file.originalname);
    cb(null, fileName);
  }
}); // Set up multer to handle multiple file uploads

var upload = multer({
  storage: storage,
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB

  }
}); // Route to handle image uploads

router.post('/upload-images', upload.array('images'), function _callee11(req, res) {
  var _req$body3, reportId, reportSectionDetailId, imageInsertPromises;

  return regeneratorRuntime.async(function _callee11$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$body3 = req.body, reportId = _req$body3.reportId, reportSectionDetailId = _req$body3.reportSectionDetailId; // Validate required fields

          if (!(!reportId || !reportSectionDetailId)) {
            _context14.next = 4;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            error: 'Report ID and Report Section Detail ID are required'
          }));

        case 4:
          if (!(!req.files || req.files.length === 0)) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            error: 'No images provided'
          }));

        case 6:
          // Process and save each image
          imageInsertPromises = req.files.map(function _callee10(file) {
            var relativePath;
            return regeneratorRuntime.async(function _callee10$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    relativePath = path.join('uploads', 'report_images', reportId.toString(), file.filename); // Insert record into the database (assuming you have a query function)

                    return _context13.abrupt("return", query("INSERT INTO report_section_images (report_section_detail_id, image_url) VALUES (?, ?)", [reportSectionDetailId, relativePath]));

                  case 2:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          }); // Wait for all images to be processed

          _context14.next = 9;
          return regeneratorRuntime.awrap(Promise.all(imageInsertPromises));

        case 9:
          res.status(201).json({
            message: 'Images uploaded successfully',
            images: req.files.map(function (file) {
              return path.join('uploads', 'report_images', reportId.toString(), file.filename);
            })
          });
          _context14.next = 16;
          break;

        case 12:
          _context14.prev = 12;
          _context14.t0 = _context14["catch"](0);
          console.error('Image upload error:', _context14.t0);
          res.status(500).json({
            error: 'Failed to upload images ',
            details: _context14.t0.message
          });

        case 16:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Endpoint to retrieve images for a section

router.get('/section-images', function _callee12(req, res) {
  var reportSectionDetailId, images, imageUrls;
  return regeneratorRuntime.async(function _callee12$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          reportSectionDetailId = req.query.reportSectionDetailId;

          if (reportSectionDetailId) {
            _context15.next = 3;
            break;
          }

          return _context15.abrupt("return", res.status(400).json({
            error: 'Report Section Detail ID is required'
          }));

        case 3:
          _context15.prev = 3;
          _context15.next = 6;
          return regeneratorRuntime.awrap(query("SELECT image_url FROM report_section_images \n       WHERE report_section_detail_id = ?", [reportSectionDetailId]));

        case 6:
          images = _context15.sent;
          // Construct relative URLs to the images
          imageUrls = images.map(function (img) {
            return img.image_url;
          }); // Return only the relative path

          res.json({
            images: imageUrls
          });
          _context15.next = 15;
          break;

        case 11:
          _context15.prev = 11;
          _context15.t0 = _context15["catch"](3);
          console.error('Error retrieving images:', _context15.t0);
          res.status(500).json({
            error: 'Failed to retrieve images',
            details: _context15.t0.message
          });

        case 15:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router["delete"]('/delete-image', function _callee13(req, res) {
  var _req$body4, imageUrl, reportSectionDetailId, normalizedImageUrl, filePath, dbResult;

  return regeneratorRuntime.async(function _callee13$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _req$body4 = req.body, imageUrl = _req$body4.imageUrl, reportSectionDetailId = _req$body4.reportSectionDetailId;

          if (!(!imageUrl || !reportSectionDetailId)) {
            _context16.next = 3;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            error: 'Image URL and Report Section Detail ID are required'
          }));

        case 3:
          normalizedImageUrl = imageUrl.replace(/\//g, '\\');
          filePath = path.join(__dirname, '..', normalizedImageUrl);
          _context16.prev = 5;
          // Check and delete the file
          console.log('Normalized Image URL:', normalizedImageUrl);
          console.log('Full File Path:', filePath);
          _context16.next = 10;
          return regeneratorRuntime.awrap(fs.access(filePath));

        case 10:
          _context16.next = 12;
          return regeneratorRuntime.awrap(fs.unlink(filePath));

        case 12:
          _context16.next = 14;
          return regeneratorRuntime.awrap(query("DELETE FROM report_section_images WHERE image_url = ? AND report_section_detail_id = ?", [normalizedImageUrl, reportSectionDetailId]));

        case 14:
          dbResult = _context16.sent;

          if (!(dbResult.affectedRows === 0)) {
            _context16.next = 17;
            break;
          }

          return _context16.abrupt("return", res.status(404).json({
            error: 'Record not found in database'
          }));

        case 17:
          res.status(204).send(); // Successfully deleted

          _context16.next = 27;
          break;

        case 20:
          _context16.prev = 20;
          _context16.t0 = _context16["catch"](5);

          if (!(_context16.t0.code === 'ENOENT')) {
            _context16.next = 25;
            break;
          }

          console.error('File not found:', _context16.t0);
          return _context16.abrupt("return", res.status(404).json({
            error: 'File not found'
          }));

        case 25:
          console.error('Error:', _context16.t0);
          res.status(500).json({
            error: 'Failed to delete image',
            details: _context16.t0.message
          });

        case 27:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[5, 20]]);
});
module.exports = router;