import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/SelectedMovie.css';

const SelectedMovie = () => {
  const { movieId, screeningId } = useParams();
  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const [hall, setHall] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unavailableSeats, setUnavailableSeats] = useState([]);

  useEffect(() => {
    // Fetch movie details
    axios.get(`http://localhost:5000/api/movies/${movieId}`)
      .then(response => setMovie(response.data))
      .catch(error => console.error('Error fetching movie:', error));
  
    // Fetch screening and hall details
    axios.get(`http://localhost:5000/api/screenings/${screeningId}`)
      .then(response => {
        setScreening(response.data);
        return axios.get(`http://localhost:5000/api/halls/${response.data.hallId}`);
      })
      .then(response => setHall(response.data))
      .catch(error => console.error('Error fetching screening or hall:', error));
  
    // Fetch unavailable seats for the screening
    axios.get(`http://localhost:5000/api/tickets/screening/${screeningId}`)
      .then(response => {
        setUnavailableSeats(response.data);
      })
      .catch(error => console.error('Error fetching booked seats:', error));
  }, [movieId, screeningId]);
  

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);

  const isSeatAvailable = (seatNumber) => {
    return !unavailableSeats.includes(seatNumber);
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert("Please log in to add tickets to your cart.");
      return;
    }

    // Prepare the new tickets
    const newTickets = selectedSeats.map(seatNumber => ({
      id: null,
      userId: user.id,
      screeningId: screeningId,
      seatNumber: seatNumber,
      price: 10.00,
      isPaid: false
    }));

    try {
      // Process each ticket creation request sequentially
      for (const ticket of newTickets) {
        await axios.post('http://localhost:5000/api/tickets', ticket);
      }

      // After successfully adding all tickets, show the confirmation modal
      document.getElementById("cartModal").style.display = "block";
    } catch (error) {
      console.error('Error adding tickets to cart:', error);
      alert("Failed to add tickets to your cart. Please try again.");
    }
  };

  if (!movie || !screening || !hall) {
    return <div>Loading...</div>;
  }

  const trailerUrl = movie.trailerPath ? movie.trailerPath.replace("watch?v=", "embed/") : '';

  return (
    <div className="selected-movie-container">
      <div className="movie-trailer">
        <iframe
          src={trailerUrl}
          title={`${movie.title} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="movie-details">
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Category:</strong> {movie.genre}</p>
          <p><strong>Runtime:</strong> {movie.duration} minutes</p>
          <p><strong>Released On:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Date:</strong> {new Date(screening.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {screening.time}</p>
          <p><strong>Hall:</strong> {hall.name}</p>
        </div>
        <div className="movie-poster">
          <img src={movie.imagePath} alt={movie.title} />
        </div>
      </div>
      <div className="seats-layout">
        <h3>Screen</h3>
        <div className="seats-grid">
          {Array.from({ length: hall.capacity || 200 }, (_, index) => index + 1).map(seatNumber => (
            <button
              key={seatNumber}
              className={`seat-button ${isSeatSelected(seatNumber) ? 'selected' : ''} ${!isSeatAvailable(seatNumber) ? 'unavailable' : ''}`}
              onClick={() => isSeatAvailable(seatNumber) && handleSeatClick(seatNumber)}
              disabled={!isSeatAvailable(seatNumber)}
            >
              {seatNumber}
            </button>
          ))}
        </div>
      </div>
      <div className="selected-tickets">
        <h3>Tickets:</h3>
        <div className="tickets-container">
          {selectedSeats.map((seat, index) => (
            <div key={index} className="ticket-info">
              <p><strong>Seat Number:</strong> {seat}</p>
            </div>
          ))}
        </div>
      </div>
      <button className="add-ticket-button" onClick={handleAddToCart}>Add Tickets to Order</button>

      {/* Modal */}
      <div id="cartModal" className="modal">
        <div className="modal-content">
          <h2>Tickets successfully added to your cart!</h2>
          <div className="modal-buttons">
            <button onClick={() => window.location.href = "/cart"}>Go to Cart</button>
            <button onClick={() => window.location.href = "/movies"}>Back to Movies</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedMovie;
