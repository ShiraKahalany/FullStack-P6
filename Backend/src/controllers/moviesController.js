const db = require('../config');

const getAllMovies = (req, res) => {
  const sql = 'SELECT * FROM movies';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getMovieById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM movies WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createMovie = (req, res) => {
  const { title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath } = req.body;
  const sql = 'INSERT INTO movies (title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Movie created', movieId: results.insertId });
  });
};

const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath } = req.body;
  const sql = 'UPDATE movies SET title = ?, description = ?, duration = ?, genre = ?, rating = ?, director = ?, releaseDate = ?, trailerPath = ?, imagePath = ? WHERE id = ?';
  db.query(sql, [title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Movie updated' });
  });
};

const deleteMovie = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM movies WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Movie deleted' });
  });
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
