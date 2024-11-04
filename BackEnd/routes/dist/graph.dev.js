"use strict";

var express = require('express');

var router = express.Router();

var db = require('../config/db');

router.post('/academicyear', function (req, res) {
  var query = "SELECT DISTINCT academic_year FROM students";
  db.query(query, function (err, results) {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({
        error: 'Error fetching distinct values'
      });
      return;
    }

    var distinctValues = results.map(function (row) {
      return row.academic_year;
    });
    res.json(distinctValues);
  });
});
router.post('/studentsgraph', function (req, res) {
  var _req$body = req.body,
      dept = _req$body.dept,
      academic_year = _req$body.academic_year;
  var query = "\n    SELECT \n      SUM(IF(placements_status!= 'placed', 1, 0)) as placed_students,\n      SUM(IF(placements_status!= 'pending', 1, 0)) as yet_placed_students, \n      SUM(IF(higher_studies_status!= 'not applicable', 1, 0)) as higher_studies_students\n    FROM \n      students\n    WHERE \n      department =? and academic_year=?\n  ";
  db.query(query, [dept, academic_year], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/staffgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n      SUM(CASE WHEN designation = 'Professor' THEN 1 ELSE 0 END) as Professor,\n      SUM(CASE WHEN designation = 'Associate Professor' THEN 1 ELSE 0 END) as Associate_Professor,\n      SUM(CASE WHEN designation = 'Assistant Professor' THEN 1 ELSE 0 END) as Assistant_Professor\n    FROM \n      staffs\n    WHERE \n      department = ?;\n  ";
  db.query(query, [dept], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/studentsyrsgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n      SUM(IF(year = 'I', 1, 0)) AS firstyear,\n      SUM(IF(year = 'II', 1, 0)) AS secondyear,\n      SUM(IF(year = 'III', 1, 0)) AS thirdyear,\n      SUM(IF(year = 'IV', 1, 0)) AS fourthyear\n    FROM \n      students\n    WHERE \n      department = ?;\n  ";
  db.query(query, [dept], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/adminstudentsgraph', function (req, res) {
  var academic_year = req.body.academic_year;
  var query = "\n    SELECT\n      department, \n      SUM(IF(placements_status = 'placed', 1, 0)) AS placed_students,\n      SUM(IF(placements_status = 'pending', 1, 0)) AS yet_placed_students,\n      SUM(IF(higher_studies_status != 'not applicable', 1, 0)) AS higher_studies_students\n    FROM \n      students\n    WHERE \n      academic_year = ?\n    GROUP BY \n      department\n    ORDER By\n      department\n  ";
  db.query(query, [academic_year], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results);
  });
});
router.post('/adminstaffgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n      department,\n      SUM(CASE WHEN designation = 'Professor' THEN 1 ELSE 0 END) as Professor,\n      SUM(CASE WHEN designation = 'Associate Professor' THEN 1 ELSE 0 END) as Associate_Professor,\n      SUM(CASE WHEN designation = 'Assistant Professor' THEN 1 ELSE 0 END) as Assistant_Professor\n    FROM \n      staffs GROUP BY department;\n  ";
  db.query(query, [], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results);
  });
});
router.post('/adminstudentsyrsgraph', function (req, res) {
  var dept = req.body.dept;
  var query = "\n    SELECT \n    department,\n    SUM(CASE WHEN year = 'I' THEN 1 ELSE 0 END) AS firstyearcount,\n    SUM(CASE WHEN year = 'II' THEN 1 ELSE 0 END) AS secondyearcount,\n    SUM(CASE WHEN year = 'III' THEN 1 ELSE 0 END) AS thirdyearcount,\n    SUM(CASE WHEN year = 'IV' THEN 1 ELSE 0 END) AS fourthyearcount\n    FROM \n        students\n    GROUP BY \n        department\n    ORDER BY \n        department;\n\n  ";
  db.query(query, [dept], function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({
        message: 'Error executing query'
      });
      return;
    }

    res.json(results);
  });
});
module.exports = router;