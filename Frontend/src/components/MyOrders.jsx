import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/MyOrders.css'; // Assuming you have styles specific to MyOrders

const MyOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/user/${userId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, [userId]);

  const handleRefundClick = async (ticketId, orderId) => {
    try {
      // First, delete the ticket
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      
      let updatedOrders = [];
      let shouldDeleteOrder = false;
  
      setOrders(prevOrders => {
        updatedOrders = prevOrders.map(order => {
          if (order.orderId === orderId) {
            const updatedTickets = order.tickets.filter(ticket => ticket.ticketId !== ticketId);
            if (updatedTickets.length === 0) {
              shouldDeleteOrder = true; // Mark for deletion
              return null; // Remove from local state
            } else {
              return { ...order, tickets: updatedTickets };
            }
          }
          return order;
        }).filter(order => order !== null);
        
        return updatedOrders; // Update the orders state
      });
  
      // Perform the deletion of the order only after state is updated
      if (shouldDeleteOrder) {
        await axios.delete(`http://localhost:5000/api/orders/refund/${orderId}`);
      }
  
    } catch (error) {
      console.error('Error refunding ticket:', error);
      alert('Failed to refund ticket. Please try again.');
    }
  };
  
  
  
  

  // Helper function to check if an order is within the last 24 hours
  const isRefundable = (orderDate) => {
    const now = new Date();
    const orderDateTime = new Date(orderDate);
    const timeDifference = now - orderDateTime; // Difference in milliseconds
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  return (
    <div className="my-orders">
      {orders.map(order => {
        const refundable = isRefundable(order.date);
        return (
          <div className="order-card" key={order.orderId}>
            <div className="order-header">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>User ID:</strong> {order.userId}</p>
              <p className="total-price"><strong>Total Price:</strong> ${order.totalPrice}</p>
            </div>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Show Date</th>
                  <th>Hall ID</th>
                  <th>Seat Number</th>
                  <th>Price</th>
                  {refundable && <th>Action</th>}
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
                      {refundable && (
                        <td>
                          <button className="refund-button" onClick={() => handleRefundClick(ticket.ticketId, order.orderId)}>
                            Refund
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={refundable ? "6" : "5"}>No tickets available for this order.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
