const db = require('../config');

const getAllScreenings = (req, res) => {
  const sql = 'SELECT * FROM screenings ORDER BY date ASC, time ASC;';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


const getAllScreeningsToManager = (req, res) => {
  const sql = `
    SELECT 
      screenings.id AS screeningId, 
      screenings.date, 
      screenings.time, 
      movies.title, 
      movies.imagePath, 
      halls.name AS hallName
    FROM screenings
    JOIN movies ON screenings.movieId = movies.id
    JOIN halls ON screenings.hallId = halls.id
    ORDER BY screenings.date, screenings.time
  `;

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
  const { movieId, hallId, date, time } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get the duration of the movie to calculate the end time
    const getMovieDurationSql = 'SELECT duration FROM movies WHERE id = ?';
    db.query(getMovieDurationSql, [movieId], (err, movieResults) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const movieDuration = movieResults[0].duration;
      const startTime = new Date(`${date} ${time}`);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + movieDuration);

      // Check for time conflicts in the same hall
      const checkConflictSql = `
        SELECT * FROM screenings
        WHERE hallId = ? AND date = ?
        AND (
          (time <= ? AND ADDTIME(time, SEC_TO_TIME(? * 60)) > ?)
          OR
          (? < time AND ? > time)
        )
      `;
      db.query(checkConflictSql, [hallId, date, time, movieDuration, time, endTime, endTime], (err, conflictResults) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        if (conflictResults.length > 0) {
          return db.rollback(() => {
            res.status(409).json({ error: 'There is another screening at this time in the selected hall. Please choose another time.' });
          });
        }

        // No conflict, proceed to get the current ID from running_id
        const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "screenings_id" FOR UPDATE';
        db.query(getRunningIdSql, (err, results) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ error: err.message });
            });
          }

          const currentId = results[0].current_value;
          const newScreeningId = currentId + 1;

          // Insert the new screening with the incremented ID
          const insertScreeningSql = 'INSERT INTO screenings (id, movieId, hallId, date, time) VALUES (?, ?, ?, ?, ?)';
          db.query(insertScreeningSql, [newScreeningId, movieId, hallId, date, time], (err, results) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({ error: err.message });
              });
            }

            // Update the running_id table with the new current value
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
    });
  });
};





const updateScreening = (req, res) => {
  const { id } = req.params;
  const { movieId, hallId, date, time } = req.body;

  // Query to get the duration of the movie
  const getMovieDurationSql = 'SELECT duration FROM movies WHERE id = ?';
  db.query(getMovieDurationSql, [movieId], (err, movieResults) => {
    if (err) return res.status(500).json({ error: err.message });

    const movieDuration = movieResults[0].duration;
    const startTime = new Date(`${date} ${time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + movieDuration);

    // Convert times to MySQL TIME format (HH:MM:SS)
    const startTimeStr = startTime.toISOString().split('T')[1].split('.')[0];
    const endTimeStr = endTime.toISOString().split('T')[1].split('.')[0];

    // Query to check if there is a time conflict in the same hall
    const checkConflictSql = `
      SELECT * FROM screenings
      WHERE hallId = ? AND date = ? AND id != ?
      AND (
        (time < ? AND ADDTIME(time, SEC_TO_TIME(? * 60)) > ?)
        OR
        (? < time AND ? > time)
      )
    `;
    db.query(checkConflictSql, [hallId, date, id, startTimeStr, movieDuration, startTimeStr, endTimeStr, endTimeStr], (err, conflictResults) => {
      if (err) return res.status(500).json({ error: err.message });

      if (conflictResults.length > 0) {
        return res.status(400).json({ error: 'There is another screening in this time. Please choose another time.' });
      }

      // If no conflict, update the screening
      const updateSql = 'UPDATE screenings SET movieId = ?, hallId = ?, date = ?, time = ? WHERE id = ?';
      db.query(updateSql, [movieId, hallId, date, time, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Screening updated' });
      });
    });
  });
};





const deleteScreening = (req, res) => {
  const { id } = req.params;

  // First, delete all tickets associated with the screening
  const deleteTicketsSql = 'DELETE FROM tickets WHERE screeningId = ?';
  db.query(deleteTicketsSql, [id], (err, ticketResults) => {
    if (err) return res.status(500).json({ error: err.message });

    // Now delete the screening
    const deleteScreeningSql = 'DELETE FROM screenings WHERE id = ?';
    db.query(deleteScreeningSql, [id], (err, screeningResults) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Screening and associated tickets deleted' });
    });
  });
};


module.exports = { getAllScreenings, getScreeningById, createScreening, updateScreening, deleteScreening, getAllScreeningsToManager};
