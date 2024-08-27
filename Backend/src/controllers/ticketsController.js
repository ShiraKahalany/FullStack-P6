const db = require('../config');

/****************************** GET ******************************/

// Function to get all booked seats for a given screening ID
const getBookedSeatsForScreening = (req, res) => {
  const { screeningId } = req.params;
  const sql = 'SELECT seatNumber FROM tickets WHERE screeningId = ? AND isPaid = true';
  db.query(sql, [screeningId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const bookedSeats = results.map(ticket => ticket.seatNumber); // Extract seat numbers from results
    res.json(bookedSeats);
  });
};

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

const getTicketsByUserAndPaymentStatus = (req, res) => {
  const { userId, isPaid } = req.query;

  // Convert isPaid to a number (0 or 1) based on the incoming string
  const isPaidValue = isPaid === 'true' ? 1 : 0;
  
  const sql = 'SELECT * FROM tickets WHERE userId = ? AND isPaid = ?';
  db.query(sql, [userId, isPaidValue], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

/****************************** POST ******************************/ 

// Function to create a ticket
const createTicket = (req, res) => {
  const { userId, screeningId, seatNumber, price, isPaid } = req.body;

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Step 1: Get the current value of the running ID for tickets
    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "ticket_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      const currentId = results[0].current_value;
      const newTicketId = currentId + 1;

      // Step 2: Insert the new ticket with the retrieved ID
      const insertTicketSql = 'INSERT INTO tickets (id, userId, screeningId, seatNumber, price, isPaid) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertTicketSql, [newTicketId, userId, screeningId, seatNumber, price, isPaid], (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        // Step 3: Update the running ID in the running_id table
        const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "ticket_id"';
        db.query(updateRunningIdSql, [newTicketId], (err, results) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ error: err.message });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({ error: err.message });
              });
            }

            res.status(201).json({ message: 'Ticket created', ticketId: newTicketId });
          });
        });
      });
    });
  });
};

/****************************** UPDATE ******************************/ 

const updateTicket = (req, res) => {
  const { id } = req.params;
  const { userId, screeningId, seatNumber, price, isPaid } = req.body;
  const sql = 'UPDATE tickets SET userId = ?, screeningId = ?, seatNumber = ?, price = ?, isPaid = ? WHERE id = ?';
  db.query(sql, [userId, screeningId, seatNumber, price, isPaid, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ticket updated' });
  });
};

/****************************** DELETE ******************************/ 

const deleteTicket = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tickets WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ticket deleted' });
  });
};

module.exports = { 
  getAllTickets, 
  getTicketById, 
  getTicketsByUserAndPaymentStatus, 
  getBookedSeatsForScreening,  // Export the new function
  createTicket, 
  updateTicket, 
  deleteTicket 
};
