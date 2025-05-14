import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './firebaseConfig'; // Import Firebase configuration
import Login from './Login/Login';
import Home from './Home/Home';
import Base from './Base/Base';
import PrivateRoute from './PrivateRoute';
import Workout from './Workout/Workout';
import History from './History/History';
import Visualizations from './Visualization/Visualization';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/visualizations" element={<PrivateRoute><Visualizations /></PrivateRoute>} />
        <Route path="/" element={<Base />} />
      </Routes>
    </Router>
  </StrictMode>,
);