import React, { useState, useEffect } from "react";
import styles from "./Visualization.module.css";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function Visualization() {
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [chartData, setChartData] = useState({});
  const db = getFirestore();

  const timeframeOptions = {
    "1m": 30,
    "3m": 90,
    "1y": 365,
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const q = query(collection(db, "workouts"));
        const querySnapshot = await getDocs(q);
        const workouts = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.exercise && data.weight && data.date) {
            workouts.push({
              exercise: data.exercise,
              weight: data.weight,
              date: data.date,
            });
          }
        });

        setWorkoutData(workouts);
        if (workouts.length && !selectedExercise) {
          setSelectedExercise(workouts[0].exercise);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    const days = timeframeOptions[selectedTimeframe];

    const filtered = workoutData
      .filter((entry) => entry.exercise === selectedExercise)
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const diffTime = Math.abs(now - entryDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= days;
      });

    const grouped = {};
    filtered.forEach((entry) => {
      const monthKey = entry.date.slice(0, 7); // "YYYY-MM"
      if (!grouped[monthKey] || entry.weight > grouped[monthKey]) {
        grouped[monthKey] = entry.weight;
      }
    });

    const sortedKeys = Object.keys(grouped).sort();
    return {
      labels: sortedKeys,
      data: sortedKeys.map((k) => grouped[k]),
    };
  };

  useEffect(() => {
    if (!selectedExercise || workoutData.length === 0) return;

    const { labels, data } = getFilteredData();
    setChartData({
      labels,
      datasets: [
        {
          label: `Max Weight for ${selectedExercise}`,
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
          tension: 0.2,
        },
      ],
    });
  }, [selectedExercise, selectedTimeframe, workoutData]);

  const exercises = [...new Set(workoutData.map((w) => w.exercise))];

  return (
    <div className={styles.container}>
      <h1>Visualizations</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label>Exercise: </label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          {exercises.map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Timeframe: </label>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
        >
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      <div>
        {chartData.labels?.length ? (
          <Line data={chartData} />
        ) : (
          <p> .</p>
        )}
      </div>
    </div>
  );
}

export default Visualization;