const db = require('../config');

const getAllScreenings = (req, res) => {
  const sql = 'SELECT * FROM screenings';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getScreeningById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM screenings WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createScreening = (req, res) => {
  const { movieId, hallId, date, time, bookedSeats } = req.body;
  const sql = 'INSERT INTO screenings (movieId, hallId, date, time, bookedSeats) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [movieId, hallId, date, time, bookedSeats], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Screening created', screeningId: results.insertId });
  });
};

const updateScreening = (req, res) => {
  const { id } = req.params;
  const { movieId, hallId, date, time, bookedSeats } = req.body;
  const sql = 'UPDATE screenings SET movieId = ?, hallId = ?, date = ?, time = ?, bookedSeats = ? WHERE id = ?';
  db.query(sql, [movieId, hallId, date, time, bookedSeats, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Screening updated' });
  });
};

const deleteScreening = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM screenings WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Screening deleted' });
  });
};

module.exports = { getAllScreenings, getScreeningById, createScreening, updateScreening, deleteScreening };
