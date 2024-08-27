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

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "screenings_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const currentId = results[0].current_value;
      const newScreeningId = currentId + 1;

      const insertScreeningSql = 'INSERT INTO screenings (id, movieId, hallId, date, time, bookedSeats) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertScreeningSql, [newScreeningId, movieId, hallId, date, time, bookedSeats], (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "screenings_id"';
        db.query(updateRunningIdSql, [newScreeningId], (err, results) => {
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

            res.status(201).json({ message: 'Screening created', screeningId: newScreeningId });
          });
        });
      });
    });
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
