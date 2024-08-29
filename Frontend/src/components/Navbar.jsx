import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShieldAlt, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
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
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/" onClick={handleLinkClick}> Pleasure</Link>
        </div>
        <div className="navbar-icons">
        <Link to="/movies" onClick={handleLinkClick}> 
            <FontAwesomeIcon icon={faHome} size="lg" /> 
          </Link>
          <Link to="/info" onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </Link>
          <Link to="/cart" onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </Link>
          {user && user.isAdmin && (
            <Link to="/admin" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faShieldAlt} size="lg" />
            </Link>
          )}
        </div>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        Menu
      </button>
      <div className={`navbar-links ${menuActive ? 'show' : ''}`}>
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
