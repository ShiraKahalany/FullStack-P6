import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/ManageMovies.css';  // Assuming you have a CSS file for styling
import data from '../../public/data.json'; // Adjust the path

const ManageMovies = () => {
  // Example movie data
  const movies = data.movies;

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
              <td>{movie.releaseDate}</td>
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
