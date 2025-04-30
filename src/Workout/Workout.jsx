import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import styles from './Workout.module.css';

const Workout = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);

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
    setSelectedExercises([]);
    setShowExerciseMenu(false);
    setTimeElapsed(0);
  };

  const handleAddExercise = () => {
    setShowExerciseMenu(true);
  };

  const handleCloseMenu = () => {
    setShowExerciseMenu(false);
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercises(prev => [...prev, { name: exercise, sets: [] }]);
    setShowExerciseMenu(false);
  };

  const handleAddSet = (exerciseIndex) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets.push({ weight: '', reps: '' });
    setSelectedExercises(updated);
  };

  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setSelectedExercises(updated);
  };

  const handleDeleteExercise = (index) => {
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };

  const handleDeleteSet = (exerciseIndex, setIndex) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    setSelectedExercises(updated);
  };

  const exercisesByBodyPart = {
    Legs: [
      "Squat (Barbell)",
      "Front Squat (Barbell)",
      "Leg Press (Machine)",
      "Leg Curl (Machine)",
      "Leg Extension (Machine)",
      "Lunge (Dumbbell)",
      "Romanian Deadlift (Barbell)"
    ],
    Back: [
      "Deadlift (Barbell)",
      "Bent Over Row (Barbell)",
      "Seated Row (Cable)",
      "Lat Pulldown (Cable)",
      "Single-Arm Row (Dumbbell)"
    ],
    Chest: [
      "Bench Press (Barbell)",
      "Incline Bench Press (Barbell)",
      "Decline Bench Press (Barbell)",
      "Chest Fly (Dumbbell)",
      "Cable Crossover (Cable)",
    ],
    Shoulders: [
      "Overhead Press (Barbell)",
      "Lateral Raise (Dumbbell)",
      "Front Raise (Dumbbell)",
      "Arnold Press (Dumbbell)",
      "Face Pull (Cable)"
    ],
    Arms: [
      "Barbell Curl",
      "Dumbbell Curl",
      "Hammer Curl",
      "Triceps Pushdown (Cable)",
      "Overhead Triceps Extension (Dumbbell)",
      "Preacher Curl (Machine)"
    ],
  };

  return (
    <div>
      <Header />
      <p>Time elapsed: {formatTime(timeElapsed)}</p>
      <button onClick={handleAddExercise}>Add exercise</button>
      <button onClick={handleCancel}>Cancel workout</button>

      {selectedExercises.map((exercise, i) => (
        <div key={i} className={styles.workout}>
          <h3>{exercise.name} <button onClick={() => handleDeleteExercise(i)}>Delete Exercise</button></h3>
          {exercise.sets.map((set, j) => (
            <div key={j} className={styles.set}>
              <label>Set {j + 1}</label>
              <input
                type="number"
                placeholder="Weight (lbs)"
                value={set.weight}
                onChange={(e) => handleUpdateSet(i, j, 'weight', e.target.value)}
              />
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => handleUpdateSet(i, j, 'reps', e.target.value)}
              />
              <button onClick={() => handleDeleteSet(i, j)}>Delete Set</button>
            </div>
          ))}
          <button onClick={() => handleAddSet(i)}>Add Set</button>
        </div>
      ))}

      {showExerciseMenu && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Select an Exercise</h2>
            {Object.entries(exercisesByBodyPart).map(([bodyPart, exercises]) => (
              <div key={bodyPart}>
                <h3>{bodyPart}</h3>
                <ul>
                  {exercises.map((exercise, index) => (
                    <li key={index} onClick={() => handleSelectExercise(exercise)}>
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={handleCloseMenu}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;