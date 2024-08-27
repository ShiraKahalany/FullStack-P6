import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const taxRate = 0.07;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          alert("Please log in to view your cart.");
          return;
        }

        // const response = await axios.get('http://localhost:5000/api/tickets');
        // const allTickets = response.data;

        // const userTickets = allTickets.filter(ticket => ticket.userId === user.id && !ticket.isPaid);

        const response = await axios.get('http://localhost:5000/api/tickets/user' , { params: { userId: user.id, isPaid: 0 } });
        console.log('User tickets:', response.data); // Debugging
        const userTickets = response.data;
        
        const ticketsWithDetails = await Promise.all(userTickets.map(async (ticket) => {
          const screeningResponse = await axios.get(`http://localhost:5000/api/screenings/${ticket.screeningId}`);
          const screening = screeningResponse.data;

          const movieResponse = await axios.get(`http://localhost:5000/api/movies/${screening.movieId}`);
          const movie = movieResponse.data;

          const hallResponse = await axios.get(`http://localhost:5000/api/halls/${screening.hallId}`);
          const hall = hallResponse.data;

          return {
            ...ticket,
            movieTitle: movie.title,
            date: new Date(screening.date).toLocaleDateString('en-US'),
            time: screening.time.slice(0, 5),  // Only the first 5 characters 'HH:MM'
            hall: hall.name
          };
        }));

        if (ticketsWithDetails.length > 0) {
          setCartItems(ticketsWithDetails);
          const subtotal = ticketsWithDetails.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
          setSubtotal(subtotal);
        } else {
          setCartItems([]);
          setSubtotal(0);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      const updatedCartItems = cartItems.filter(item => item.id !== ticketId);
      setCartItems(updatedCartItems);
      const subtotal = updatedCartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
      setSubtotal(subtotal);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalRaw = subtotal + subtotal * taxRate;
  const total = parseFloat(totalRaw).toFixed(2);

  const validatePaymentDetails = () => {
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      setError('Card number must be 16 digits.');
      return false;
    }
    const cardNameRegex = /^[A-Za-z\s]+$/;
    if (!cardNameRegex.test(cardName)) {
      setError('Name on card should contain only letters and spaces.');
      return false;
    }
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
      setError('Expiration date must be in MM/YY format.');
      return false;
    }
    const [month, year] = expiryDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError('Expiration date must be in the future.');
      return false;
    }
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      setError('CVV must be 3 digits.');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    setError('');
    if (!validatePaymentDetails()) return;

    try {
        const user = JSON.parse(localStorage.getItem('user'));

        // Create a string with the IDs of all tickets in the cart
        const ticketIds = cartItems.map(item => item.id);

        // Calculate the total price without the tax
        const totalPriceWithoutTax = subtotal;

        // Format today's date as 'YYYY-MM-DD'
        const today = new Date().toISOString().split('T')[0];

        // Create the new order object
        const newOrder = {
            orderId: null,  // The backend will assign this ID
            userId: user.id,
            items: JSON.stringify(ticketIds),  // Store ticket IDs as a JSON stringified array
            totalPrice: totalPriceWithoutTax,
            date: today
        };
        console.log('New order:', newOrder);

        // Send a request to create a new order
        const response = await axios.post('http://localhost:5000/api/orders', newOrder);

        // Update each ticket to set isPaid to true and update bookedSeats for each screening
        await Promise.all(cartItems.map(async item => {
            // Mark the ticket as paid
            await axios.put(`http://localhost:5000/api/tickets/${item.id}`, { ...item, isPaid: true });

            // Fetch the current bookedSeats for the screening
            const screeningResponse = await axios.get(`http://localhost:5000/api/screenings/${item.screeningId}`);
            const screening = screeningResponse.data;
            
            // Ensure bookedSeats is valid JSON before parsing
            let bookedSeats = [];
            if (screening.bookedSeats && screening.bookedSeats.trim() !== '') {
                bookedSeats = JSON.parse(screening.bookedSeats);
            }

            // Add the current seatNumber to the bookedSeats array
            bookedSeats.push(item.seatNumber);
        }));

        // Empty the cart after placing the order
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));

        // Redirect to the order confirmation page with the orderId
        navigate('/order-confirmation', { state: { orderId: response.data.orderId } });
    } catch (error) {
        console.error('Error submitting order:', error);
        setError('Failed to submit order. Please try again.');
    }
};



  


  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <h3>Oops! Your cart is empty.</h3>
          <p>Go find your next movie to enjoy!</p>
        </div>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Ticket#</th>
                <th>Movie</th>
                <th>Date/Time</th>
                <th>Hall</th>
                <th>Seat#</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.movieTitle}</td>
                  <td>{`${item.date} ${item.time}`}</td>
                  <td>{item.hall}</td>
                  <td>{item.seatNumber}</td>
                  <td>${(Number(item.price) || 0).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.id)} className="remove-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <div className="promotion">
              <input type="text" placeholder="Input Promotional Code" />
              <button>Apply Promotion</button>
            </div>
            <div className="totals">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Tax (${(taxRate * 100).toFixed(2)}%): ${((subtotal * taxRate).toFixed(2))}</p>
              <h3>Order Total: ${total}</h3>
            </div>
          </div>
          <div className="payment-info">
            <h3>Credit Card Info</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="credit-card-form">
              <label>
                <input 
                  type="text" 
                  placeholder="Name on Card" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value)} 
                />
              </label>
              <label>
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value)} 
                />
              </label>
              <label>
                <input 
                  type="text" 
                  placeholder="Expiration Date (MM/YY)" 
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)} 
                />
              </label>
              <label>
                <input 
                  type="text" 
                  placeholder="CVV" 
                  value={cvv} 
                  onChange={(e) => setCvv(e.target.value)} 
                />
              </label>
            </div>
            <button className="submit-order-button" onClick={handleSubmitOrder}>Submit Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
