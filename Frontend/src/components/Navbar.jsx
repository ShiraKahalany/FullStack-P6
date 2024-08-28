import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/NavBar.css'; // Import the CSS for styling

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');

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
            {user.isAdmin ? (
              <Link to="/admin">
                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
              </Link>
            ) : null}
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
