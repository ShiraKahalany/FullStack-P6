const express = require('express');
const cors = require('cors');

const moviesRoutes = require('./routes/moviesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const screeningsRoutes = require('./routes/screeningsRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');
const hallsRoutes = require('./routes/hallsRoutes'); // Added hallsRoutes
const ordersRoutes = require('./routes/ordersRoutes'); // Added ordersRoutes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/screenings', screeningsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/halls', hallsRoutes); // Added halls route
app.use('/api/orders', ordersRoutes); // Added orders route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
