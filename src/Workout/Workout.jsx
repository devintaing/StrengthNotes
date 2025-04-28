import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import styles from './Workout.module.css';

const Workout = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const handleCancel = () => {
    // TODO: implement ability to cancel a workout
  };

  const handleAddExercise = () => {
    setShowExerciseMenu(true);
  };

  const handleCloseMenu = () => {
    setShowExerciseMenu(false);
  };

  const handleSelectExercise = () => {
    // TODO: implement functionality after choosing an exercise
  }


  // TODO: pull exercises from Firebase instead of hard coding?
  const exercises = ["Squat (Barbell)", "Deadlift (Barbell)", "Bench Press (Barbell)"];


  return (
    <div>
      <Header />
      <p>Time elapsed: {formatTime(timeElapsed)}</p>
      <button onClick={handleAddExercise}>Add exercise</button>
      <button onClick={handleCancel}>Cancel workout</button>

      {showExerciseMenu && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Select an Exercise</h2>
            <ul>
              {exercises.map((exercise, index) => (
                <li key={index} onClick={() => handleSelectExercise(exercise)}>
                  {exercise}
                </li>
              ))}
            </ul>
            <button onClick={handleCloseMenu}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;