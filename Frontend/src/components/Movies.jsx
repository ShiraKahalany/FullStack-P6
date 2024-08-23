import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import '../css/Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch movies and screenings from the backend API
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        setMovies(response.data);
        setSearchResults(response.data); // Initially show all movies
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });

    axios.get('http://localhost:5000/api/screenings')
      .then(response => {
        setScreenings(response.data);
      })
      .catch(error => {
        console.error('Error fetching screenings:', error);
      });
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
    return screenings
      .filter(screening => screening.movieId === movieId)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)); // Sort by date and time
  };

  const groupScreeningsByDate = (movieId) => {
    const movieScreenings = getScreeningsForMovie(movieId);
    const grouped = movieScreenings.reduce((acc, screening) => {
      const date = new Date(screening.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(screening);
      return acc;
    }, {});
    return grouped;
  };

  const handleScreeningClick = (movieId, screeningId) => {
    navigate(`/movies/${movieId}/screening/${screeningId}`);
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
                {Object.entries(groupScreeningsByDate(movie.id)).map(([date, screenings]) => (
                  <div key={date} className="screening-date-group">
                    <span>Showtimes on {date}:</span>
                    {screenings.map(screening => {
                      const formattedTime = screening.time.slice(0, 5); // Remove seconds (get "HH:mm" format)

                      return (
                        <button
                          key={screening.id}
                          className="screening-button"
                          onClick={() => handleScreeningClick(movie.id, screening.id)}
                        >
                          {formattedTime}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
