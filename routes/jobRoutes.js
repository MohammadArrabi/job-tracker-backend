// backend/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Connect to PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 1. Get all job applications
router.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving jobs.' });
  }
});

// 2. Create a new job application
router.post('/jobs', async (req, res) => {
  const { company, position, status, date_applied, notes, resume_link } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (company, position, status, date_applied, notes, resume_link) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company, position, status, date_applied, notes, resume_link]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding job.' });
  }
});

// 3. Update a job application
router.put('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { company, position, status, date_applied, notes, resume_link } = req.body;

  try {
    const result = await pool.query(
      `UPDATE jobs 
       SET company = $1, position = $2, status = $3, date_applied = $4, notes = $5, resume_link = $6 
       WHERE id = $7 RETURNING *`,
      [company, position, status, date_applied, notes, resume_link, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating job.' });
  }
});

// 4. Delete a job application
router.delete('/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting job.' });
  }
});

module.exports = router;