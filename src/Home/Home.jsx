import React, { useState, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; 
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Home.module.css';

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || 'User');
      } else {
        navigate('/login'); 
      }
    });

    return () => unsubscribe(); 
  }, [auth, navigate]);

// signing out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <Header />
      <h1>Welcome, {displayName}!</h1>
      <div className={styles.buttonContainer}>
        <Link to="/workout" className={styles.startWorkout}>Start a New Workout</Link>
        <Link to="/workouts" className={styles.viewWorkouts}>View Saved Workouts</Link>
        <button onClick={handleSignOut} className={styles.signOut}>Sign Out</button> 
      </div>
    </div>
  );
};

export default Home;