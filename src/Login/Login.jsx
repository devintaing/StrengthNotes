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
      navigate('/home'); // Redirect to home after login
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
      navigate('/home'); // Redirect to home after account creation
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Error - An account with that email already exists. Try signing in.');
      } else if (err.code === 'auth/admin-restricted-operation') {
        setError('Error - Account creation is temporarily disabled. Please try again later.');
      } else {
        setError(err.message);
      }
    }
  };

  const renderLoginForm = () => (
    <>
      <form onSubmit={handleLogin} className={styles.authForm}>
        <h2 className={styles.authTitle}>Sign in</h2>
        <h3 className={styles.authSubtitle}>Log new workouts and view previous ones.</h3>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputs}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit">Sign in</button>
          <button onClick={toggleForm}>Don't have an account?</button>
        </div>
      </form>
    </>
  )

  const renderCreateAccountForm = () => (
    <>
      <form onSubmit={handleCreateAccount} className={styles.authForm}>
      <h2 className={styles.authTitle}>Create Account</h2>
      <h3 className={styles.authSubtitle}>Start logging and visualizing your workouts.</h3>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputs}>
          <input
            type="text"
            value={displayName}
            placeholder="Display Name"
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit">Create Account</button>
          <button onClick={toggleForm}>Already have an account?</button>
        </div>
      </form>
    </>
  )

  return (
    <div>
      <Header />
      <div className={styles.authDiv}>
        {isLogin ? renderLoginForm() : renderCreateAccountForm()}
      </div>
    </div>
  );
};

export default Login;