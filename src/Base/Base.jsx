import React from 'react';
import Header from '../Header/Header';
import Feature from '../Feature/Feature';
import styles from './Base.module.css';

const Base = () => {

  return (
    <div>
      <Header/>
      <div className={styles.mainContent}>
        <p className={styles.splashText}>Easily track and visualize your workouts.</p>
        <div className={styles.features}>
          <Feature featuretitle="Cloud Storage"
            feature1="View your workouts from any device"
            feature2="Never worry about losing your data"/>
          <Feature featuretitle="Visualizations (WIP)"
            feature1="Easily visualize your past workouts"
            feature2="Keep track of your personal bests"/>
          <Feature featuretitle="Large Exercise Library"
            feature1="Choose from a pre-made list of 100+ exercises"
            feature2="Create your own custom exercises (WIP)"/>
          <Feature featuretitle="Open-Source"
            feature1="View all of the code to this project on GitHub"
            feature2="Be sure that your data is kept private"/>
        </div>
      </div>
    </div>
  );
};

export default Base;