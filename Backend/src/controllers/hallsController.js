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
