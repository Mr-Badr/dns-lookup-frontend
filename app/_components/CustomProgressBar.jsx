import React from 'react';
import styles from './CustomProgressBar.module.css'; // Import the CSS Module

const CustomProgressBar = ({ percent }) => {
  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar}
        style={{ width: `${percent}%` }} // Set the width based on progress
      />
      <div className={styles.progressText}>{percent}%</div> {/* Move progress text here */}
    </div>
  );
};

export default CustomProgressBar;
