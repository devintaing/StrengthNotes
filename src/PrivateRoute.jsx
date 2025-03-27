import React from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return children;
  } else {
    return <Navigate to="/" />; // if user is not authenticated, return to main
  }
};

export default PrivateRoute;