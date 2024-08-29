import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/NavBar.css'; // Import the CSS for styling

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [menuActive, setMenuActive] = useState(false); // State for toggling the menu

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

  const handleLinkClick = () => {
    setMenuActive(false); // Close the menu on link click
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className={`navbar ${menuActive ? 'active' : ''}`}>
      <div className="navbar-logo">
        <Link to="/" onClick={handleLinkClick}>Pleasure</Link>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        Menu
      </button>
      <div className={`navbar-links ${menuActive ? 'show' : ''}`}>
        <Link to="/movies" onClick={handleLinkClick}>Movies</Link>
        <Link to="/gifts" onClick={handleLinkClick}>GIFTS & MOVIE CARDS</Link>
        <Link to="/info" onClick={handleLinkClick}>INFO</Link>
        <Link to="/aboutus" onClick={handleLinkClick}>ABOUT US</Link>
        <div className="navbar-user-mobile">
          {user ? (
            <>
              <Link to="/cart" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={handleLinkClick}>
                  <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                </Link>
              )}
              <button onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</button>
            </>
          ) : (
            <button onClick={() => { navigate('/login'); handleLinkClick(); }}>Log In</button>
          )}
        </div>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span>{user.username}</span>
            <Link to="/cart" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </Link>
            {user.isAdmin && (
              <Link to="/admin" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
              </Link>
            )}
            <button onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</button>
          </>
        ) : (
          <button onClick={() => { navigate('/login'); handleLinkClick(); }}>Log In</button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
