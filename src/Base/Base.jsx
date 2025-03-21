import React from 'react';
import Header from '../Header/Header';
import styles from './Base.module.css';

const Base = () => {

  return (
    <div>
      <Header/>
      <div className={styles.mainContent}>
        <p className={styles.splashText}>Easily track and visualize your workouts.</p>
      </div>
    </div>
  );
};

export default Base;