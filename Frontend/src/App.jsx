import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Info from './components/Info';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/Navbar';
import Movies from './components/Movies';
import SelectedMovie from './components/selectedMovie';
import SelectSeats from './components/SelectSeats';
import Cart from './components/Cart'; 
import OrderConfirmation from './components/OrderConfirmation';
import AdminControlPanel from './components/AdminControlPanel';
import ManageMovies from './components/ManageMovies';
import ManageShowtimes from './components/ManageShowtimes';
import EditMovie from './components/EditMovie';
import AddMovie from './components/AddMovie';
import EditScreening from './components/EditScreening';
import AddScreening from './components/AddScreening';
import ManageHalls from './components/ManageHalls';
import ManageUsers from './components/ManageUsers';


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar /> {/* Include NavBar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} /> 
          <Route path="/movies/:movieId/screening/:screeningId" element={<SelectedMovie />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/admin" element={<PrivateRoute><AdminControlPanel /></PrivateRoute>} /> 
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/gifts" element={<div>Gifts and Movie Cards Page</div>} />
          <Route path="/info" element={<PrivateRoute><Info /></PrivateRoute>} />
          <Route path="/aboutus" element={<div>About Us Page</div>} />
          <Route path="/admin/movies" element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
          <Route path="/admin/movies/edit-movie/:movieId" element={<EditMovie />} />
          <Route path="/admin/movies/add-movie" element={<AddMovie />} />
          <Route path="/admin/showtimes" element={<PrivateRoute><ManageShowtimes /></PrivateRoute>} />
          <Route path="/admin/showtimes/edit-screening/:screeningId" element={<PrivateRoute><EditScreening /></PrivateRoute>} />
          <Route path="/admin/showtimes/add-screening" element={<PrivateRoute><AddScreening /></PrivateRoute>} />
          <Route path="/admin/halls" element={<PrivateRoute><ManageHalls /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute> <ManageUsers /></PrivateRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
