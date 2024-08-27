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

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "movie_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const currentId = results[0].current_value;
      const newMovieId = currentId + 1;

      const insertMovieSql = 'INSERT INTO movies (id, title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertMovieSql, [newMovieId, title, description, duration, genre, rating, director, releaseDate, trailerPath, imagePath], (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "movie_id"';
        db.query(updateRunningIdSql, [newMovieId], (err, results) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ error: err.message });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({ error: err.message });
              });
            }

            res.status(201).json({ message: 'Movie created', movieId: newMovieId });
          });
        });
      });
    });
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


// 200 OK for successful GET or PUT requests.
// 201 Created for successful POST requests.
// 204 No Content for successful DELETE requests.
// 400 Bad Request for validation errors or bad input.
// 404 Not Found for resources that cannot be found.
// 500 Internal Server Error for server-side issues