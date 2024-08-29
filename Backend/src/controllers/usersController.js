const db = require('../config');

const getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createUser = (req, res) => {
  const { userID, username, password, email, isAdmin } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "user_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const currentId = results[0].current_value;
      const newUserId = currentId + 1;
      console.log("newUserId:",newUserId);
      const insertUserSql = 'INSERT INTO users (id, username, password, email, isAdmin) VALUES (?, ?, ?, ?, ?)';
      db.query(insertUserSql, [newUserId, username, password, email, isAdmin], (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "user_id"';
        db.query(updateRunningIdSql, [newUserId], (err, results) => {
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

            res.status(201).json({ message: 'User created', userId: newUserId });
          });
        });
      });
    });
  });
};


const updateUser = (req, res) => {
  const { id } = req.params;
  const { userID, username, password, email, isAdmin } = req.body;
  const sql = 'UPDATE users SET userID = ?, username = ?, password = ?, email = ?, isAdmin = ? WHERE id = ?';
  db.query(sql, [userID, username, password, email, isAdmin, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
};


const updateUserToManager = (req, res) => {
  const { id } = req.params;

  const findUserSql = 'SELECT isAdmin FROM users WHERE id = ?';
  db.query(findUserSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      // No user found with the given ID
      return res.status(404).json({ error: 'User not found' });
    }

    if (results[0].isAdmin === 1) {
      // User is already an admin
      return res.status(400).json({ error: 'User is already an admin' });
    }

    // Update the user to admin
    const updateAdminSql = 'UPDATE users SET isAdmin = 1 WHERE id = ?';
    db.query(updateAdminSql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated to admin' });
    });
  });
};


const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
};


// Login user
const loginUser = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      const user = results[0];
      res.json({
        id: user.id,
        userID: user.userID,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser , loginUser, updateUserToManager};
