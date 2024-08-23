import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageMovies.css'; // Assuming you have a CSS file for styling

const ManageMovies = () => {
  const [movies, setMovies] = useState([]); // Use state to hold movie data
  const [error, setError] = useState(null); // Use state to hold any error

  useEffect(() => {
    // Fetch movies from the backend API
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        setMovies(response.data); // Set movies data from the response
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setError('Error fetching movies data');
      });
  }, []);

  if (error) {
    return <div>{error}</div>; // Display error message if there's an error
  }

  return (
    <div className="manage-movies-container">
      <h2>Manage Movies</h2>
      <table className="manage-movies-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.rating}</td>
              <td>{movie.duration}</td>
              <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} />
                <FontAwesomeIcon icon={faTrash} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMovies;
