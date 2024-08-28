import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/EditMovie.css';

const AddMovie = () => {
  const navigate = useNavigate();

  const handleSave = (event) => {
    event.preventDefault();
    const newMovie = {
      title: event.target.title.value,
      description: event.target.description.value,
      duration: event.target.duration.value,
      genre: event.target.genre.value,
      director: event.target.director.value,
      releaseDate: event.target.releaseDate.value,
      trailerPath: event.target.trailerPath.value,
      imagePath: event.target.imagePath.value,
    };

    axios.post('http://localhost:5000/api/movies', newMovie)
      .then(() => {
        navigate('/admin/movies')
      })
      .catch(error => {
        console.error('Error adding movie:', error);
      });
  };

  return (
    <div className="movie-form-container">
      <h2>Add Movie</h2>
      <form onSubmit={handleSave}>
        <label>
          Title:
          <input type="text" name="title" required />
        </label>
        <label>
          Description:
          <textarea name="description" required />
        </label>
        <label>
          Duration:
          <input type="number" name="duration" required />
        </label>
        <label>
          Genre:
          <select name="genre" required>
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
          <input type="text" name="director" required />
        </label>
        <label>
          Release Date:
          <input type="date" name="releaseDate" required />
        </label>
        <label>
          Trailer Path:
          <input type="text" name="trailerPath" />
        </label>
        <label>
          Image Path:
          <input type="text" name="imagePath" />
        </label>
        <button type="submit" className="save-button">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;
