import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../components/AuthContext';
import data from '../../public/data.json'; // Adjust the path
import '../css/Info.css';

const Info = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      const parsedUser = JSON.parse(localStorageUser);
      setUserInfo(parsedUser);

      // Fetch the user's orders from data.json based on userId
      const userOrders = data.orders.filter(order => order.userId === parsedUser.id);
      setOrders(userOrders);
    }
  }, [user]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="info-page">
      <div className="info-container">
        <h2>{userInfo.username}'s Information</h2>
        <div className="info-section">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Role:</strong> {userInfo.isAdmin ? 'Admin' : 'User'}</p>
        </div>

        {orders.length > 0 ? (
          <div className="order-history">
            <h3>Order History</h3>
            {orders.map(order => (
              <div key={order.orderId} className="order-container">
                <h4>Booking ID <a href={`#`}>{order.orderId}</a></h4>
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Show ID</th>
                      <th>Show Date</th>
                      <th>Hall ID</th>
                      <th>Seat Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ticketId}</td>
                        <td>{item.screeningId}</td>
                        <td>{new Date(item.date).toLocaleString()}</td>
                        <td>{data.screenings.find(s => s.id === item.screeningId).hallId}</td>
                        <td>{item.seatNumber}</td>
                        <td>{item.ticketType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <p>Total: <strong>${order.totalPrice.toFixed(2)}</strong></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <h3>No previous orders found.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
