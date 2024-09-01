import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditMovie.css';

const EditMovie = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies/${movieId}`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error('Error fetching movie:', error);
        setError('Error fetching movie data');
      });
  }, [movieId]);

  const handleSave = (event) => {
    event.preventDefault();
  
    // Create an object to hold the changed fields
    const updatedFields = {};
  
    // Check each field and compare it to the original movie data
    if (event.target.title.value !== movie.title) {
      updatedFields.title = event.target.title.value;
    }
    if (event.target.description.value !== movie.description) {
      updatedFields.description = event.target.description.value;
    }
    if (event.target.duration.value !== movie.duration) {
      updatedFields.duration = event.target.duration.value;
    }
    if (event.target.genre.value !== movie.genre) {
      updatedFields.genre = event.target.genre.value;
    }
    if (event.target.director.value !== movie.director) {
      updatedFields.director = event.target.director.value;
    }
    if (event.target.releaseDate.value !== movie.releaseDate.split('T')[0]) {
      updatedFields.releaseDate = event.target.releaseDate.value;
    }
    if (event.target.trailerPath.value !== movie.trailerPath) {
      updatedFields.trailerPath = event.target.trailerPath.value;
    }
    if (event.target.imagePath.value !== movie.imagePath) {
      updatedFields.imagePath = event.target.imagePath.value;
    }
  
    // Send only the updated fields to the backend
    axios.put(`http://localhost:5000/api/movies/${movieId}`, updatedFields)
      .then(() => {
        navigate('/admin/movies');
      })
      .catch(error => {
        console.error('Error updating movie:', error);
        setError('Error updating movie');
      });
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  const handleCancel = () => {
    navigate('/admin/movies');
  };

  return (
    <div className="movie-form-container">
      <h2>Edit Movie</h2>
      <form onSubmit={handleSave}>
        <label>
          Title:
          <input type="text" name="title" defaultValue={movie.title} required />
        </label>
        <label>
          Description:
          <textarea name="description" defaultValue={movie.description} required />
        </label>
        <label>
          Duration (in minutes):
          <input type="number" name="duration" defaultValue={movie.duration} required />
        </label>
        <label>
          Genre:
          <select name="genre" defaultValue={movie.genre} required>
            <option value="Comedy">Comedy</option>
            <option value="Action">Action</option>
            <option value="Animation">Animation</option>
            <option value="Adventure">Adventure</option>
            <option value="Thriller">Thriller</option>
            <option value="Musical">Musical</option>
            <option value="Horror">Horror</option>
            <option value="Drama">Drama</option>
          </select>
        </label>
        <label>
          Director:
          <input type="text" name="director" defaultValue={movie.director} required />
        </label>
        <label>
          Release Date:
          <input type="date" name="releaseDate" defaultValue={movie.releaseDate.split('T')[0]} required />
        </label>
        <label>
          Trailer Path:
          <input type="text" name="trailerPath" defaultValue={movie.trailerPath} />
        </label>
        <label>
          Image Path:
          <input type="text" name="imagePath" defaultValue={movie.imagePath} />
        </label>
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" className="cancelB" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditMovie;
