import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Header/>
      <h1>Welcome!</h1>
      <Link to="/workout">Start a workout</Link>
    </div>
  );
};

export default Home;