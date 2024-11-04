const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/academicyear', (req, res) => {
  const query = `SELECT DISTINCT academic_year FROM students`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ error: 'Error fetching distinct values' });
      return;
    }

    const distinctValues = results.map(row => row.academic_year);

    res.json(distinctValues);
  });
});


router.post('/studentsgraph', (req, res) => {
  const { dept, academic_year } = req.body;
  const query = `
    SELECT 
      SUM(IF(placements_status!= 'placed', 1, 0)) as placed_students,
      SUM(IF(placements_status!= 'pending', 1, 0)) as yet_placed_students, 
      SUM(IF(higher_studies_status!= 'not applicable', 1, 0)) as higher_studies_students
    FROM 
      students
    WHERE 
      department =? and academic_year=?
  `;

  db.query(query, [dept, academic_year], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});

router.post('/staffgraph', (req, res) => {
  const {dept} = req.body;
  const query = `
    SELECT 
      SUM(CASE WHEN designation = 'Professor' THEN 1 ELSE 0 END) as Professor,
      SUM(CASE WHEN designation = 'Associate Professor' THEN 1 ELSE 0 END) as Associate_Professor,
      SUM(CASE WHEN designation = 'Assistant Professor' THEN 1 ELSE 0 END) as Assistant_Professor
    FROM 
      staffs
    WHERE 
      department = ?;
  `;

  db.query(query, [dept], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});

router.post('/studentsyrsgraph', (req, res) => {
  const { dept } = req.body;
  const query = `
    SELECT 
      SUM(IF(year = 'I', 1, 0)) AS firstyear,
      SUM(IF(year = 'II', 1, 0)) AS secondyear,
      SUM(IF(year = 'III', 1, 0)) AS thirdyear,
      SUM(IF(year = 'IV', 1, 0)) AS fourthyear
    FROM 
      students
    WHERE 
      department = ?;
  `;

  db.query(query, [dept], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results[0]);
  });
});
router.post('/adminstudentsgraph', (req, res) => {
  const { academic_year } = req.body;
  const query = `
    SELECT
      department, 
      SUM(IF(placements_status = 'placed', 1, 0)) AS placed_students,
      SUM(IF(placements_status = 'pending', 1, 0)) AS yet_placed_students,
      SUM(IF(higher_studies_status != 'not applicable', 1, 0)) AS higher_studies_students
    FROM 
      students
    WHERE 
      academic_year = ?
    GROUP BY 
      department
    ORDER By
      department
  `;

  db.query(query, [academic_year], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results);
  });
});


router.post('/adminstaffgraph', (req, res) => {
  const {dept} = req.body;
  const query = `
    SELECT 
      department,
      SUM(CASE WHEN designation = 'Professor' THEN 1 ELSE 0 END) as Professor,
      SUM(CASE WHEN designation = 'Associate Professor' THEN 1 ELSE 0 END) as Associate_Professor,
      SUM(CASE WHEN designation = 'Assistant Professor' THEN 1 ELSE 0 END) as Assistant_Professor
    FROM 
      staffs GROUP BY department;
  `;

  db.query(query,[],(err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results);
  });
});

router.post('/adminstudentsyrsgraph', (req, res) => {
  const { dept } = req.body;
  const query = `
    SELECT 
    department,
    SUM(CASE WHEN year = 'I' THEN 1 ELSE 0 END) AS firstyearcount,
    SUM(CASE WHEN year = 'II' THEN 1 ELSE 0 END) AS secondyearcount,
    SUM(CASE WHEN year = 'III' THEN 1 ELSE 0 END) AS thirdyearcount,
    SUM(CASE WHEN year = 'IV' THEN 1 ELSE 0 END) AS fourthyearcount
    FROM 
        students
    GROUP BY 
        department
    ORDER BY 
        department;

  `;

  db.query(query, [dept], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Error executing query' });
      return;
    }

    res.json(results);
  });
});

module.exports = router;
