import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Home.module.css';

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || 'User');
    }
  }, [auth]);

  return (
    <div>
      <Header />
      <h1>Welcome, {displayName}!</h1>
      <Link to="/workout" className={styles.startWorkout}>Start a New Workout</Link>
    </div>
  );
};

export default Home;