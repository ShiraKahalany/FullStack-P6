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

const getUserOrders = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT orders.orderId, orders.userId, orders.totalPrice, orders.date, JSON_ARRAYAGG(JSON_OBJECT(
      'ticketId', tickets.id,
      'screeningDate', screenings.date,
      'screeningTime', screenings.time,
      'hallId', screenings.hallId,
      'seatNumber', tickets.seatNumber,
      'price', tickets.price
    )) AS tickets
    FROM orders
    JOIN tickets ON orders.orderId = tickets.orderId
    JOIN screenings ON tickets.screeningId = screenings.id
    WHERE orders.userId = ?
    GROUP BY orders.orderId
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
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
  const { username, password, email } = req.body;
  const sql = 'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?';
  db.query(sql, [username, password, email, id], (err, results) => {
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

    const currentIsAdmin = results[0].isAdmin;
    const newIsAdmin = currentIsAdmin ? 0 : 1;

    const updateAdminSql = 'UPDATE users SET isAdmin = ? WHERE id = ?';
    db.query(updateAdminSql, [newIsAdmin, id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      const message = newIsAdmin ? 'User updated to admin' : 'Admin rights removed';
      res.json({ message });
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

const refundTicket = (req, res) => {
  const { ticketId } = req.params;
  const { orderId } = req.body;

  const deleteTicketSql = 'DELETE FROM tickets WHERE id = ?';
  const checkOrderSql = 'SELECT COUNT(*) as ticketCount FROM tickets WHERE orderId = ?';

  db.query(deleteTicketSql, [ticketId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Check if there are any remaining tickets in the order
    db.query(checkOrderSql, [orderId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results[0].ticketCount === 0) {
        // If no tickets are left, delete the order
        const deleteOrderSql = 'DELETE FROM orders WHERE orderId = ?';
        db.query(deleteOrderSql, [orderId], (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Ticket and order refunded successfully.' });
        });
      } else {
        res.json({ message: 'Ticket refunded successfully.' });
      }
    });
  });
};


module.exports = { getUserOrders, getAllUsers, getUserById, createUser, updateUser, deleteUser , loginUser, updateUserToManager, refundTicket};
