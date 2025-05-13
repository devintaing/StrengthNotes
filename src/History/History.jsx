import React from "react";
import Header from '../Header/Header';
import styles from './History.module.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";

const History = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [workoutCount, setWorkoutCount] = useState(0);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchWorkoutCount(auth.currentUser.uid);
      fetchWorkouts(auth.currentUser.uid);
    }
  }, [auth]);

  const fetchWorkoutCount = async (userId) => {
    try {
      const workoutDocs = await getDocs(collection(db, 'users', userId, 'workouts'));
      setWorkoutCount(workoutDocs.size);
    } catch (error) {
      console.error('Error fetching workout count:', error);
    }
  };

  const fetchWorkouts = async (userId) => {
    try {
      const workoutsQuery = query(
      collection(db, 'users', userId, 'workouts'),
      orderBy('timeStarted', 'desc') // order by timeStarted in descending order
      );
      const workoutDocs = await getDocs(workoutsQuery);
      const workoutsData = workoutDocs.docs.map(doc => {
        const data = doc.data();
        const timeStarted = new Date(data.timeStarted).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const timeCompleted = new Date(data.timeCompleted).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return {
          id: doc.id,
          timeStarted,
          timeCompleted,
          duration: Math.round(data.secondsElapsed / 60),
          exercises: data.exercises || []
        };
      });
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.workoutInfo}>
          <p className={styles.pageTitle}>Workout History</p>
          <p className={styles.workoutCount}>
            You have logged {workoutCount} workout{workoutCount === 1 ? '' : 's'}.
          </p>
        </div>

        {workouts.map(workout => (
          <div className={styles.workout}>
            <h3 className={styles.workoutTitle}>{workout.timeStarted}</h3>
            <p className={styles.info}>Duration: {workout.duration} minutes</p>
            <div className={styles.exerciseSection}>
              <ul>
                {workout.exercises.map((exercise, index) => (
                  <li className={styles.exerciseItem}>
                    <h4 className={styles.exerciseName}>{index + 1}. {exercise.name}</h4>
                    <ul>
                      {exercise.sets.map((set, setIndex) => (
                        <li className={styles.setItem}>
                          Set {setIndex + 1}: {set.weight || '0'} lbs x {set.reps || '0'} reps
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;