import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/SelectSeats.css';  // Make sure to define the styles here

const SelectSeats = () => {
  const { movieId } = useParams();
  const [screening, setScreening] = useState(null);
  const [movie, setMovie] = useState(null);
  const [hall, setHall] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Fetch the screening details from the server
    axios.get(`http://localhost:5000/api/screenings/${movieId}`)
      .then(response => {
        setScreening(response.data);
        return response.data;
      })
      .then(screening => {
        // Fetch the associated movie and hall details
        axios.get(`http://localhost:5000/api/movies/${screening.movieId}`)
          .then(response => setMovie(response.data));

        axios.get(`http://localhost:5000/api/halls/${screening.hallId}`)
          .then(response => setHall(response.data));
      })
      .catch(error => {
        console.error('Error fetching screening:', error);
      });
  }, [movieId]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber)); // Remove seat if already selected
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]); // Add seat to selectedSeats
    }
  };

  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);
  const isSeatAvailable = (seatNumber) => screening && !screening.bookedSeats.includes(seatNumber.toString());

  const handleAddToCart = () => {
    const newTickets = selectedSeats.map(seatNumber => {
      return {
        id: generateUniqueId(), // Generate a unique ID for the ticket
        ticketId: generateTicketId(), // Generate a unique ticket number
        movieTitle: movie.title,
        date: screening.date,
        time: screening.time,
        hall: hall.name,
        seatNumber: seatNumber,
        price: 10.00, // Example price, you can modify this
      };
    });

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, ...newTickets];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (!screening || !movie || !hall) {
    return <div>Loading...</div>;
  }

  return (
    <div className="select-seats-container">
      <h2>Get Tickets</h2>
      <div className="selected-showtime">
        <h3>Selected Showtime:</h3>
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Date:</strong> {new Date(screening.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {screening.time}</p>
        <p><strong>Hall:</strong> {hall.name}</p>
        <p><strong>Runtime:</strong> {movie.duration} minutes</p>
      </div>
      <div className="seats-layout">
        <h3>Screen</h3>
        <div className="seats-grid">
          {Array.from({ length: hall.capacity || 200 }, (_, index) => index + 1).map(seatNumber => (
            <button
              key={seatNumber}
              className={`seat-button ${isSeatSelected(seatNumber) ? 'selected' : ''} ${!isSeatAvailable(seatNumber) ? 'unavailable' : ''}`}
              onClick={() => isSeatAvailable(seatNumber) && handleSeatClick(seatNumber)}
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
    </div>
  );
};

export default SelectSeats;

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);
const generateTicketId = () => Math.random().toString(36).substr(2, 7);
