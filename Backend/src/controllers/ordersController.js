const db = require('../config');

/****************************** GET ******************************/

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


/****************************** CREATE ******************************/


// Utility function to parse items from the request body
const parseItems = (items) => {
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch (error) {
      throw new Error('Invalid format for items');
    }
  }
  return items;
};

// Utility function to check for conflicting tickets
const checkForConflictingTickets = (parsedItems) => {
  return new Promise((resolve, reject) => {
    const checkTicketsSql = 'SELECT orderId, items FROM orders';
    db.query(checkTicketsSql, (err, results) => {
      if (err) return reject(err);

      let conflictingTickets = [];
      results.forEach(order => {
        const existingItems = JSON.parse(order.items);
        const overlap = existingItems.filter(item => parsedItems.includes(item));
        if (overlap.length > 0) {
          conflictingTickets.push(...overlap);
        }
      });

      if (conflictingTickets.length > 0) {
        return reject({
          error: 'Some tickets are already associated with another order.',
          conflictingTickets: conflictingTickets
        });
      }

      resolve();
    });
  });
};

// Utility function to generate a new order ID
const generateOrderId = () => {
  return new Promise((resolve, reject) => {
    const getRunningIdSql = 'SELECT current_value FROM running_id WHERE entity_name = "orders_id" FOR UPDATE';
    db.query(getRunningIdSql, (err, results) => {
      if (err) return reject(err);

      const currentId = results[0].current_value;
      const newOrderId = currentId + 1;
      resolve(newOrderId);
    });
  });
};

// Utility function to insert a new order
const insertOrder = (newOrderId, userId, parsedItems, totalPrice, date) => {
  return new Promise((resolve, reject) => {
    const insertOrderSql = 'INSERT INTO orders (orderId, userId, items, totalPrice, date) VALUES (?, ?, ?, ?, ?)';
    db.query(insertOrderSql, [newOrderId, userId, JSON.stringify(parsedItems), totalPrice, date], (err, results) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Utility function to update the running ID
const updateRunningId = (newOrderId) => {
  return new Promise((resolve, reject) => {
    const updateRunningIdSql = 'UPDATE running_id SET current_value = ? WHERE entity_name = "orders_id"';
    db.query(updateRunningIdSql, [newOrderId], (err, results) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Main createOrder function
const createOrder = (req, res) => {
  const { userId, items, totalPrice, date } = req.body;

  let parsedItems;
  try {
    parsedItems = parseItems(items);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      // Step 1: Validate tickets
      // await checkForConflictingTickets(parsedItems);

      // Step 2: Generate a new order ID
      const newOrderId = await generateOrderId();

      // Step 3: Insert the new order
      await insertOrder(newOrderId, userId, parsedItems, totalPrice, date);

      // Step 4: Update the running ID
      await updateRunningId(newOrderId);

      // Step 5: Commit the transaction
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: err.message });
          });
        }

        res.status(201).json({ message: 'Order created', orderId: newOrderId });
      });

    } catch (error) {
      db.rollback(() => {
        if (error.conflictingTickets) {
          return res.status(400).json(error);
        }
        return res.status(500).json({ error: error.message });
      });
    }
  });
};


/****************************** UPDATE ******************************/

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
