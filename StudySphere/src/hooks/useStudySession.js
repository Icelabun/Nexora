import { useState, useEffect, useCallback } from 'react';
import { useStats } from '../contexts/StatsContext';

const useStudySession = () => {
  const { stats, gainExp } = useStats();
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [rewards, setRewards] = useState(null);

  const calculateRewards = useCallback((duration, baseExp) => {
    // Intelligence bonus (up to 50% extra exp)
    const intelligenceBonus = Math.floor(baseExp * (stats.attributes.intelligence / 200));
    
    // Focus bonus (up to 30% extra exp)
    const focusBonus = Math.floor(baseExp * (stats.attributes.focus / 300));
    
    // Persistence bonus (up to 20% extra exp)
    const persistenceBonus = Math.floor(baseExp * (stats.attributes.persistence / 400));
    
    // Random bonus (0-10% extra exp)
    const randomBonus = Math.floor(baseExp * (Math.random() / 10));

    const totalExp = baseExp + intelligenceBonus + focusBonus + persistenceBonus + randomBonus;

    return {
      baseExp,
      intelligenceBonus,
      focusBonus,
      persistenceBonus,
      randomBonus,
      totalExp,
    };
  }, [stats.attributes]);

  const startSession = useCallback((duration, baseExp) => {
    setIsActive(true);
    setSessionTime(duration);
    setTimeLeft(duration);
    setRewards(null);
  }, []);

  const endSession = useCallback((wasSuccessful = true) => {
    setIsActive(false);
    if (wasSuccessful && sessionTime > 0) {
      const baseExp = Math.floor((sessionTime / 60) * 10); // 10 exp per minute
      const calculatedRewards = calculateRewards(sessionTime, baseExp);
      setRewards(calculatedRewards);
      gainExp(calculatedRewards.totalExp);
    }
    setSessionTime(0);
    setTimeLeft(0);
  }, [sessionTime, calculateRewards, gainExp]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            endSession(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, endSession]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (sessionTime === 0) return 0;
    return ((sessionTime - timeLeft) / sessionTime) * 100;
  };

  return {
    isActive,
    timeLeft,
    rewards,
    formatTime,
    getProgress,
    startSession,
    endSession,
  };
};

export default useStudySession;
