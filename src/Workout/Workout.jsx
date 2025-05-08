import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDoc, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Header from '../Header/Header';
import styles from './Workout.module.css';

const Workout = () => {
  const navigate = useNavigate();
  const [timeStarted, setTimeStarted] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    setTimeStarted(new Date().toISOString());

    const fetchExercises = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'exercises', 'built-in');
      const snapshot = await getDoc(docRef);
  
      const exercisesData = snapshot.data();
      const exercisesList = Object.keys(exercisesData)
        .sort() // ensure exercises are in alphabetical order
        .map((key) => ({
          name: key,
          category: exercisesData[key].category,
          equipment: exercisesData[key].equipment,
        }));
      setExercises(exercisesList);
    };
  
    fetchExercises();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prevTime) => prevTime + 1);
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
    if(selectedExercises.length > 0) {
      setShowCancelConfirmation(true);
    }
    else {
      redirectHome();
    }
  };

  const redirectHome = () => {
    navigate('/home');
  }

  const handleAddExercise = () => {
    setShowExerciseMenu(true);
  };

  const handleCloseMenu = () => {
    setShowExerciseMenu(false);
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercises(prev => [
      ...prev, 
      { 
        name: exercise.name, 
        sets: [{ weight: '', reps: '' }]
      }
    ]);
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

    if(updated[exerciseIndex].sets.length === 0) {
      updated.splice(exerciseIndex, 1);
    }

    setSelectedExercises(updated);
  };

  const handleCompleteWorkout = () => {
    if(selectedExercises.length > 0) {
      setShowCompleteConfirmation(true);
    }
    else {
      setShowCancelConfirmation(true);
    }
  };

  const saveWorkoutData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      const db = getFirestore();
      const workoutData = {
        exercises: selectedExercises,
        timeStarted,
        secondsElapsed,
        timeCompleted: new Date().toISOString(),
      };

      await addDoc(collection(db, 'users', user.uid, 'workouts'), workoutData);
      redirectHome();
    }
    catch (error) {
      console.error("An error occurred while trying to save the workout: ", error);
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <p>Time elapsed: {formatTime(secondsElapsed)}</p>
        {selectedExercises.map((exercise, i) => (
          <div key={i} className={styles.workout}>
            <h3>{exercise.name}<button onClick={() => handleDeleteExercise(i)}>Delete Exercise</button></h3>
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
              <div className={styles.modalHeader}>
                <h2>Select an Exercise</h2>
                <button onClick={handleCloseMenu} className={styles.closeButton}>Cancel</button>
              </div>
              <input
                type="text"
                placeholder="Search for an exercise..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchBar}
              />
              <ul>
                {filteredExercises.map((exercise) => (
                  <li key={exercise.id} onClick={() => handleSelectExercise(exercise)}>
                    {exercise.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showCancelConfirmation && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Are you sure you want to cancel this workout?</h2>
              <div className={styles.modalButtons}>
                <button onClick={redirectHome}>Cancel Workout</button>
                <button onClick={() => setShowCancelConfirmation(false)}>No, keep going.</button>
              </div>
            </div>
          </div>
        )}

        {showCompleteConfirmation && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Are you sure you want to complete this workout?</h2>
              <div className={styles.modalButtons}>
                <button onClick={saveWorkoutData}>Complete Workout</button>
                <button onClick={() => setShowCompleteConfirmation(false)}>No, keep going.</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.optionButtons}>
          <button onClick={handleAddExercise}>Add Exercise</button>
          <button onClick={handleCompleteWorkout}>Complete Workout</button>
          <button onClick={handleCancel}>Cancel Workout</button>
        </div>
      </div>
    </div>
  );
};

export default Workout;