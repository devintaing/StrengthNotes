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
        setError('An account with that email already exists!');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.loginDiv}>
        <form onSubmit={isLogin ? handleLogin : handleCreateAccount} className={styles.loginForm}>
          <h2 className={styles.loginTitle}>{isLogin ? 'Login' : 'Create an Account'}</h2>
          <div className={styles.userInput}>
          {!isLogin && (
            <div>
              <label>Display Name:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          </div>
          {error && <p>{error}</p>}
          <div className={styles.buttons}>
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button onClick={toggleForm}>
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;