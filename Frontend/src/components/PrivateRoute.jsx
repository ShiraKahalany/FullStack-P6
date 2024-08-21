// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';


const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : "You have to logIn first";
};

export default PrivateRoute;
