import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:5000/api/orders/tickets')
      .then(response => {
        console.log('Response Data:', response.data);

        // Group tickets by orderId
        const groupedOrders = response.data.reduce((acc, ticket) => {
          const orderId = ticket.orderId;
          if (!acc[orderId]) {
            acc[orderId] = {
              orderId: ticket.orderId,
              userId: ticket.userId,
              totalPrice: ticket.totalPrice,
              date: ticket.date,
              tickets: []
            };
          }
          acc[orderId].tickets.push(ticket);
          return acc;
        }, {});

        // Convert the grouped object back into an array
        setOrders(Object.values(groupedOrders));
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  return (
    <div className="manage-orders-container">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map(order => {
          // Calculate the sum of ticket prices
          const totalTicketPrice = order.tickets.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0);
          // Calculate the number of refunds
          const refundCount = (order.totalPrice - totalTicketPrice) / (order.tickets[0]?.price || 1);

          return (
            <div className="order-card" key={order.orderId}>
              <div className="order-header">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p className="total-price">
                  <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                  {refundCount > 0 && (
                    <span className="refund-info"> ({refundCount} refund{refundCount > 1 ? 's' : ''})</span>
                  )}
                </p>
              </div>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Show Date</th>
                    <th>Hall ID</th>
                    <th>Seat Number</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.tickets && order.tickets.length > 0 ? (
                    order.tickets.map(ticket => (
                      <tr key={ticket.ticketId}>
                        <td>{ticket.ticketId}</td>
                        <td>{new Date(ticket.screeningDate).toLocaleDateString()} {ticket.screeningTime.slice(0, 5)}</td>
                        <td>{ticket.hallId}</td>
                        <td>{ticket.seatNumber}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No tickets available for this order.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManageOrders;
