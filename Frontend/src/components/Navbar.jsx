import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShieldAlt, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import '../css/NavBar.css'; // Import the CSS for styling

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length > 0) {
      const data = JSON.parse(localStorage.getItem('data'));
      const userCart = data.carts.find(cart => cart.userId === user.id);
      if (userCart) {
        userCart.items = [...userCart.items, ...cartItems];
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
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">Pleasure</Link>
        </div>
        <div className="navbar-icons">
          <Link to="/movies">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </Link>
          <Link to="/info">
            <FontAwesomeIcon icon={faUser} size="lg" />
          </Link>
          <Link to="/cart">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </Link>
          {( user && user.isAdmin) ? (
            <Link to="/admin">
              <FontAwesomeIcon icon={faShieldAlt} size="lg" />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span>{user.username}</span>
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
