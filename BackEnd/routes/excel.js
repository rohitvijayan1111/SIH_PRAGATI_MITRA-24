// excel.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import your database connection


function convertExcelDate(serial) {
  // Excel date serials start from January 1, 1900, so add the number of days to this base date
  const excelBaseDate = new Date(1900, 0, 1);
  return new Date(excelBaseDate.getTime() + (serial - 1) * 86400000) // 86400000 ms per day
      .toISOString()
      .slice(0, 10); // Format to YYYY-MM-DD
}
router.post('/upload', async (req, res) => {
  const { table, data } = req.body;

  try {
      await db.beginTransaction();

      for (let row of data) {
          // Convert `completion_date` if it's a serial number
          if (row.completion_date && typeof row.completion_date === 'number') {
              row.completion_date = convertExcelDate(row.completion_date);
          }

          await db.query(`INSERT INTO ?? SET ?`, [table, row]);
      }

      await db.commit();
      res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
      await db.rollback();
      console.error('Error importing data:', error);
      res.status(500).json({ error: 'Error importing data' });
  }
});

module.exports = router;