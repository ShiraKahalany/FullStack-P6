const db = require('../config');

const getAllTickets = (req, res) => {
  const sql = 'SELECT * FROM tickets';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getTicketById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tickets WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

const createTicket = (req, res) => {
  const { userId, screeningId, seatNumber, price, isPaid } = req.body;
  const sql = 'INSERT INTO tickets (userId, screeningId, seatNumber, price, isPaid) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [userId, screeningId, seatNumber, price, isPaid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Ticket created', ticketId: results.insertId });
  });
};

const updateTicket = (req, res) => {
  const { id } = req.params;
  const { userId, screeningId, seatNumber, price, isPaid } = req.body;
  const sql = 'UPDATE tickets SET userId = ?, screeningId = ?, seatNumber = ?, price = ?, isPaid = ? WHERE id = ?';
  db.query(sql, [userId, screeningId, seatNumber, price, isPaid, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ticket updated' });
  });
};

const deleteTicket = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tickets WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ticket deleted' });
  });
};

module.exports = { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket };
