import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; 
import styles from './Header.module.css';
import logo from '../assets/logo.svg';

const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();
 // fix for weird bug starts here: essentially waits for firebase to load current user instead of presenting null
  const [loggedIn, setLoggedIn] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe(); 
  }, [auth]); 
  // fix for bug ends here

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
          <img src={logo} alt="Logo" />
          <span className={styles.strengthNotes}>StrengthNotes</span>
        </Link>
        <div className={styles.rightLinks}>
          <button
            onClick={handleLogout}
            className={`${styles.otherLinks} ${styles.link}`}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );

  const renderLoggedOutLinks = () => (
    <>
      <div className={styles.entireHeader}>
        <Link to="/" className={`${styles.leftLinks} ${styles.link}`}>
          <img src={logo} alt="Logo" />
          <span className={styles.strengthNotes}>StrengthNotes</span>
        </Link>
        <div className={styles.rightLinks}>
          <Link to="/login" className={`${styles.otherLinks} ${styles.link}`}>
            Login/Signup
          </Link>
        </div>
      </div>
    </>
  );

  return <div>{loggedIn ? renderLoggedInLinks() : renderLoggedOutLinks()}</div>; // CHANGE: now use 'loggedIn' instead of isLoggedIn()
};

export default Header;