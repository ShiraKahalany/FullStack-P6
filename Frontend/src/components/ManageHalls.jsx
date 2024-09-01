import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageHalls.css';

const ManageHalls = () => {
  const [halls, setHalls] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [originalHalls, setOriginalHalls] = useState([]); // Store original hall data
  const [newHall, setNewHall] = useState({ name: '', capacity: '' });

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = () => {
    axios.get('http://localhost:5000/api/halls')
      .then(response => {
        setHalls(response.data);
        setOriginalHalls(response.data); // Store original data when fetched
      })
      .catch(error => console.error('Error fetching halls:', error));
  };

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setHalls(halls.map(hall => hall.id === id ? { ...hall, [name]: value } : hall));
  };

  const handleEdit = (id) => {
    setIsEditing(id);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  const handleSave = (id) => {
    const hallToSave = halls.find(hall => hall.id === id);
    const originalHall = originalHalls.find(hall => hall.id === id);

    // Prepare an object to hold only the changed fields
    const updatedFields = {};
    if (hallToSave.name !== originalHall.name) {
      updatedFields.name = hallToSave.name;
    }
    if (hallToSave.capacity !== originalHall.capacity) {
      updatedFields.capacity = hallToSave.capacity;
    }

    axios.put(`http://localhost:5000/api/halls/${id}`, updatedFields)
      .then(() => {
        fetchHalls();
        setIsEditing(null);
      })
      .catch(error => {
        console.error('Error saving hall:', error);
        if (error.response && error.response.data && error.response.data.error) {
          window.alert(error.response.data.error);
        }
      });
  };

  const handleNewHallChange = (e) => {
    const { name, value } = e.target;
    setNewHall({ ...newHall, [name]: value });
  };

  const handleAddHall = () => {
    axios.post('http://localhost:5000/api/halls', newHall)
      .then(() => {
        fetchHalls();
        setNewHall({ name: '', capacity: '' });
      })
      .catch(error => console.error('Error adding hall:', error));
  };

  const handleDeleteHall = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      axios.delete(`http://localhost:5000/api/halls/${id}`)
        .then(() => fetchHalls())
        .catch(error => {
          console.error('Error deleting hall:', error);
          if (error.response && error.response.data && error.response.data.error) {
            window.alert(error.response.data.error); // Display alert with error message
          }
        });
    }
  };

  return (
    <div className="manage-halls-container">
      <h2>Manage Halls</h2>
      <div className="halls-grid">
        {halls.map(hall => (
          <div className="hall-card" key={hall.id}>
            <FontAwesomeIcon icon={faBuilding} className="hall-icon" />
            {isEditing === hall.id ? (
              <>
                <input
                  name="name"
                  value={hall.name}
                  onChange={(e) => handleEditChange(e, hall.id)}
                  placeholder="Hall Name"
                />
                <input
                  name="capacity"
                  value={hall.capacity}
                  onChange={(e) => handleEditChange(e, hall.id)}
                  placeholder="Capacity"
                  type="number"
                />
                <button onClick={() => handleSave(hall.id)} className="save-button">Save</button>
                <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
              </>
            ) : (
              <>
                <p><strong>ID:</strong> {hall.id}</p>
                <p><strong>Name:</strong> {hall.name}</p>
                <p><strong>Capacity:</strong> {hall.capacity}</p>
                <button onClick={() => handleEdit(hall.id)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} /> 
                </button>
                <button onClick={() => handleDeleteHall(hall.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> 
                </button>
              </>
            )}
          </div>
        ))}
        <div className="hall-card new-hall-card">
          <FontAwesomeIcon icon={faPlus} className="plus-icon" />
          <input
            name="name"
            value={newHall.name}
            onChange={handleNewHallChange}
            placeholder="Hall Name"
          />
          <input
            name="capacity"
            value={newHall.capacity}
            onChange={handleNewHallChange}
            placeholder="Capacity"
            type="number"
          />
          <button onClick={handleAddHall} className="save-button">Add Hall</button>
        </div>
      </div>
    </div>
  );
};

export default ManageHalls;
