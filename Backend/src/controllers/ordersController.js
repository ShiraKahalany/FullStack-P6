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
  
  const parsedItems = JSON.parse(items); // Convert items to an array if it’s stored as a JSON string

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Step 1: Check if any of the tickets in 'items' are already in another order
    const checkTicketsSql = 'SELECT orderId, items FROM orders';
    db.query(checkTicketsSql, (err, results) => {
      if (err) {
        return db.rollback(() => {
          return res.status(500).json({ error: err.message });
        });
      }

      // Initialize an array to keep track of conflicting tickets
      let conflictingTickets = [];

      // Check if any of the tickets in the current order are already in another order
      results.forEach(order => {
        const existingItems = JSON.parse(order.items);
        const overlap = existingItems.filter(item => parsedItems.includes(item));
        if (overlap.length > 0) {
          conflictingTickets.push(...overlap);
        }
      });

      if (conflictingTickets.length > 0) {
        // If any tickets are found in another order, rollback and send an error response
        return db.rollback(() => {
          return res.status(400).json({ 
            error: 'Some tickets are already associated with another order.',
            conflictingTickets: conflictingTickets 
          });
        });
      }

      // Step 2: Get the current value of the running ID for orders
      const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "orders_id" FOR UPDATE';
      db.query(getRunningIdSql, (err, results) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        const currentId = results[0].current_value;
        const newOrderId = currentId + 1;

        // Step 3: Insert the new order with the retrieved ID
        const insertOrderSql = 'INSERT INTO orders (orderId, userId, items, totalPrice, date) VALUES (?, ?, ?, ?, ?)';
        db.query(insertOrderSql, [newOrderId, userId, JSON.stringify(parsedItems), totalPrice, date], (err, results) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ error: err.message });
            });
          }

          // Step 4: Update the running ID in the running_id table
          const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "orders_id"';
          db.query(updateRunningIdSql, [newOrderId], (err, results) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({ error: err.message });
              });
            }

            // Step 5: Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  return res.status(500).json({ error: err.message });
                });
              }

              res.status(201).json({ message: 'Order created', orderId: newOrderId });
            });
          });
        });
      });
    });
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

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      // Step 1: Get the order details including the items (ticket IDs)
      const getOrderSql = 'SELECT items FROM orders WHERE orderId = ?';
      const [orderResults] = await db.promise().query(getOrderSql, [id]);
      
      if (orderResults.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = JSON.parse(orderResults[0].items);

      // Step 2: Delete the tickets associated with this order
      const deleteTicketsSql = 'DELETE FROM tickets WHERE id IN (?)';
      await db.promise().query(deleteTicketsSql, [items]);

      // Step 3: Delete the order itself
      const deleteOrderSql = 'DELETE FROM orders WHERE orderId = ?';
      await db.promise().query(deleteOrderSql, [id]);

      // Step 4: Commit the transaction
      await db.promise().commit();
      res.json({ message: 'Order and associated tickets deleted' });

    } catch (error) {
      // Rollback the transaction in case of error
      await db.promise().rollback();
      res.status(500).json({ error: error.message });
    }
  });
};


module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
