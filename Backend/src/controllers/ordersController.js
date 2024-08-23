const db = require('../config');

const getAllOrders = (req, res) => {
  const sql = 'SELECT * FROM orders';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getOrderById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM orders WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createOrder = (req, res) => {
  const { userId, items, totalPrice, date } = req.body;
  const sql = 'INSERT INTO orders (userId, items, totalPrice, date) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, items, totalPrice, date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Order created', orderId: results.insertId });
  });
};

const updateOrder = (req, res) => {
  const { id } = req.params;
  const { userId, items, totalPrice, date } = req.body;
  const sql = 'UPDATE orders SET userId = ?, items = ?, totalPrice = ?, date = ? WHERE id = ?';
  db.query(sql, [userId, items, totalPrice, date, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order updated' });
  });
};

const deleteOrder = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM orders WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order deleted' });
  });
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
