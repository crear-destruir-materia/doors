import React from 'react';
import styles from './Arrow.module.css';

const Arrow = ({ direction, onClick, isDisabled }) => {
  const getArrowSymbol = () => {
    switch (direction) {
      case 'north': return '↑';
      case 'east': return '→';
      case 'south': return '↓';
      case 'west': return '←';
      default: return '•';
    }
  };

  const getAriaLabel = () => {
    return `Ir hacia ${direction === 'north' ? 'el norte' : 
                        direction === 'east' ? 'el este' : 
                        direction === 'south' ? 'el sur' : 'el oeste'}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  return (
    <div 
      className={`${styles.directionArrow} ${isDisabled ? styles.disabled : ''}`}
      onClick={isDisabled ? null : onClick}
      onKeyDown={isDisabled ? null : handleKeyDown}
      tabIndex={isDisabled ? -1 : 0}
      aria-label={getAriaLabel()}
      role="button"
      aria-disabled={isDisabled}
    >
      {getArrowSymbol()}
    </div>
  );
};

export default Arrow;