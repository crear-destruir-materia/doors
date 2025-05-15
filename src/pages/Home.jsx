import React, { useState, useEffect } from 'react';
import Room from '../components/Room';
import { getSavedProgress } from '../data/labyrinth';
import styles from './Home.module.css';

const Home = () => {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Cargar el progreso guardado o iniciar uno nuevo
    const savedProgress = getSavedProgress();
    setProgress(savedProgress);
    setIsLoading(false);
  }, []);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar tu progreso? Perderás todas las habitaciones desbloqueadas y números descubiertos.')) {
      const newProgress = { 
        currentRoom: 'start', 
        unlockedRooms: ['start'],
        discoveredNumbers: {},
        completedRooms: []
      };
      setProgress(newProgress);
      localStorage.setItem('labyrinthProgress', JSON.stringify(newProgress));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Abriendo las puertas del infinito...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>DOORS</h1>
          <button 
            onClick={handleReset}
            className={styles.resetButton}
            aria-label="Reiniciar progreso"
          >
            Reiniciar
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        {progress && (
          <Room 
            roomId={progress.currentRoom} 
            progress={progress} 
            setProgress={setProgress} 
          />
        )}
      </main>
      
      <footer className={styles.footer}>
        <p>DOORS - Puerta del infinito </p>
      </footer>
    </div>
  );
};

export default Home;