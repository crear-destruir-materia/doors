import sha256 from "js-sha256";

// Función para verificar respuestas
export const checkAnswer = (input, correctHash) => {
  const userInput = input.toLowerCase().trim();
  
  // Verificación directa para cada sala
  const currentRoom = getSavedProgress().currentRoom;
  
  if (currentRoom === "N" && ["sebastian", "el sebastian", "un sebastian"].includes(userInput)) return true;
  if (currentRoom === "E" && ["nori-el", "nori el", "noriel"].includes(userInput)) return true;
  if (currentRoom === "S" && ["dios","el dios", "un dios", "DIOS"].includes(userInput)) return true;
  if (currentRoom === "W" && ["21/12/12","21 de diciembre del 2012"].includes(userInput)) return true;
  if (currentRoom === "final" && userInput === "7395") return true;
  
  // Si no coincide con ninguna respuesta directa, verificar con hash
  const userHash = sha256(userInput);

  
  return userHash === correctHash;
};

// Estructura del laberinto con salas y acertijos
export const labyrinthMap = {
  "start": {
    question: "Soy todo y a la vez nada. ¿Qué soy?",
    answerHash: null, // No hay acertijo en la sala inicial
    paths: {
      north: "N",
      east: "E",
      south: "S",
      west: "W"
    },
    isStart: true,
    isUnlocked: true
  },
  "N": {
    question: "Te invito a pasar",
    answerHash: "d98f409d1af7019203efc97d9dfd2011a5b0783f9a1e167c563cc40c5d390529", 
    alternativeAnswers: ["sebastian", "el sebastian", "un sebastian"],
    secretNumber: "7",
    paths: {
      north: null,
      east: null,
      south: null,
      west: null
    },
    isUnlocked: false
  },
  "E": {
    question: "¿Notas el parecido?",
    answerHash: "1661eece9c95a51f9c3631de45c04c5744e224c74584a3445de58470e4ec76f4", 
    alternativeAnswers: ["nori-el", "nori el", "noriel", "globo"], 
    secretNumber: "3",
    paths: {
      north: null,
      east: null,
      south: null,
      west: null
    },
    isUnlocked: false,
    hasSecondStage: true // Añadir esta propiedad para indicar que tiene una segunda etapa
  },
  "S": {
    question: "Solo la primera",
    answerHash: "c3c193ec815eb5b0a292fd6ceea8c962b1d31d40b4522a0602f68653784e3733", 
    alternativeAnswers: ["dios","el dios", "un dios", "DIOS"],
    secretNumber: "9",
    paths: {
      north: null,
      east: null,
      south: null,
      west: null
    },
    isUnlocked: false
  },
  "W": {
    question: " ¿Cuando?",
    answerHash: "85e7db20cb5f062e9f3e8536c867cd641cbef21e43175eda320f492d5200c798", 
    alternativeAnswers: ["21 de diciembre del 2012", "21/12/12"],
    secretNumber: "5",
    paths: {
      north: null,
      east: null,
      south: null,
      west: null
    },
    isUnlocked: false
  },
  "final": {
    question: "Ingresa la contraseña final formada por los números que has encontrado en las cuatro puertas.",
    answerHash: "7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", // "7395"
    alternativeAnswers: ["7395"],
    paths: {
      north: null,
      east:  null,
      south: null,
      west:  null
    },
    isUnlocked: false,
    isFinal: true
  }
};

// Función para obtener el progreso guardado
export const getSavedProgress = () => {
  const savedProgress = localStorage.getItem('labyrinthProgress');
  return savedProgress ? JSON.parse(savedProgress) : { 
    currentRoom: 'start', 
    unlockedRooms: ['start'],
    discoveredNumbers: {},
    completedRooms: []
  };
};

// Función para guardar el progreso
export const saveProgress = (progress) => {
  localStorage.setItem('labyrinthProgress', JSON.stringify(progress));
};

// Función para verificar si todas las salas han sido completadas
export const allRoomsCompleted = (completedRooms) => {
  return ['N', 'E', 'S', 'W'].every(room => completedRooms && completedRooms.includes(room));
};

// Función para obtener la contraseña final
export const getFinalPassword = (discoveredNumbers) => {
  return ['N', 'E', 'S', 'W'].map(room => discoveredNumbers[room] || '?').join('');
};