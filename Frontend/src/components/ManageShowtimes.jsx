import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageShowtimes.css';  // Assuming you have a CSS file for styling

const ManageShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch showtimes data from the backend
    axios.get('http://localhost:5000/api/screenings')
      .then(response => {
        setShowtimes(response.data);
      })
      .catch(error => {
        console.error('Error fetching showtimes:', error);
        setError('Error fetching showtimes data');
      });

    // Fetch movies data from the backend
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });

    // Fetch halls data from the backend
    axios.get('http://localhost:5000/api/halls')
      .then(response => {
        setHalls(response.data);
      })
      .catch(error => {
        console.error('Error fetching halls:', error);
      });
  }, []);

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };

  const getHallName = (hallId) => {
    const hall = halls.find(h => h.id === hallId);
    return hall ? hall.name : 'Unknown Hall';
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
            <th>ID</th>
            <th>Movie</th>
            <th>Date/Time</th>
            <th>Hall</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map((showtime) => {
            const showtimeDate = new Date(showtime.date);
            const formattedDateTime = `${showtimeDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} ${showtime.time}`;

            return (
              <tr key={showtime.id}>
                <td>{showtime.id}</td>
                <td>{getMovieTitle(showtime.movieId)}</td>
                <td>{formattedDateTime}</td>
                <td>{getHallName(showtime.hallId)}</td>
                <td>
                  <FontAwesomeIcon icon={faEdit} className="edit-button" />
                  <FontAwesomeIcon icon={faTrash} className="delete-button" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageShowtimes;
