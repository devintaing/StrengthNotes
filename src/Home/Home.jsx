import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Header from '../Header/Header';
import styles from './Home.module.css';

const Home = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [workoutCount, setWorkoutCount] = useState(0);

  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || 'User');
      fetchWorkoutCount(auth.currentUser.uid);
    }
  }, [auth]);

  const fetchWorkoutCount = async (userId) => {
    try {
      const workoutDocs = await getDocs(collection(db, 'users', userId, 'workouts')); // get all documents under users/userId/workouts
      setWorkoutCount(workoutDocs.size);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div>
      <Header />
      <h1 className={styles.welcomeMessage}>Welcome {workoutCount === 0 ? 'to StrengthNotes' : 'back'}, {displayName}!</h1>
      <p className={styles.workoutCount}>
        You have logged {workoutCount} workout{workoutCount === 1 ? '' : 's'} so far{workoutCount > 0 ? ', keep it up!' : '.'}
      </p>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => handleCardClick('/workout')}>
          Start Workout
        </div>
        <div className={styles.card} onClick={() => handleCardClick('/history')}>
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