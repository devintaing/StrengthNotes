import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Base = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateAccountClick = () => {
    navigate('/create-account');
  };

  return (
    <div>
      <h1>StrengthNotes</h1>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleCreateAccountClick}>Create Account</button>
    </div>
  );
};

export default Base;