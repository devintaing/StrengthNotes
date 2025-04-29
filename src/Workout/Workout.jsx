import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import styles from './Workout.module.css';
import { FaDumbbell } from 'react-icons/fa';

const Workout = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');

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
    setWorkoutExercises([]);
    setTimeElapsed(0);
    setShowExerciseMenu(false);
    setSelectedExercise('');
  };

  const handleAddExercise = () => {
    setShowExerciseMenu(true);
  };

  const handleCloseMenu = () => {
    setShowExerciseMenu(false);
    setSelectedExercise('');
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleConfirmExercise = () => {
    if (selectedExercise) {
      setWorkoutExercises((prevExercises) => [...prevExercises, selectedExercise]);
      setSelectedExercise('');
      setShowExerciseMenu(false);
    }
  };

  const exercises = ["Squat (Barbell)", "Deadlift (Barbell)", "Bench Press (Barbell)"];

  return (
    <div>
      <Header />
      <p>Time elapsed: {formatTime(timeElapsed)}</p>
      <button onClick={handleAddExercise}>Add exercise</button>
      <button onClick={handleCancel}>Cancel workout</button>

      {workoutExercises.length > 0 && (
        <ul>
          {workoutExercises.map((exercise, index) => (
            <li key={index}>
              <FaDumbbell style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {exercise}
            </li>
          ))}
        </ul>
      )}

      {showExerciseMenu && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Select an Exercise</h2>
            <ul className={styles.exerciseList}>
              {exercises.map((exercise, index) => (
                <li
                  key={index}
                  className={selectedExercise === exercise ? styles.selectedExercise : ''}
                  onClick={() => handleSelectExercise(exercise)}
                  style={{ cursor: 'pointer', margin: '8px 0' }}
                >
                  <FaDumbbell style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  {exercise}
                </li>
              ))}
            </ul>

            {selectedExercise && (
              <button onClick={handleConfirmExercise}>Confirm "{selectedExercise}"</button>
            )}
            <button onClick={handleCloseMenu}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;