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
    const updatedMovie = {
      title: event.target.title.value,
      description: event.target.description.value,
      duration: event.target.duration.value,
      genre: event.target.genre.value,
      director: event.target.director.value,
      releaseDate: event.target.releaseDate.value,
      trailerPath: event.target.trailerPath.value,
      imagePath: event.target.imagePath.value,
    };

    axios.put(`http://localhost:5000/api/movies/${movieId}`, updatedMovie)
      .then(() => {
        navigate('/admin/movies')
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
      </form>
    </div>
  );
};

export default EditMovie;
