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

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div>
      <Header />
      <h1 className={styles.welcomeMessage}>Welcome, {displayName}!</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => handleCardClick('/workout')}>
          Start Workout
        </div>
        <div className={styles.card} onClick={() => handleCardClick('/past-workouts')}>
          View Past Workouts
        </div>
        <div className={styles.card} onClick={() => handleCardClick('/visualizations')}>
          View Visualizations
        </div>
      </div>
    </div>
  );
};

export default Home;
