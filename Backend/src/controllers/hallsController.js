const db = require('../config');

const getAllHalls = (req, res) => {
  const sql = 'SELECT * FROM halls';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getHallById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM halls WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createHall = (req, res) => {
  const { name, capacity } = req.body;
  const sql = 'INSERT INTO halls (name, capacity) VALUES (?, ?)';
  db.query(sql, [name, capacity], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Hall created', hallId: results.insertId });
  });
};

const updateHall = (req, res) => {
  const { id } = req.params;
  const { name, capacity } = req.body;
  const sql = 'UPDATE halls SET name = ?, capacity = ? WHERE id = ?';
  db.query(sql, [name, capacity, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Hall updated' });
  });
};

const deleteHall = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM halls WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Hall deleted' });
  });
};

module.exports = { getAllHalls, getHallById, createHall, updateHall, deleteHall };
