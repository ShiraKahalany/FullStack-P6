import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import '../css/Info.css';
import MyOrders from './MyOrders';

const Info = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
      alert("You need to log in first.");
      navigate('/login');
      return;
    }

    // Fetch the user details from the server
    axios.get(`http://localhost:5000/api/users/${storedUser.id}`)
      .then(response => {
        setUser(response.data);
        setPassword(response.data.password);
        setUsername(response.data.username);
        setEmail(response.data.email);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details.');
      });
  }, [navigate]);

  const handleEditClick = () => {
    const currentPassword = prompt("Please enter your current password to edit your details:");

    if (!currentPassword) {
      alert("Password is required to edit your details.");
      return;
    }

    if (currentPassword !== password) {
      alert("Incorrect password. You cannot edit your details.");
      return;
    }

    setEditing(true);
  };

  const handleSaveClick = async () => {
    const updateData = {
      username: username,
      email: email,
      password: password, // Keep the old password if not changing it
    };
  
    try {
      const updateResponse = await axios.put(`http://localhost:5000/api/users/${user.id}`, updateData);
      
      if (updateResponse.status === 200) {
        const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
  
        if (response.data) {
          const updatedUser = response.data;
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          alert('User information updated successfully.');
        } else {
          alert('Failed to refresh user session. Please log in again.');
        }
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information.');
    }
  
    setEditing(false);
  };

  const handleCancelClick = () => {
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setEditing(false);
  };

  const toggleOrders = () => {
    setShowOrders(!showOrders);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="info-container">
      <div className="info-card">
        <FontAwesomeIcon icon={faUser} className="user-icon" />
        {!editing ? (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="edit_button" onClick={handleEditClick}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          </>
        ) : (
          <>
            <div className="input-group">
              <label>Username:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="button-group">
              <button className="save_button" onClick={handleSaveClick}>
                Save
              </button>
              <button className="cancel_button" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      <button className="orders-button" onClick={toggleOrders}>
        <FontAwesomeIcon icon={faClipboardList} /> My Orders
      </button>
      {showOrders && <MyOrders userId={user.id} />}
    </div>
  );
};

export default Info;
