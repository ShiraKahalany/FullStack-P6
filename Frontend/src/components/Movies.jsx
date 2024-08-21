import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Movies.css';
import data from '../../public/data.json';  // Adjust the path accordingly

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setMovies(data.movies || []);
    setScreenings(data.screenings || []);
    setSearchResults(data.movies || []);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setSearchResults(movies);
    } else {
      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setSearchResults(filteredMovies);
    }
  };

  const getScreeningsForMovie = (movieId) => {
    return screenings.filter(screening => screening.movieId === movieId);
  };

  const handleMoreInfoClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="movies-container">
      <h2>Movie Search</h2>
      <div className="advanced-search">
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results">
        {searchResults && searchResults.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={movie.imagePath} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p><strong>Rating:</strong> {movie.rating}</p>
              <p><strong>Category:</strong> {movie.genre}</p>
              <p><strong>Runtime:</strong> {movie.duration} minutes</p>
              <div className="screenings">
                {getScreeningsForMovie(movie.id).map(screening => (
                  <div key={screening.id} className="screening-item">
                    <span>Showtimes on {new Date(screening.date).toLocaleDateString()}:</span>
                    <button className="screening-button">
                      {new Date(`${screening.date}T${screening.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="info-button"
                onClick={() => handleMoreInfoClick(movie.id)} // Navigate to SelectedMovie
              >
                More Info & Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
