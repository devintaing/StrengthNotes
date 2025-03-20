import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './firebaseConfig'; // Import Firebase configuration
import Login from './Login/Login';
import CreateAccount from './CreateAccount/CreateAccount';
import Home from './Home/Home';
import Base from './Base/Base';
import PrivateRoute from './PrivateRoute';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Base />} />
      </Routes>
    </Router>
  </StrictMode>,
);