import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUserId(loggedInUser?.id);

    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleToggleManager = (id) => {
    axios.put(`http://localhost:5000/api/users/admin/${id}`)
      .then(response => {
        fetchUsers();
        window.alert(response.data.message || 'User admin status updated successfully');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          window.alert(error.response.data.error);
        } else {
          window.alert('Error updating user admin status. Please try again.');
        }
        console.error('Error updating user admin status:', error);
      });
  };

  const filteredUsers = users.filter(user => {
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
    );
  });

  return (
    <div className="manage-users-container">
      <div className="manage-users-header">
        <h2>Manage Users</h2>
        <div className="search-container">
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            type="text"
            placeholder="Search by Username or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div className={`user-card ${user.isAdmin ? 'admin-card' : 'user-card'}`} key={user.id}>
            <FontAwesomeIcon icon={faUser} className="user-icon" />
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.isAdmin ? (
              user.id !== currentUserId && (
                <button onClick={() => handleToggleManager(user.id)} className="managerCancel-button">
                  <FontAwesomeIcon icon={faUserTie} /> Cancel Manager
                </button>
              )
            ) : (
              <button onClick={() => handleToggleManager(user.id)} className="manager-button">
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
