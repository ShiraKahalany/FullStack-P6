import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../public/data.json';  // Adjust the path accordingly
import '../css/SelectedMovie.css';

const SelectedMovie = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);

  useEffect(() => {
    const selectedMovie = data.movies.find(m => m.id === parseInt(movieId));
    setMovie(selectedMovie);
    const movieScreenings = data.screenings.filter(screening => screening.movieId === parseInt(movieId));
    setScreenings(movieScreenings);
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  // Convert YouTube URL to embed URL
  const trailerUrl = movie.trailerPath.replace("watch?v=", "embed/");

  const handleShowtimeClick = (screeningId) => {
    navigate(`/movies/${movieId}/seats`, { state: { screeningId } });
  };

  return (
    <div className="selected-movie-container">
      <h2>Selected Movie:</h2>
      <div className="movie-details">
        <img src={movie.imagePath} alt={movie.title} />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Category:</strong> {movie.genre}</p>
          <p><strong>Runtime:</strong> {movie.duration} minutes</p>
          <p><strong>Released On:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Trailer:</strong> <a href={trailerUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
        </div>
        <div className="movie-trailer">
          <iframe
            width="410"
            height="240"
            src={trailerUrl}
            title={`${movie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <h3>Showtimes</h3>
      <div className="screenings">
        {screenings.map(screening => (
          <div key={screening.id} className="screening-item">
            <span>Showtime on {new Date(screening.date).toLocaleDateString()}: </span>
            <button className="screening-button" onClick={() => handleShowtimeClick(screening.id)}>
              {new Date(`${screening.date}T${screening.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedMovie;
