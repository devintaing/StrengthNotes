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
  const [selectedExercise, setSelectedExercise] = useState('');

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
      cutoff.setDate(now.getDate());
    } else if (timespan === '7') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timespan === '30') {
      cutoff.setDate(now.getDate() - 30);
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

  // Aggregate PR data
  const prData = {};

  filteredWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.timeCompleted);
    workoutDate.setHours(0, 0, 0, 0);
    const dateKey = workoutDate.toLocaleDateString();

    if (workout.exercises) {
      workout.exercises.forEach((exercise) => {
        const { name, weight } = exercise;
        if (!prData[name]) prData[name] = {};

        if (timespan === '1') {
          if (!prData[name][dateKey]) prData[name][dateKey] = [];
          prData[name][dateKey].push(weight);
        } else {
          if (!prData[name][dateKey] || weight > prData[name][dateKey]) {
            prData[name][dateKey] = weight;
          }
        }
      });
    }
  });

  const exerciseOptions = Object.keys(prData);

  useEffect(() => {
    if (exerciseOptions.length > 0 && !exerciseOptions.includes(selectedExercise)) {
      setSelectedExercise(exerciseOptions[0]);
    }
  }, [exerciseOptions, selectedExercise]);

  let chartLabels = [];
  let chartValues = [];

  if (selectedExercise && prData[selectedExercise]) {
    const exerciseDates = Object.keys(prData[selectedExercise]).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    exerciseDates.forEach((date) => {
      const entry = prData[selectedExercise][date];
      if (Array.isArray(entry)) {
        entry.forEach((val) => {
          chartLabels.push(date);
          chartValues.push(val);
        });
      } else {
        chartLabels.push(date);
        chartValues.push(entry);
      }
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: `${selectedExercise} PR (lbs)`,
        data: chartValues,
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
        min: chartValues.length ? Math.max(Math.min(...chartValues) - 5, 0) : 0,
        max: chartValues.length ? Math.max(...chartValues) + 5 : 10,
        ticks: {
          callback: function (value) {
            return value % 1 === 0 ? `${value} lbs` : '';
          },
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
            {exerciseOptions.map((exerciseName) => (
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