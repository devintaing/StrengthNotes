import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      navigate('/home');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with that email already exists. Try signing in.');
      } else if (err.code === 'auth/admin-restricted-operation') {
        setError('Account creation is temporarily disabled. Please try again later.');
      } else {
        setError(err.message);
      }
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className={styles.authForm}>
      <h2 className={styles.authTitle}>Sign In</h2>
      <p className={styles.authSubtitle}>Log new workouts and view previous ones.</p>
      {error && <p className={styles.error}>{error}</p>}
      <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className={styles.primaryButton}>Sign In</button>
      <button className={styles.toggleButton} onClick={toggleForm}>Don't have an account? Create one</button>
    </form>
  );

  const renderCreateAccountForm = () => (
    <form onSubmit={handleCreateAccount} className={styles.authForm}>
      <h2 className={styles.authTitle}>Create Account</h2>
      <p className={styles.authSubtitle}>Start logging and visualizing your workouts.</p>
      {error && <p className={styles.error}>{error}</p>}
      <input type="text" value={displayName} placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} required />
      <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className={styles.primaryButton}>Create Account</button>
      <button className={styles.toggleButton} onClick={toggleForm}>Already have an account? Sign in</button>
    </form>
  );

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.formCard}>
        {isLogin ? renderLoginForm() : renderCreateAccountForm()}
      </div>
    </div>
  );
};

export default Login;