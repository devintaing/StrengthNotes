import React from "react";
import Header from '../Header/Header';
import styles from './History.module.css';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

const History = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [workoutCount, setWorkoutCount] = useState(0);

  useEffect(() => {
      if (auth.currentUser) {
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


  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <p>You have logged {workoutCount} workouts.</p>

        <div className={styles.workoutCard}>
          <h1>January 1, 2025</h1>
          <h2>13 minutes</h2>
        </div>
      </div>
    </div>
  );
};

export default History;