import React, { useState, useEffect } from 'react';
import Door from './Door';
import Puzzle from './Puzzle';
import { labyrinthMap, saveProgress, allRoomsCompleted, getFinalPassword } from '../data/labyrinth';
import styles from './Room.module.css';
import DoorHint from './DoorHint';

const Room = ({ roomId, progress, setProgress }) => {
  const [room, setRoom] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showFinalDoor, setShowFinalDoor] = useState(false);
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [oracleAnswer, setOracleAnswer] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [finalPassword, setFinalPassword] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (roomId && labyrinthMap[roomId]) {
      setRoom(labyrinthMap[roomId]);
      setSolved(progress.completedRooms && progress.completedRooms.includes(roomId));
      
      // Verificar si todas las salas han sido completadas para mostrar la puerta final
      if (roomId === 'start' && progress.completedRooms) {
        const allCompleted = allRoomsCompleted(progress.completedRooms);
        setShowFinalDoor(allCompleted);
        
        if (allCompleted) {
          setFinalPassword(getFinalPassword(progress.discoveredNumbers));
        }
      } else {
        setShowFinalDoor(false);
      }
    }
    
    let glitchTimer;
    if (roomId === 'final') {
      glitchTimer = setTimeout(() => {
        setGlitchActive(true);
      }, 300000); 
    } else {
      setGlitchActive(false);
    }
    
    return () => {
      if (glitchTimer) clearTimeout(glitchTimer);
    };
  }, [roomId, progress.completedRooms, progress.discoveredNumbers]);

  // Función para aplicar el efecto glitch al texto
  const applyGlitchEffect = (text) => {
    if (!glitchActive || !text) return text;
    
    // Símbolos para el efecto glitch
    const glitchSymbols = '∞∆§¥Ω†‡•¶∑∫≈≠≤≥∏π∂∇√∃∀∈∉∋∌∧∨∩∪∴∵∼≡≢⊂⊃⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋⟨⟩⟪⟫⌀⌁⌂⌃⌄⌅⌆⌇⌠⌡';
    
    // Probabilidad de que un carácter se convierta en glitch
    const glitchProbability = 0.15;
    
    return text.split('').map(char => {
      if (Math.random() < glitchProbability) {
        return glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
      }
      return char;
    }).join('');
  };

  const handleCorrectAnswer = () => {
    if (!solved && room) {
      // Actualizar las salas completadas
      const updatedCompletedRooms = [...(progress.completedRooms || [])];
      if (!updatedCompletedRooms.includes(roomId)) {
        updatedCompletedRooms.push(roomId);
      }
      
      // Guardar el número secreto si existe
      const updatedDiscoveredNumbers = {...(progress.discoveredNumbers || {})};
      if (room.secretNumber) {
        updatedDiscoveredNumbers[roomId] = room.secretNumber;
      }
      
      // Actualizar el progreso
      const updatedProgress = {
        ...progress,
        completedRooms: updatedCompletedRooms,
        discoveredNumbers: updatedDiscoveredNumbers
      };
      
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
      setSolved(true);
    }
  };

  const handleMove = (direction) => {
    if (room && room.paths && (room.paths[direction] || direction === 'final' || direction === 'start')) {
      // Caso especial para la puerta final o para regresar a la sala principal
      let nextRoomId;
      
      if (direction === 'final') {
        nextRoomId = 'final';
      } else if (direction === 'start') {
        nextRoomId = 'start';
      } else {
        nextRoomId = room.paths[direction];
      }
      
      console.log("Navegando a:", nextRoomId); // Añadir para depuración
      
      // Permitir siempre el acceso desde la sala principal a las cuatro puertas iniciales
      // Y permitir acceso a la sala final si todas las habitaciones están completadas
      const isUnlocked = roomId === 'start' || 
                         labyrinthMap[nextRoomId].isUnlocked || 
                         progress.completedRooms?.includes(nextRoomId) ||
                         (nextRoomId === 'final' && showFinalDoor) ||
                         nextRoomId === 'start'; // Siempre permitir regresar a la sala principal
      
      if (isUnlocked) {
        const updatedProgress = {
          ...progress,
          currentRoom: nextRoomId
        };
        
        setProgress(updatedProgress);
        saveProgress(updatedProgress);
      }
    }
  };

  const handleOracleQuestion = (e) => {
    setOracleQuestion(e.target.value);
  };

  const consultOracle = () => {
    if (!oracleQuestion.trim()) {
      return;
    }
    
    setIsConsulting(true);
    
    // Simular tiempo de "pensamiento" del oráculo
    setTimeout(() => {
      // Respuesta aleatoria: Sí o No
      const answer = Math.random() > 0.5 ? 'Sí' : 'No';
      setOracleAnswer(answer);
      setIsConsulting(false);
    }, 1500);
  };

  if (!room) {
    return <div className={styles.loadingText}>Abriendo puertas...</div>;
  }

  // Modificar el renderizado para aplicar el efecto glitch
  return (
    <div className={styles.roomContainer}>
      <div className={styles.roomBackground}></div>
      
      <div className={styles.header}>
        <h1 className={`${styles.title} ${glitchActive ? styles.glitchText : ''}`}>
          {room.isStart ? 'Sala Principal' : 
           room.isFinal ? applyGlitchEffect('∞') : 
           `Puerta ${roomId}`}
        </h1>
        {room.isStart && (
          <p className={styles.subtitle}>
            Habitaciones completadas: {progress.completedRooms ? progress.completedRooms.length : 0}/4
          </p>
        )}
        {!room.isStart && !room.isFinal && (
          <p className={styles.subtitle}>
            {solved ? `Correcto, guarda este número: ${room.secretNumber}` : 'Encuentra la llave en cada puerta'}
          </p>
        )}
        {room.isFinal && (
          <p className={`${styles.subtitle} ${glitchActive ? styles.glitchText : ''}`}>
             {applyGlitchEffect('∞ Todo y a la vez nada ∞')}
          </p>
        )}
      </div>
      
      {/* Contenido específico para la sala del oráculo */}
      {room.isFinal && (
        <div className={styles.oracleContainer}>
          <div className={styles.oracleDescription}>
            <p className={glitchActive ? styles.glitchText : ''}>
              {applyGlitchEffect('El azar no existe, el tiempo y la materia son solo variables reservadas para su pequeño mundo. Aquí puedes hacer cualquier pregunta que pueda ser respondida con "Sí" o "No", y luego encargarte de las consecuencias.')}
            </p>
          </div>
          
          <div className={styles.oracleForm}>
            <textarea 
              className={styles.oracleTextarea}
              value={oracleQuestion}
              onChange={handleOracleQuestion}
              placeholder={glitchActive ? applyGlitchEffect("Escribe tu pregunta aquí...") : "Escribe tu pregunta aquí..."}
              rows={5}
              disabled={isConsulting}
            />
            
            <button 
              className={`${styles.oracleButton} ${glitchActive ? styles.glitchButton : ''}`}
              onClick={consultOracle}
              disabled={isConsulting || !oracleQuestion.trim()}
            >
              {isConsulting ? 'Consultando...' : glitchActive ? applyGlitchEffect('Consultar') : 'Consultar'}
            </button>
          </div>
          
          {oracleAnswer !== null && (
            <div className={styles.oracleAnswer}>
              <h3 className={glitchActive ? styles.glitchText : ''}>{applyGlitchEffect('∞ responde:')}</h3>
              <div className={`${styles.answerText} ${glitchActive ? styles.glitchText : ''}`}>
                {glitchActive ? applyGlitchEffect(oracleAnswer) : oracleAnswer}
              </div>
            </div>
          )}
          
          <div className={styles.returnLink}>
            <button 
              className={`${styles.returnButton} ${glitchActive ? styles.glitchButton : ''}`}
              onClick={() => handleMove('start')}
            >
              {glitchActive ? applyGlitchEffect('Regresar a la Sala Principal') : 'Regresar a la Sala Principal'}
            </button>
          </div>
        </div>
      )}
      
      {/* Navegación para salas que no son el oráculo */}
      {!room.isFinal && (
        <div className={styles.navigationGrid}>
          <div className={styles.northPosition}>
            {room.paths.north && (
              <Door 
                direction="north" 
                onClick={() => handleMove('north')} 
                isDisabled={false}
              />
            )}
          </div>
          
          <div className={styles.westPosition}>
            {room.paths.west && (
              <Door 
                direction="west" 
                onClick={() => handleMove('west')} 
                isDisabled={false}
              />
            )}
          </div>
          
          <div className={styles.eastPosition}>
            {room.paths.east && (
              <Door 
                direction="east" 
                onClick={() => handleMove('east')} 
                isDisabled={false}
              />
            )}
          </div>
          
          <div className={styles.southPosition}>
            {room.paths.south && (
              <Door 
                direction="south" 
                onClick={() => handleMove('south')} 
                isDisabled={false}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Puerta final separada (aparece solo en la sala principal cuando se han completado todas las habitaciones) */}
      {roomId === 'start' && showFinalDoor && (
        <div className={styles.finalDoorContainer}>
          <div className={styles.finalDoorLabel}>Puerta del  ∞</div>
          <div className={styles.finalDoorPosition}>
            <Door 
              direction="north" 
              onClick={() => handleMove('final')} 
              isDisabled={false}
              isFinal={true}
            />
          </div>
        </div>
      )}
      
      {/* Contenido del acertijo */}
      {room.question && room.answerHash && !room.isFinal && (
        <div className={styles.puzzleWrapper}>
          {/* Mostrar la pista visual si no es la sala principal */}
          {!room.isStart && (
            <DoorHint roomId={roomId} />
          )}
          
          <Puzzle 
            question={room.question} 
            answerHash={room.answerHash} 
            onCorrectAnswer={handleCorrectAnswer} 
            isSolved={solved}
          />
          
          {/* Botón para regresar a la sala principal */}
          {!room.isStart && (
            <div className={styles.returnLink}>
              <button 
                className={styles.returnButton}
                onClick={() => handleMove('start')}
              >
                Regresar a la Sala Principal
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Información de números descubiertos en la sala principal */}
      {room.isStart && (
        <div className={styles.discoveredNumbers}>
          <h3>Cuatro numeros, la proporción divina.</h3>
          <div className={styles.numbersGrid}>
            <div>Norte: {progress.discoveredNumbers && progress.discoveredNumbers.N ? progress.discoveredNumbers.N : '?'}</div>
            <div>Este: {progress.discoveredNumbers && progress.discoveredNumbers.E ? progress.discoveredNumbers.E : '?'}</div>
            <div>Sur: {progress.discoveredNumbers && progress.discoveredNumbers.S ? progress.discoveredNumbers.S : '?'}</div>
            <div>Oeste: {progress.discoveredNumbers && progress.discoveredNumbers.W ? progress.discoveredNumbers.W : '?'}</div>
          </div>
          {showFinalDoor && (
            <>
              <p className={styles.finalHint}>Has demostrado que tengo razón, podes ver mas alla de lo comun, eres especial.</p>
              <div className={styles.passwordHint}>
                <p>Infinitud aurica {finalPassword}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Room;