import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to main after logout
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div>
      <h1>Welcome to StrengthNotes</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;