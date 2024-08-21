import React from 'react';
import { Outlet } from 'react-router-dom';
import '../css/Home.css';
import NavBar from './Navbar';

const Home = () => {
  return (
    <div>
      <NavBar />
      <main className="home-main">
        <div className="welcome-container">
          <h1>Welcome to Pleasure Cinema</h1>
          <p>Experience the best movies in the most luxurious environment.</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
