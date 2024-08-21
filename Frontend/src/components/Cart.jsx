import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';
import data from '../../public/data.json'; // Adjust the path

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const taxRate = 0.07; // Example tax rate of 7%
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
    const subtotal = storedCartItems.reduce((acc, item) => acc + item.price, 0);
    setSubtotal(subtotal);
  }, []);

  const handleRemoveItem = (ticketId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== ticketId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    const subtotal = updatedCartItems.reduce((acc, item) => acc + item.price, 0);
    setSubtotal(subtotal);
  };

  const total = parseFloat((subtotal + subtotal * taxRate).toFixed(2));

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

  const handleSubmitOrder = () => {
    setError('');
    if (!validatePaymentDetails()) return;

    const orderId = data.orders.length ? data.orders[data.orders.length - 1].orderId + 1 : 100000000;
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const newOrder = {
      orderId,
      userId,
      items: cartItems.map(item => ({
        screeningId: item.screeningId,
        seatNumber: item.seatNumber,
        price: item.price
      })),
      totalPrice: total,
      date: new Date().toISOString().split('T')[0]
    };

    data.orders.push(newOrder);
    console.log('Order placed:', data);

    // Empty the cart after placing the order
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));

    navigate('/order-confirmation', { state: { orderId } });
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
                  <td>{item.ticketId}</td>
                  <td>{item.movieTitle}</td>
                  <td>{`${item.date} ${item.time}`}</td>
                  <td>{item.hall}</td>
                  <td>{item.seatNumber}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.id)} className="remove-button">Remove</button>
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
              <h3>Order Total: ${total.toFixed(2)}</h3>
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
