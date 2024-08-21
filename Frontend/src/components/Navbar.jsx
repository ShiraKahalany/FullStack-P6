import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/NavBar.css'; // Import the CSS for styling

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Check for items in the cart
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length > 0) {
      // Find the user's cart in the data.json and update their items
      const userCart = data.carts.find(cart => cart.userId === user.id);

      if (userCart) {
        // Add the items to the user's cart in data.json
        userCart.items = [...userCart.items, ...cartItems];

        // Simulate saving the updated data.json
        // In a real application, this would be an API call to update the backend
        console.log("Updated data.json:", JSON.stringify(data, null, 2));
      }
    }

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('cart');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Pleasure</Link>
      </div>
      <div className="navbar-links">
        <Link to="/movies">Movies</Link>
        <Link to="/gifts">GIFTS & MOVIE CARDS</Link>
        <Link to="/info">INFO</Link>
        <Link to="/aboutus">ABOUT US</Link>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span>{user.username}</span>
            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </Link>
            {user.isAdmin && (
              <Link to="/admin">
                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
              </Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Log In</button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
