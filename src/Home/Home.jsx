import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const isLoggedIn = () => {
    if(auth.currentUser === null) {
      return false;
    }
    else {
      return true;
    }
  };

  return (
    <div>
      <Header/>
      <h1>Welcome to StrengthNotes</h1>
    </div>
  );
};

export default Home;