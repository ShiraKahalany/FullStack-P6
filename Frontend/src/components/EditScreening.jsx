import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/EditScreening.css';

const EditScreening = () => {
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const [screening, setScreening] = useState({
    movieId: '',
    hallId: '',
    date: '',
    time: '' 
  });
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoviesAndHalls();
    fetchScreening();
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

  const fetchScreening = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/screenings/${screeningId}`);
      const screeningData = response.data;
  
      const formattedDate = new Date(screeningData.date).toISOString().split('T')[0];
  
      setScreening({
        movieId: screeningData.movieId,
        hallId: screeningData.hallId,
        date: formattedDate,
        time: screeningData.time.slice(0, 5)  // Ensure time is in HH:MM format
      });
      setLoading(false);
    } catch (err) {
      setError('Error fetching screening');
      setLoading(false);
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
    if (!loading) {
      Flatpickr(document.querySelector('#time-picker'), {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultDate: screening.time,
        onChange: handleTimeChange
      });
    }
  }, [loading, screening.time]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/screenings/${screeningId}`, screening)
      .then(() => navigate('/admin/showtimes'))
      .catch(error => setError('Error updating screening'));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCancel = () => {
    navigate('/admin/showtimes');
  };

  return (
    <div className="edit-screening-container">
      <h2>Edit Screening</h2>
      <form onSubmit={handleSubmit} className="edit-screening-form">
        <label>
          Movie:
          <select
            name="movieId"
            value={screening.movieId}
            onChange={handleInputChange}
            required
          >
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
          <select
            name="hallId"
            value={screening.hallId}
            onChange={handleInputChange}
            required
          >
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
          />
        </label>
        <div className="buttons-group">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" className="cancel-b" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditScreening;
