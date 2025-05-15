import React, { useState } from 'react';
import { checkAnswer, getSavedProgress } from '../data/labyrinth';
import styles from './Puzzle.module.css';

const Puzzle = ({ question, answerHash, onCorrectAnswer, isSolved }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(isSolved);
  const [isSecondStage, setIsSecondStage] = useState(false);
  const [secondStageAnswer, setSecondStageAnswer] = useState('');
  
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
    setFeedback('');
  };

  // Definición de la función handleKeyDown que faltaba
  const handleKeyDown = (e) => {
    // Si el usuario presiona Enter, enviar el formulario
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (userAnswer.trim() === '') {
      setFeedback('Por favor, ingresa una respuesta');
      return;
    }
    
    const input = userAnswer.toLowerCase().trim();
    const currentRoom = getSavedProgress().currentRoom;
    
    
    
    // Caso especial para la puerta E
    if (currentRoom === 'E' && input === 'tetra-el.org') {
      console.log("Activando segunda etapa para la sala E");
      setFeedback('Has descubierto algo interesante...');
      setIsSecondStage(true);
      return;
    }
    
    // Verificar respuestas alternativas
    if (
      (currentRoom === 'N' && ["sebastian", "el sebastian", "un sebastian"].includes(input)) ||
      (currentRoom === 'E' && ["nori-el", "nori el", "noriel", "globo", "el globo", "un globo", "globo terráqueo"].includes(input)) ||
      (currentRoom === 'S' && ["dios","el dios", "un dios", "DIOS"].includes(input)) ||
      (currentRoom === 'W' && ["21 de diciembre del 2012", "21/12/12"].includes(input)) ||
      (currentRoom === 'final' && input === '7395') ||
      checkAnswer(userAnswer, answerHash)
    ) {
      setFeedback('¡Correcto! Has descubierto un número para la contraseña final.');
      setIsCorrect(true);
      onCorrectAnswer();
    } else {
      setFeedback('Respuesta incorrecta. Intenta de nuevo.');
      setIsCorrect(false);
    }
  };

  const handleSecondStageSubmit = (e) => {
    e.preventDefault();
    
    if (secondStageAnswer.trim() === '') {
      setFeedback('Por favor, ingresa una respuesta');
      return;
    }
    
    const input = secondStageAnswer.toLowerCase().trim();
    
    // Respuesta correcta para la segunda etapa
    if ( input === 'nori-el' || input === 'nori el' || input === 'noriel') {
      setFeedback('¡Correcto! Has descubierto un número para la contraseña final.');
      setIsCorrect(true);
      onCorrectAnswer();
    } else {
      setFeedback('Respuesta incorrecta. Intenta de nuevo.');
    }
  };
  
  // Renderizar la segunda etapa si estamos en ella
  if (isSecondStage && !isCorrect) {
    return (
      <div className={styles.puzzleContainer}>
       <div className={styles.tetraHintContainer}>
        <div className={styles.tetraHintMessage}>
          <h3>Él sabe</h3>
          <p>La forma del mundo revela su secreto. Observa cuidadosamente y verás que la respuesta está frente a ti.</p>
          <a href="https://tetra-el.org/mediumnidad/misterios-revelados/circulos-cosechas/">Δ</a>
        </div>
      </div>
        
        <form onSubmit={handleSecondStageSubmit} className={styles.answerForm}>
          <label htmlFor="secondStageAnswer" className={styles.answerLabel}>
            Ingresa la respuesta final:
          </label>
          <input
            type="text"
            id="secondStageAnswer"
            value={secondStageAnswer}
            onChange={(e) => setSecondStageAnswer(e.target.value)}
            className={styles.answerInput}
            placeholder="Tu respuesta aquí..."
            disabled={isCorrect}
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isCorrect}
          >
            Verificar
          </button>
        </form>
        
        {feedback && (
          <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.incorrect}`}>
            {feedback}
          </div>
        )}
      </div>
    );
  }
  
  // Renderizar el puzzle normal
  return (
    <div className={styles.puzzleContainer}>
      <h2 className={styles.title}>Enigma</h2>
      <p className={styles.question}>{question}</p>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="answer" className={styles.label}>
            Tu respuesta:
          </label>
          <input
            type="text"
            id="answer"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
            placeholder="Escribe tu respuesta aquí..."
            disabled={isCorrect}
            aria-describedby="feedback"
          />
        </div>
        
        {feedback && (
          <p 
            id="feedback" 
            className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}
          >
            {feedback}
          </p>
        )}
        
        <button
          type="submit"
          className={styles.button}
          disabled={isCorrect}
        >
          Verificar
        </button>
      </form>
    </div>
  );
};

export default Puzzle;