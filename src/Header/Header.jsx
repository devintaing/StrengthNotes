import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import styles from './Header.module.css';
import logo from '../assets/logo.svg';

/**
 * TODO: fix weird bug where if the user is logged in and
 * manually navigates to "/" it shows login/signup and then
 * fixes itself when the user clicks on logo.
 */

const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const isLoggedIn = () => {
    if(auth.currentUser === null) {
      return false;
    }
    else {
      return true;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to main after logout
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const renderLoggedInLinks = () => (
    <>
      <div className={styles.entireHeader}>
        <Link to="/home" className={`${styles.leftLinks} ${styles.link}`}>
          <img src={logo} alt="Logo"></img>
          <span className={styles.strengthNotes}>StrengthNotes</span>
        </Link>
        <div className={styles.rightLinks}>
          <button onClick={handleLogout} className={`${styles.otherLinks} ${styles.link}`} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
    </>
  );

  const renderLoggedOutLinks = () => (
    <>
      <div className={styles.entireHeader}>
        <Link to="/" className={`${styles.leftLinks} ${styles.link}`}>
          <img src={logo} alt="Logo"></img>
          <span className={styles.strengthNotes}>StrengthNotes</span>
        </Link>
        <div className={styles.rightLinks}>
          <Link to="/login" className={`${styles.otherLinks} ${styles.link}`}>Login/Signup</Link>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {isLoggedIn() ? renderLoggedInLinks() : renderLoggedOutLinks()}
    </div>
  );
};

export default Header;