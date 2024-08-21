import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';
import data from '../../public/data.json';  // Adjust the path accordingly
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Find the user in the data.json file
    const user = data.users.find((u) => u.email === email && u.password === password);
    
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Fetch the user's cart from data.json
      const userCart = data.carts.find(cart => cart.userId === user.id);
      localStorage.setItem('cart', JSON.stringify(userCart ? userCart.items : []));

      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <main role="main" className="main">
        <h1>Login to My Planet</h1>
        <p>Welcome back</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
          />
          <div className="wrap">
            <button type="submit" id="signinSubmit" name="signinSubmit" className="submit-button">
              LOG IN
            </button>
          </div>
        </form>
        <p>Don't have an account yet? <a href="/register" className="sign-up">Sign Up</a></p>
      </main>
    </div>
  );
};

export default Login;
