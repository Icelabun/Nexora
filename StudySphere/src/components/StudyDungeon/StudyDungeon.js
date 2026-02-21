import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PortalAnimation from './PortalAnimation';
import Monster from './Monster';
import QuestionBox from './QuestionBox';
import HUD from './HUD';
import ExitButton from './ExitButton';
import { soundManager } from './SoundEffects';
import { getRandomMonster } from './MonsterTypes';
import Weapons, { weapons } from './Weapons';
import Mutations, { mutations } from './Mutations';

const Container = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#1a1a1a',
  padding: theme.spacing(4),
  fontFamily: '"Press Start 2P", cursive',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/pixel-grid.png")',
    opacity: 0.1,
    pointerEvents: 'none',
  }
}));

const Title = styled(Typography)(({ theme }) => ({
  color: '#ff4655',
  textShadow: '0 0 10px rgba(255, 70, 85, 0.8)',
  marginBottom: theme.spacing(4),
  fontSize: '2.5rem',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  fontFamily: '"Press Start 2P", cursive',
}));

const StartButton = styled(Button)(({ theme }) => ({
  background: '#ff4655',
  color: '#fff',
  padding: theme.spacing(2, 4),
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '1rem',
  border: '2px solid #fff',
  borderRadius: '0',
  '&:hover': {
    background: '#ff6b77',
    transform: 'scale(1.05)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const BattleArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0) 100%)',
    pointerEvents: 'none',
  }
}));

const MedkitButton = styled(Button)(({ theme }) => ({
  background: '#4CAF50',
  color: '#fff',
  padding: theme.spacing(1, 3),
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '0.8rem',
  border: '2px solid #fff',
  borderRadius: '0',
  marginTop: theme.spacing(2),
  '&:hover': {
    background: '#66BB6A',
    transform: 'scale(1.05)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const GameOverDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: '#1a1a1a',
    border: '2px solid #ff4655',
    borderRadius: '0',
    padding: theme.spacing(2),
  },
  '& .MuiDialogTitle-root': {
    color: '#ff4655',
    fontFamily: '"Press Start 2P", cursive',
    textAlign: 'center',
  },
  '& .MuiDialogContent-root': {
    color: '#fff',
    fontFamily: '"Press Start 2P", cursive',
    textAlign: 'center',
  },
  '& .MuiButton-root': {
    fontFamily: '"Press Start 2P", cursive',
    color: '#fff',
    '&.MuiButton-contained': {
      background: '#ff4655',
      '&:hover': {
        background: '#ff6b77',
      },
    },
  },
}));

const sampleQuestions = [
  {
    text: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: "O(log n)"
  },
  {
    text: "Which data structure is best suited for implementing a LRU cache?",
    options: ["Array", "Linked List + Hash Map", "Stack", "Queue"],
    correctAnswer: "Linked List + Hash Map"
  },
  {
    text: "The derivative of sin(x) is:",
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    correctAnswer: "cos(x)"
  },
  {
    text: "What is the solution to 3x + 5 = 17?",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: "x = 4"
  },
  {
    text: "Which algorithm is used to find the shortest path in a weighted graph without negative edges?",
    options: ["Depth-First Search", "Breadth-First Search", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctAnswer: "Dijkstra's Algorithm"
  },
  {
    text: "What is the chemical formula for table salt?",
    options: ["NaCl", "KCl", "Na2CO3", "CaCl2"],
    correctAnswer: "NaCl"
  },
  {
    text: "Which of these numbers is a prime number?",
    options: ["21", "33", "37", "49"],
    correctAnswer: "37"
  },
  {
    text: "In statistics, the area under the entire normal distribution curve equals:",
    options: ["0", "0.5", "1", "2"],
    correctAnswer: "1"
  },
  {
    text: "Which layer of the OSI model is responsible for routing?",
    options: ["Transport", "Network", "Session", "Data Link"],
    correctAnswer: "Network"
  },
  {
    text: "What is 7! (7 factorial)?",
    options: ["720", "840", "5040", "40320"],
    correctAnswer: "5040"
  },
  {
    text: "Which of these is NOT a valid Big-O complexity?",
    options: ["O(n^2)", "O(n log n)", "O(log log n)", "O(n!)^2"],
    correctAnswer: "O(n!)^2"
  },
  {
    text: "What is the value of the limit: lim (x→0) (sin x / x)?",
    options: ["0", "1", "∞", "Does not exist"],
    correctAnswer: "1"
  },
  {
    text: "Which sorting algorithm is guaranteed O(n log n) in the worst case?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Bubble Sort"],
    correctAnswer: "Merge Sort"
  },
  {
    text: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Primary Unit", "Control Processing Unit", "Central Program Unit"],
    correctAnswer: "Central Processing Unit"
  },
  {
    text: "Which country has the highest number of time zones?",
    options: ["USA", "Russia", "France", "China"],
    correctAnswer: "France"
  }
];

const StudyDungeon = ({ setShowSidebar }) => {
  const [gameState, setGameState] = useState('idle');
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(0);
  const [monster, setMonster] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [hasMedkit, setHasMedkit] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [activeWeapon, setActiveWeapon] = useState('sword');
  const [activeMutations, setActiveMutations] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [dungeonLevel, setDungeonLevel] = useState(1);
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (setShowSidebar) {
      setShowSidebar(false);
    }
    setGameState('portal');
    soundManager.playSound('portal');
  };

  const handlePortalComplete = () => {
    setGameState('battle');
    spawnNewMonster();
    soundManager.playMusic('battleMusic');
  };

  const spawnNewMonster = () => {
    const baseMonster = getRandomMonster(level);
    const hpMultiplier = 1 + (dungeonLevel - 1) * 0.25; // 25% more HP per dungeon level
    const scaledMaxHp = Math.floor(baseMonster.maxHp * hpMultiplier);

    const newMonster = {
      ...baseMonster,
      maxHp: scaledMaxHp,
    };

    setMonster(newMonster);
    setMonsterHP(newMonster.maxHp);
    setQuestionsAnswered(0);
    setCorrectStreak(0);
    setUsedQuestions(new Set());
    setCurrentQuestion(getRandomQuestion());
  };

  const getRandomQuestion = () => {
    const availableQuestions = sampleQuestions.filter(q => !usedQuestions.has(q.text));
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    }
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions(prev => new Set([...prev, question.text]));
    return question;
  };

  const handleWeaponSelect = (weapon) => {
    setActiveWeapon(weapon);
    soundManager.playSound('weaponSwitch');
  };

  const handleMutationSelect = (mutation) => {
    if (xp >= mutations[mutation].cost && !activeMutations.includes(mutation)) {
      setXp(prev => prev - mutations[mutation].cost);
      setActiveMutations(prev => [...prev, mutation]);
      soundManager.playSound('mutation');
    }
  };

  const calculateDamage = (isCorrect) => {
    let damage = weapons[activeWeapon].damage;
    
    // Apply mutations
    if (activeMutations.includes('criticalThinker') && Math.random() < 0.15) {
      damage *= 2;
    }
    
    // Apply weapon effects
    if (activeWeapon === 'shield' && !isCorrect) {
      damage = Math.floor(damage * 0.5); // Shield reduces damage taken
    }
    
    if (activeMutations.includes('knowledgeShield') && !isCorrect) {
      damage = Math.floor(damage * 0.75); // Knowledge Shield reduces damage
    }

    // Scale incoming damage by dungeon difficulty (enemy \"attack\" scaling)
    if (!isCorrect) {
      const attackMultiplier = 1 + (dungeonLevel - 1) * 0.15; // 15% more damage per dungeon level
      damage = Math.floor(damage * attackMultiplier);
    }

    return damage;
  };

  const handleAnswer = (isCorrect) => {
    let nextMonsterHP = monsterHP;
    let nextPlayerHP = playerHP;

    if (isCorrect) {
      const damage = calculateDamage(true);
      nextMonsterHP = Math.max(0, monsterHP - damage);
      setMonsterHP(nextMonsterHP);
      soundManager.playSound('attack');
      setCorrectStreak(prev => prev + 1);
      
      if (correctStreak + 1 >= 3 && !hasMedkit) {
        setHasMedkit(true);
        soundManager.playSound('levelUp');
      }
    } else {
      const damage = calculateDamage(false);
      nextPlayerHP = Math.max(0, playerHP - damage);
      setPlayerHP(nextPlayerHP);
      soundManager.playSound('attack');
      setCorrectStreak(0);
    }

    setQuestionsAnswered(prev => prev + 1);

    if (nextMonsterHP <= 0) {
      handleMonsterDefeat();
    } else if (nextPlayerHP <= 0) {
      handlePlayerDefeat();
    } else {
      const timer = activeMutations.includes('quickLearner') ? 400 : 500;
      setTimeout(() => {
        setCurrentQuestion(getRandomQuestion());
      }, timer);
    }
  };

  const handleUseMedkit = () => {
    if (hasMedkit) {
      const healAmount = Math.floor(Math.random() * 40) + 30;
      setPlayerHP(prev => Math.min(100, prev + healAmount));
      setHasMedkit(false);
      soundManager.playSound('heal');
    }
  };

  const handleMonsterDefeat = () => {
    let xpGain = monster.type === 'boss' ? 100 : 50;
    
    // Apply Study Master mutation
    if (activeMutations.includes('studyMaster')) {
      xpGain = Math.floor(xpGain * 1.5);
    }
    
    const newXp = xp + xpGain;
    const newLevel = Math.floor(newXp / 100) + 1;
    
    setXp(newXp);
    setLevel(newLevel);
    setDungeonLevel(prev => prev + 1);
    soundManager.playSound('monsterDefeat');
    
    if (newLevel > level) {
      soundManager.playSound('levelUp');
    }

    if (monster.type === 'boss') {
      setGameResult(true);
      setGameState('victory');
      soundManager.stopMusic('battleMusic');
    } else {
      setTimeout(spawnNewMonster, 2000);
    }
  };

  const handlePlayerDefeat = () => {
    setGameResult(false);
    setShowGameOver(true);
    soundManager.playSound('playerDefeat');
  };

  const handleGameOverClose = () => {
    setShowGameOver(false);
    setGameState('idle');
    setPlayerHP(100);
    setXp(0);
    setLevel(1);
    setDungeonLevel(1);
    setHasMedkit(false);
    setCorrectStreak(0);
    soundManager.stopMusic('battleMusic');
  };

  const handleExit = () => {
    setGameState('idle');
    setPlayerHP(100);
    setXp(0);
    setLevel(1);
    setDungeonLevel(1);
    setHasMedkit(false);
    setCorrectStreak(0);
    soundManager.stopMusic('battleMusic');
  };

  const handleBackToDashboard = () => {
    handleExit();
    if (setShowSidebar) {
      setShowSidebar(true);
    }
    navigate('/dashboard');
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'idle':
        return (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Title variant="h2">STUDY CELLS</Title>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StartButton variant="contained" onClick={handleStartGame}>
                ENTER THE DUNGEON
              </StartButton>
            </motion.div>
          </>
        );
      case 'portal':
        return <PortalAnimation onComplete={handlePortalComplete} />;
      case 'battle':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BattleArea>
              <Weapons activeWeapon={activeWeapon} onWeaponSelect={handleWeaponSelect} />
              <Monster type={monster?.type} hp={monsterHP} maxHp={monster?.maxHp} />
              <QuestionBox
                question={currentQuestion}
                onAnswer={handleAnswer}
                isDisabled={playerHP <= 0 || monsterHP <= 0}
              />
              {hasMedkit && (
                <MedkitButton
                  variant="contained"
                  onClick={handleUseMedkit}
                >
                  USE MEDKIT
                </MedkitButton>
              )}
              <Mutations
                activeMutations={activeMutations}
                onMutationSelect={handleMutationSelect}
                xp={xp}
              />
            </BattleArea>
          </motion.div>
        );
      case 'victory':
        return (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Title variant="h2">VICTORY!</Title>
              <Typography sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
                You defeated the boss! Choose your next move.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                <StartButton
                  variant="contained"
                  onClick={() => {
                    setGameState('battle');
                    spawnNewMonster();
                    soundManager.playMusic('battleMusic');
                  }}
                >
                  CONTINUE DEEPER
                </StartButton>
                <MedkitButton
                  variant="contained"
                  onClick={handleExit}
                >
                  EXIT DUNGEON
                </MedkitButton>
              </Box>
            </motion.div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Box
        sx={{
          position: 'fixed',
          top: 88,
          left: 24,
          zIndex: 110,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackToDashboard}
        >
          Back
        </Button>
      </Box>
      {gameState === 'battle' && (
        <>
          <HUD
            playerHP={playerHP}
            monsterHP={monsterHP}
            playerMaxHP={100}
            monsterMaxHP={monster?.maxHp || 0}
            xp={xp}
            level={level}
          />
          <ExitButton onExit={handleExit} />
        </>
      )}
      
      {renderGameState()}
      
      <GameOverDialog open={showGameOver} onClose={handleGameOverClose}>
        <DialogTitle>
          {gameResult ? 'VICTORY!' : 'YOU DIED'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {gameResult
              ? 'The dungeon has been conquered!'
              : 'The monsters were too strong...'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGameOverClose} color="primary">
            TRY AGAIN
          </Button>
        </DialogActions>
      </GameOverDialog>
    </Container>
  );
};

export default StudyDungeon; 