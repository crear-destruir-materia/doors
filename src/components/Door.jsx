import React from 'react';
import styles from './Door.module.css';

const Door = ({ direction, onClick, isDisabled, isFinal }) => {
  const getDoorLabel = () => {
    if (isFinal) return "F";
    
    switch (direction) {
      case 'north': return 'N';
      case 'east': return 'E';
      case 'south': return 'S';
      case 'west': return 'W';
      default: return '?';
    }
  };

  const getAriaLabel = () => {
    if (isFinal) return "Puerta final";
    
    return `Puerta hacia ${direction === 'north' ? 'el norte' : 
                          direction === 'east' ? 'el este' : 
                          direction === 'south' ? 'el sur' : 'el oeste'}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  const directionClass = `${direction}Door`;

  return (
    <div 
      className={`${styles.doorContainer} ${isDisabled ? styles.disabled : ''} ${styles[directionClass]} ${isFinal ? styles.finalDoor : ''}`}
      onClick={isDisabled ? null : onClick}
      onKeyDown={isDisabled ? null : handleKeyDown}
      tabIndex={isDisabled ? -1 : 0}
      aria-label={getAriaLabel()}
      role="button"
      aria-disabled={isDisabled}
    >
      <div className={styles.door}>
        <div className={styles.doorFront}>
          <div className={styles.doorNumber}>{getDoorLabel()}</div>
          <div className={styles.doorKnob}></div>
        </div>
      </div>
      <div className={styles.doorGlow}></div>
    </div>
  );
};

export default Door;