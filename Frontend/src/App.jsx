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
function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar /> {/* Include NavBar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies/>} /> {/* Replace with actual Movies component */}
          <Route path="/movies/:movieId" element={<SelectedMovie />} />
          <Route path="/movies/:movieId/seats" element={<SelectSeats />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/admin" element={<PrivateRoute><AdminControlPanel /></PrivateRoute>} /> {/* Admin Control Panel */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/gifts" element={<div>Gifts and Movie Cards Page</div>} /> {/* Replace with actual Gifts component */}
          <Route path="/info" element={<PrivateRoute><Info /></PrivateRoute>} />
          <Route path="/aboutus" element={<div>About Us Page</div>} /> {/* Replace with actual About Us component */}
          <Route path="/admin/movies" element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
