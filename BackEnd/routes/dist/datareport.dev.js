"use strict";

var express = require('express');

var router = express.Router();

var util = require('util');

var db = require('../config/db');

var query = util.promisify(db.query).bind(db);

var _require = require("@google/generative-ai"),
    GoogleGenerativeAI = _require.GoogleGenerativeAI;

require('dotenv').config();

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
  var section, graphdata, sqlQuery, results, introduction, summary;
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
          console.log(results);
          _context.next = 13;
          return regeneratorRuntime.awrap(generateIntroduction(results));

        case 13:
          introduction = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(Promise.race([summarizeData(results), new Promise(function (_, reject) {
            return setTimeout(function () {
              return reject(new Error('Summarization timeout'));
            }, 10000);
          })]));

        case 16:
          summary = _context.sent;
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
                Arts: "#4BC0C0"
              }
            },
            summary: summary // Include the generated summary

          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](6);
          console.log(_context.t0.message);
          res.status(500).json({
            error: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 20]]);
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

module.exports = router;