const express = require('express');
const cors = require('cors');

const moviesRoutes = require('./routes/moviesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const screeningsRoutes = require('./routes/screeningsRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/screenings', screeningsRoutes);
app.use('/api/tickets', ticketsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
