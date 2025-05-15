import React, { useState, useEffect } from 'react';
import styles from './DoorHint.module.css';

const DoorHint = ({ roomId }) => {
  const [showSecretImage, setShowSecretImage] = useState(false);
  const [showTetraHint, setShowTetraHint] = useState(false);
  
  // Añadimos un useEffect para escuchar el evento personalizado
  useEffect(() => {
    const handleTetraEvent = () => {
      setShowTetraHint(true);
    };
    
    // Agregar el event listener
    window.addEventListener('tetra-hint-activated', handleTetraEvent);
    
    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('tetra-hint-activated', handleTetraEvent);
    };
  }, []);
  
  // Función para determinar qué imagen mostrar según la habitación
  const getHintImage = () => {
    switch (roomId) {
      case 'N':
        return '/hints/molinodebosch.webp';
      case 'E':
        return '/hints/tetra-el.org.webp';
      case 'S':
        // Para la puerta S, devolvemos un array de imágenes
        return [
          '/hints/Irem.webp',
          '/hints/Dulce.webp',
          '/hints/Shambhala.webp',
          '/hints/Oumuamua.webp'
        ];
      case 'W':
        return '/hints/calendario.webp';
      default:
        return null;
    }
  };

  // Función para obtener la imagen secreta
  const getSecretImage = () => {
    switch (roomId) {
      case 'N':
        return '/hints/interiormolino.png'; // Imagen secreta del molino
      default:
        return null;
    }
  };

  const handleClickableArea = (e) => {
    // Detener la propagación del evento
    e.stopPropagation();
    setShowSecretImage(!showSecretImage); // Alternar entre mostrar y ocultar
  };

  const hintImage = getHintImage();
  const secretImage = getSecretImage();
  
  // Si no hay imagen para esta habitación, no renderizar nada
  if (!hintImage) {
    return null;
  }
  
  // Si estamos en la habitación E y se ha activado la pista de tetra-el.org
  if (roomId === 'E' && showTetraHint) {
    return (
      <div className={styles.tetraHintContainer}>
        <div className={styles.tetraHintMessage}>
          <h3>Él sabe</h3>
          <p>La forma del mundo revela su secreto. Observa cuidadosamente y verás que la respuesta está frente a ti.</p>
          <a href="https://tetra-el.org/mediumnidad/misterios-revelados/circulos-cosechas/">Δ</a>
        </div>
      </div>
    );
  }

  // Renderizado especial para la puerta S con múltiples imágenes en contenedores separados
  if (roomId === 'S' && Array.isArray(hintImage)) {
    return (
      <div className={styles.southImagesGrid}>
        {hintImage.map((img, index) => (
          <div key={index} className={styles.hintContainer}>
            <img 
              src={img} 
              alt={`Pista ${index + 1} para la habitación S`} 
              className={styles.hintImage}
            />
          </div>
        ))}
      </div>
    );
  }

  // Renderizado normal para las demás puertas
  return (
    <div className={styles.hintContainer}>
      <img 
        src={showSecretImage && secretImage ? secretImage : hintImage} 
        alt={`Pista para la habitación ${roomId}`} 
        className={styles.hintImage}
      />
      
      {/* Zona clickeable invisible (solo para la puerta norte) */}
      {roomId === 'N' && (
        <div 
          className={styles.clickableArea}
          onClick={handleClickableArea}
          title={showSecretImage ? "Volver a la imagen original" : "Molino de Bosch"}
        ></div>
      )}
      
      {/* Texto informativo que aparece cuando se muestra la imagen secreta */}
      {showSecretImage && (
        <div className={styles.secretImageInfo}>
          <span>¿Sabes que pasó aquí?</span>
        </div>
      )}
    </div>
  );
};

export default DoorHint;