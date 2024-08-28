import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../css/ManageMovies.css';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setError('Error fetching movies data');
      });
  };

  const handleEdit = (movieId) => {
    navigate(`/admin/movies/edit-movie/${movieId}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      axios.delete(`http://localhost:5000/api/movies/${id}`)
        .then(() => {
          fetchMovies();
        })
        .catch(error => {
          console.error('Error deleting movie:', error);
        });
    }
  };

  const handleAdd = () => {
    navigate('/admin/movies/add-movie');
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="manage-movies-container">
      <h2>Manage Movies</h2>
      <table className="manage-movies-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td><img src={movie.imagePath} alt={movie.title} className="movie-image" /></td>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.duration}</td>
              <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(movie.id)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} /> 
                </button>
                <button onClick={() => handleDelete(movie.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-movie-button" onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default ManageMovies;
