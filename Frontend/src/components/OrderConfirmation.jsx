import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId } = location.state;

  return (
    <div className="order-confirmation-container">
      <h2>Order Confirmation</h2>
      <div className="confirmation-message">
        <h3>Order Placed Successfully</h3>
        <p>Thank you for ordering.</p>
        <p>Please check your email for your order receipt. Your order number is:</p>
        <p className="order-id">{orderId}</p>
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
