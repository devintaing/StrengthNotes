import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Header from '../Header/Header';
import styles from './Visualization.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Visualization = () => {
  const [workouts, setWorkouts] = useState([]);
  const [timespan, setTimespan] = useState('7');
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');

  useEffect(() => {
    const fetchWorkouts = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const workoutsRef = collection(db, 'users', user.uid, 'workouts');
      const snapshot = await getDocs(workoutsRef);
      const workoutsList = snapshot.docs.map((doc) => doc.data());
      setWorkouts(workoutsList);
    };

    fetchWorkouts();
  }, []);

  const filterByTimespan = (workouts) => {
    const now = new Date();
    const cutoff = new Date();

    now.setHours(0, 0, 0, 0);
    cutoff.setHours(0, 0, 0, 0);

    if (timespan === '1') {
      cutoff.setDate(now.getDate() - 1); // 1 day ago
    } else if (timespan === '7') {
      cutoff.setDate(now.getDate() - 7); // 7 days ago
    } else if (timespan === '30') {
      cutoff.setDate(now.getDate() - 30); // 30 days ago
    } else {
      return workouts;
    }

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.timeCompleted);
      workoutDate.setHours(0, 0, 0, 0); 
      return workoutDate >= cutoff;
    });
  };

  const filteredWorkouts = filterByTimespan(workouts);

  // Build PR progression data
  const prData = {};

  filteredWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.timeCompleted).toLocaleDateString();

    if (workout.exercises) {
      workout.exercises.forEach((exercise) => {
        const { name, weight } = exercise;
        if (!prData[name]) {
          prData[name] = {};
        }

        if (timespan === '1') {
          if (!prData[name][workoutDate] || weight > prData[name][workoutDate]) {
            prData[name][workoutDate] = weight;
          }
        } else {
          if (!prData[name][workoutDate] || weight > prData[name][workoutDate]) {
            prData[name][workoutDate] = weight;
          }
        }
      });
    }
  });

  const exerciseDates = Object.keys(prData[selectedExercise] || {}).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const chartData = {
    labels: exerciseDates,
    datasets: [
      {
        label: `${selectedExercise} PR (lbs)`,
        data: exerciseDates.map((date) => prData[selectedExercise][date]),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return value % 1 === 0 ? value : ''; 
          },
          suggestedMin: Math.min(...exerciseDates.map((date) => prData[selectedExercise][date])) - 5,
          suggestedMax: Math.max(...exerciseDates.map((date) => prData[selectedExercise][date])) + 5,
        },
      },
    },
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h2>Personal Record Progression</h2>

        <div className={styles.timespanButtons}>
          <button onClick={() => setTimespan('1')}>1 Day</button>
          <button onClick={() => setTimespan('7')}>7 Days</button>
          <button onClick={() => setTimespan('30')}>30 Days</button>
          <button onClick={() => setTimespan('all')}>All</button>
        </div>

        <div className={styles.exerciseSelect}>
          <label htmlFor="exerciseSelect">Exercise:</label>
          <select
            id="exerciseSelect"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {Object.keys(prData).map((exerciseName) => (
              <option key={exerciseName} value={exerciseName}>
                {exerciseName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.chartContainer}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
