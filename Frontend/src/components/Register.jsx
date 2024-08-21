import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css'; // השתמשי באותו קובץ CSS של ה-Login

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordVerify: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // בדיקת סיסמאות תואמות
    if (formData.password !== formData.passwordVerify) {
      setError('Passwords do not match');
      return;
    }

    // בדיקה שהסיסמה היא לפחות 6 תווים
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // בדיקה שהאימייל תקין (מכיל @ ויש בו סיומת חוקית כמו .com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // שמירת המשתמש ב-Local Storage (במקום API)
    const newUser = {
      id: Date.now(),
      username: formData.username,
      password: formData.password,
      email: formData.email,
      isAdmin: false
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/login');
  };

  return (
    <div className="register-page">
      <main role="main" className="main">
        <h1>Register to My Planet</h1>
        <p>Create your account</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your Username"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            required
          />
          <label htmlFor="passwordVerify">Verify Password</label>
          <input
            type="password"
            id="passwordVerify"
            name="passwordVerify"
            value={formData.passwordVerify}
            onChange={handleChange}
            placeholder="Verify your Password"
            required
          />
          <div className="wrap">
            <button type="submit" className="submit-button">REGISTER</button>
          </div>
        </form>
        <p>Already have an account? <a href="/login" className="sign-in">Sign In</a></p>
      </main>
    </div>
  );
};

export default Register;
