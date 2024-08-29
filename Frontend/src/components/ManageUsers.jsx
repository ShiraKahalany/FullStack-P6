import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleCreateManager = (id) => {
    axios.put(`http://localhost:5000/api/users/admin/${id}`)
      .then(response => {
        // If the request is successful, refresh the users list and show a success message
        fetchUsers();
        window.alert(response.data.message || 'User updated to admin successfully');
      })
      .catch(error => {
        // If an error occurs, display the error message
        if (error.response && error.response.data && error.response.data.error) {
          window.alert(error.response.data.error);
        } else {
          window.alert('Error creating manager. Please try again.');
        }
        console.error('Error creating manager:', error);
      });
  };
  

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <div className="users-grid">
        {users.map(user => (
          <div className={`user-card ${user.isAdmin ? 'admin-card' : 'user-card'}`} key={user.id}>
            <FontAwesomeIcon icon={faUser} className="user-icon" />
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {!user.isAdmin && (
              <button onClick={() => handleCreateManager(user.id)} className="manager-button">
                <FontAwesomeIcon icon={faUserTie} /> Create Manager
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
