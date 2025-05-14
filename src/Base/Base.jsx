import React from 'react';
import Header from '../Header/Header';
import Feature from '../Feature/Feature';
import styles from './Base.module.css';
import { useNavigate } from 'react-router-dom';

const Base = () => {
  const navigate = useNavigate();

  const handleRoute = (route) => {
    navigate(route);
  }

  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={`${styles.splashContainer} ${styles.fadeIn}`}>
            <p className={styles.splashText}>Easily track and visualize your workouts.</p>
            <button className={styles.heroButton} onClick={() => handleRoute('/login')}>Get Started</button>
          </div>
          <div className={`${styles.features} ${styles.fadeIn}`}>
            <Feature featuretitle="Free Cloud Storage"
              feature1="Access your workout history anytime."
              feature2="Your data is securely stored in the cloud." />
            <Feature featuretitle="Visualizations"
              feature1="Gain insights with workout visualizations."
              feature2="Monitor and celebrate your personal records." />
            <Feature featuretitle="Large Exercise Library"
              feature1="Choose from a library of 100+ exercises."
              feature2="Create your own custom exercises (coming soon)." />
            <Feature featuretitle="Open-Source"
              feature1="Explore this project's source code on GitHub."
              feature2="Be sure that only necessary data is collected." />
            <Feature featuretitle="Cross-Platform"
              feature1="Use StrengthNotes seamlessly on any device."
              feature2="Stay connected, whether on mobile, tablet, or desktop." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base;