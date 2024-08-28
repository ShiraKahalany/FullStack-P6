import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useNavigate } from 'react-router-dom';
import '../css/EditScreening.css';

const AddScreening = () => {
  const navigate = useNavigate();
  const [screening, setScreening] = useState({
    movieId: '',
    hallId: '',
    date: '',
    time: ''
  });
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoviesAndHalls();
  }, []);

  const fetchMoviesAndHalls = async () => {
    try {
      const moviesResponse = await axios.get('http://localhost:5000/api/movies');
      const hallsResponse = await axios.get('http://localhost:5000/api/halls');
      setMovies(moviesResponse.data);
      setHalls(hallsResponse.data);
    } catch (err) {
      setError('Error fetching movies or halls');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScreening({
      ...screening,
      [name]: value
    });
  };

  const handleTimeChange = (selectedDates, dateStr) => {
    setScreening({
      ...screening,
      time: dateStr
    });
  };

  useEffect(() => {
    Flatpickr(document.querySelector('#time-picker'), {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      onChange: handleTimeChange
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/screenings', screening)
      .then(() => navigate('/admin/showtimes'))
      .catch(error => setError('Error adding screening'));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="add-screening-container">
      <h2>Add Screening</h2>
      <form onSubmit={handleSubmit} className="add-screening-form">
        <label>
          Movie:
          <select name="movieId" value={screening.movieId} onChange={handleInputChange} required>
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Hall:
          <select name="hallId" value={screening.hallId} onChange={handleInputChange} required>
            <option value="">Select a hall</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={screening.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Time:
          <input
            id="time-picker"
            name="time"
            value={screening.time}
            onChange={handleTimeChange}
            required
          />
        </label>
        <button type="submit" className="save-button">Add Screening</button>
      </form>
    </div>
  );
};

export default AddScreening;
