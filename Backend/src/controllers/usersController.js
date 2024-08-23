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
  const sql = 'INSERT INTO users (userID, username, password, email, isAdmin) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [userID, username, password, email, isAdmin], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created', userId: results.insertId });
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

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser , loginUser};
