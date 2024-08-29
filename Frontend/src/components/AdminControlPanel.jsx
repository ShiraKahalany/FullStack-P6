import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminControlPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faClock, faDoorOpen, faUsers, faTags, faChartBar } from '@fortawesome/free-solid-svg-icons';

const AdminControlPanel = () => {
    const navigate = useNavigate();
  return (
    <div className="admin-control-panel">
      <h2>Administrator Control Panel</h2>
      <div className="admin-actions">
        <div className="admin-action" onClick={() => navigate('/admin/movies')}>
          <FontAwesomeIcon icon={faFilm} className="admin-icon purple" />
          <p>Manage Movies</p>
        </div>
        <div className="admin-action" onClick={() => navigate('/admin/showtimes')}>
          <FontAwesomeIcon icon={faClock} className="admin-icon purple" />
          <p>Manage Show Times</p>
        </div>
        <div className="admin-action" onClick={() => navigate('/admin/halls')}>
          <FontAwesomeIcon icon={faDoorOpen} className="admin-icon blue" />
          <p>Manage Halls</p>
        </div>
        <div className="admin-action" onClick={() => navigate('/admin/users')}>
          <FontAwesomeIcon icon={faUsers} className="admin-icon teal" />
          <p>Manage Users</p>
        </div>
        <div className="admin-action">
          <FontAwesomeIcon icon={faChartBar} className="admin-icon green" />
          <p>Manage Orders</p>
        </div>
        <div className="admin-action">
          <FontAwesomeIcon icon={faTags} className="admin-icon green" />
          <p>Manage Promotions</p>
        </div>
      </div>
    </div>
  );
};

export default AdminControlPanel;
