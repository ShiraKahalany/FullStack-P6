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

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "halls_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const currentId = results[0].current_value;
      const newHallId = currentId + 1;

      const insertHallSql = 'INSERT INTO halls (id, name, capacity) VALUES (?, ?, ?)';
      db.query(insertHallSql, [newHallId, name, capacity], (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "halls_id"';
        db.query(updateRunningIdSql, [newHallId], (err, results) => {
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

            res.status(201).json({ message: 'Hall created', hallId: newHallId });
          });
        });
      });
    });
  });
};


const updateHall = (req, res) => {
  const { id } = req.params;
  const { name, capacity } = req.body;

  // First, check if there are any tickets with seat numbers greater than the new capacity
  const checkTicketsSql = `
    SELECT COUNT(*) AS ticketCount
    FROM tickets
    INNER JOIN screenings ON tickets.screeningId = screenings.id
    WHERE screenings.hallId = ? AND tickets.seatNumber > ?
  `;

  db.query(checkTicketsSql, [id, capacity], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const ticketCount = results[0].ticketCount;
    if (ticketCount > 0) {
      return res.status(400).json({
        error: 'Cannot update hall capacity because there are existing tickets with seat numbers exceeding the new capacity.'
      });
    }

    // If no conflict, proceed with the update
    const sql = 'UPDATE halls SET name = ?, capacity = ? WHERE id = ?';
    db.query(sql, [name, capacity, id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hall updated successfully' });
    });
  });
};


const deleteHall = (req, res) => {
  const { id } = req.params;

  // First, check if there are any screenings in the hall
  const checkScreeningsSql = 'SELECT COUNT(*) AS screeningCount FROM screenings WHERE hallId = ?';
  db.query(checkScreeningsSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const screeningCount = results[0].screeningCount;
    if (screeningCount > 0) {
      return res.status(400).json({ error: 'Cannot delete hall because there are screenings associated with it.' });
    }

    // If no screenings, proceed to delete the hall
    const deleteSql = 'DELETE FROM halls WHERE id = ?';
    db.query(deleteSql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hall deleted successfully' });
    });
  });
};

module.exports = { deleteHall };


module.exports = { getAllHalls, getHallById, createHall, updateHall, deleteHall };
