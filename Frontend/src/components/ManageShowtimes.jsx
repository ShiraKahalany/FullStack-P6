import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../css/ManageShowtimes.css';

const ManageShowtimes = () => {
  const [screenings, setScreenings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScreenings();
  }, []);

  const fetchScreenings = () => {
    axios.get('http://localhost:5000/api/screenings/showtimes')
      .then(response => {
        const sortedScreenings = response.data.sort((a, b) => 
          new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
        );
        setScreenings(sortedScreenings);
      })
      .catch(error => {
        console.error('Error fetching screenings:', error);
        setError('Error fetching screenings data');
      });
  };

  const handleEdit = (screeningId) => {
    navigate(`/admin/showtimes/edit-screening/${screeningId}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this screening?')) {
      axios.delete(`http://localhost:5000/api/screenings/${id}`)
        .then(() => {
          fetchScreenings();
        })
        .catch(error => {
          console.error('Error deleting screening:', error);
        });
    }
  };

  const handleAdd = () => {
    navigate('/admin/showtimes/add-screening');
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="manage-showtimes-container">
      <h2>Manage Showtimes</h2>
      <table className="manage-showtimes-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Title</th>
            <th>Hall</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {screenings.map((screening) => (
            <tr key={screening.screeningId}>
              <td><img src={screening.imagePath} alt={screening.title} className="movie-image" /></td>
              <td>{screening.screeningId}</td>
              <td>{screening.title}</td>
              <td>{screening.hallName}</td>
              <td>{new Date(screening.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
              <td>{screening.time.slice(0, 5)}</td>
              <td>
                <button onClick={() => handleEdit(screening.screeningId)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(screening.screeningId)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-showtime-button" onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default ManageShowtimes;
