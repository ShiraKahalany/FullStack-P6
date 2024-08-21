import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../../public/data.json';  // Adjust the path accordingly
import '../css/SelectSeats.css';  // Make sure to define the styles here

const SelectSeats = () => {
  const { movieId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const screening = data.screenings.find(s => s.id === parseInt(movieId)); // Assuming movieId is the screeningId

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber)); // Remove seat if already selected
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]); // Add seat to selectedSeats
    }
  };

  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);
  const isSeatAvailable = (seatNumber) => !screening.bookedSeats.includes(seatNumber.toString());

  const handleAddToCart = () => {
    const newTickets = selectedSeats.map(seatNumber => {
      return {
        id: generateUniqueId(), // Generate a unique ID for the ticket
        ticketId: generateTicketId(), // Generate a unique ticket number
        movieTitle: data.movies.find(m => m.id === screening.movieId).title,
        date: screening.date,
        time: screening.time,
        hall: data.halls.find(h => h.id === screening.hallId).name,
        seatNumber: seatNumber,
        price: 10.00, // Example price, you can modify this
      };
    });

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, ...newTickets];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="select-seats-container">
      <h2>Get Tickets</h2>
      <div className="selected-showtime">
        <h3>Selected Showtime:</h3>
        <p><strong>Movie:</strong> {data.movies.find(m => m.id === screening.movieId).title}</p>
        <p><strong>Date:</strong> {new Date(screening.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {screening.time}</p>
        <p><strong>Hall:</strong> {data.halls.find(h => h.id === screening.hallId).name}</p>
        <p><strong>Runtime:</strong> {data.movies.find(m => m.id === screening.movieId).duration} minutes</p>
      </div>
      <div className="seats-layout">
        <h3>Screen</h3>
        <div className="seats-grid">
          {Array.from({ length: 200 }, (_, index) => index + 1).map(seatNumber => (
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
