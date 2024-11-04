const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

router.use(cors());

const getFriendlyErrorMessage = (errCode) => {
    switch (errCode) {
        case 'ER_NO_SUCH_TABLE':
            return "Table does not exist.";
        case 'ER_DUP_ENTRY':
            return "Duplicate entry for a key.";
        case 'ER_BAD_FIELD_ERROR':
            return "Unknown column.";
        case 'ER_PARSE_ERROR':
            return "Error in SQL syntax.";
        case 'ER_NO_REFERENCED_ROW_2':
            return "Referenced entry does not exist.";
        case 'ER_ROW_IS_REFERENCED_2':
            return "Cannot delete or update a parent row: a foreign key constraint fails.";
        case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
            return "Incorrect value for a field.";
        case 'ER_DATA_TOO_LONG':
            return "Data too long for column.";
        case 'ER_ACCESS_DENIED_ERROR':
            return "Access denied for user.";
        case 'ER_NOT_SUPPORTED_YET':
            return "Feature not supported yet.";
        case 'ER_WRONG_VALUE_COUNT_ON_ROW':
            return "Incorrect number of values.";
        default:
            return "An unknown error occurred.";
    }
};

router.post('/getEndIndex', async (req, res) => {
    console.log("Received request:", req.body);

    const sql = 'SELECT * FROM FormEndIndex;';
    try {
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            if (results.length === 0) {
                return res.status(404).send('End index not found');
            }
            console.log('Database results:', results);
            res.status(200).json(results[0]);
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        return res.status(500).send(getFriendlyErrorMessage(err.code));
    }
});
router.post('/updateEndIndex', async (req, res) => {
  console.log("Received request:", req.body);
  const data=req.body;
  const sql = 'UPDATE FormEndIndex SET ?;';
  try {
      db.query(sql,[data],(err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
          if (results.length === 0) {
              return res.status(404).send('End index not found');
          }
          console.log('Database results:', results);
          res.status(200).json(results[0]);
      });
  } catch (err) {
      console.error('Catch error:', err.message);
      return res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});
router.post('/createformrecord', async (req, res) => {
    const { form_name,possible_start_index, Max_index, attributes } = req.body;
    console.log('Received payload:', req.body);

    if (!form_name || !possible_start_index ||!Max_index || !attributes) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let parsedAttributes;
    try {
        parsedAttributes = JSON.parse(attributes);
        if (!Array.isArray(parsedAttributes)) {
            throw new Error('Attributes should be an array');
        }
    } catch (err) {
        return res.status(400).json({ error: 'Invalid attributes format' });
    }

    const sql = 'INSERT INTO Forms (form_name,possible_start_index, Max_index, attributes) VALUES (?, ?, ?, ?)';
    const values = [form_name,possible_start_index, Max_index, attributes];

    try {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            res.status(201).send('Form created successfully');
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        res.status(500).send(getFriendlyErrorMessage(err.code));
    }
});

router.post('/getformlist', async (req, res) => {
  console.log("Received request:", req.body);

  const sql = 'SELECT * FROM form_locks;';
  try {
      db.query(sql, (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
          if (results.length === 0) {
              return res.status(404).send('End index not found');
          }
          console.log('Database results:', results);
          res.status(200).json(results);
      });
  } catch (err) {
      console.error('Catch error:', err.message);
      return res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});
router.post('/lockform', async (req, res) => {
  const { id, lock } = req.body;

  if (!id || lock === undefined) {
    return res.status(400).json({ error: 'ID and lock status are required' });
  }

  try {
    await db.query('UPDATE forms SET is_locked = ? WHERE id = ?', [lock, id]);
    res.json({ message: 'Item lock status updated successfully' });
  } catch (err) {
    console.error('Error updating lock status:', err.stack);
    res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});
router.post('/insertrecord', async (req, res) => {
  const data = req.body;
  console.log('Received payload:', req.body);

  if (!data) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO formrecords SET ?';
  const values = [data];

  try {
      db.query(sql, values, (err, result) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
          res.status(201).send('Form created successfully');
      });
  } catch (err) {
      console.error('Catch error:', err.message);
      res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});

router.post('/updateformindex', async (req, res) => {
  const {form_id,data} = req.body;
  console.log('Received payload:', req.body);

  if (!data) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'UPDATE forms SET ? WHERE id=?';
  const values = [data,form_id];

  try {
      db.query(sql, values, (err, result) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
          res.status(201).send('Form created successfully');
      });
  } catch (err) {
      console.error('Catch error:', err.message);
      res.status(500).send(getFriendlyErrorMessage(err.code));
  }
});

router.post('/getformrecords', async (req, res) => {
    console.log("Received request:", req.body);
    const { id } = req.body;
    const sql = 'SELECT start_index, end_index FROM forms WHERE id = ?';
    
    try {
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            if (results.length === 0) {
                return res.status(404).send('End index not found');
            }

            const a = results[0].start_index;
            const b = results[0].end_index;
            const sql2 = 'SELECT * FROM formrecords WHERE id BETWEEN ? AND ? AND form_id = ?';

            db.query(sql2, [a, b, id], (err2, results2) => {
                if (err2) {
                    console.error('Database error:', err2);
                    return res.status(500).send(getFriendlyErrorMessage(err2.code));
                }
                res.status(200).json(results2);
            });
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        return res.status(500).send(getFriendlyErrorMessage(err.code));
    }
});
router.post('/editformrecord', async (req, res) => {
    const {id} = req.body;
    const data=req.body.record_data;
    console.log('Received payload for editing:', req.body);
    if (!data) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = 'UPDATE formrecords SET record_data=? WHERE id=?';
    const values = [data,id];
  
    try {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            res.status(201).send('Record Edited successfully');
        });
    } catch (err) {
        console.error('Catch error:', err.message);
        res.status(500).send(getFriendlyErrorMessage(err.code));
    }
  });
  router.post('/updateAndDeleteRecord', async (req, res) => {
    const { recordId, formId } = req.body;
  
    const sqlNextRecord = 'SELECT id FROM formrecords WHERE id > ? AND form_id = ? ORDER BY id ASC LIMIT 1';
    const sqlUpdateForm = 'UPDATE forms SET start_index = ? WHERE start_index = ?';
    const sqlDeleteRecord = 'DELETE FROM formrecords WHERE id = ?';
  
    try {
      db.query(sqlNextRecord, [recordId, formId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send(getFriendlyErrorMessage(err.code));
        }
  
        const nextRecordId = results.length > 0 ? results[0].id : null;
  
       const updateValue = nextRecordId ? nextRecordId : null;
        db.query(sqlUpdateForm, [updateValue, recordId], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).send(getFriendlyErrorMessage(err.code));
          }
  
         db.query(sqlDeleteRecord, [recordId], (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send(getFriendlyErrorMessage(err.code));
            }
            res.status(200).send('Record deleted and foreign key reference updated successfully');
          });
        });
      });
    } catch (err) {
      console.error('Catch error:', err.message);
      res.status(500).send(getFriendlyErrorMessage(err.code));
    }
  });
  
module.exports = router;
