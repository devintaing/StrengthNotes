import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div>
      <div className={styles.entireHeader}>
        <Link to="/" className={`${styles.leftLinks} ${styles.link}`}>
          <img src="../public/logo.png" alt="Logo"></img>
          <span className={styles.strengthNotes}>StrengthNotes</span>
        </Link>
        <div className={styles.rightLinks}>
          <Link to="/login" className={`${styles.otherLinks} ${styles.link}`}>Login/Signup</Link>
          <Link to="/about" className={`${styles.otherLinks} ${styles.link}`}>About</Link>
        </div>
      </div>
    </div>
  )
}

export default Header;