import React, { createContext, useState, useContext } from 'react';

const StatsContext = createContext(null);

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    rank: 'E-Rank Hunter',
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    attributes: {
      intelligence: 10,
      focus: 8,
      memory: 7,
      comprehension: 6,
      persistence: 9,
    },
    skills: [
      {
        name: 'Quick Learning',
        level: 1,
        description: 'Increases learning speed by 10%',
        cooldown: '1 hour',
      },
      {
        name: 'Mental Focus',
        level: 1,
        description: 'Enhances concentration during study sessions',
        cooldown: '2 hours',
      },
    ],
    achievements: [],
    dungeonsClearedCount: 0, // Study sessions completed
    questsCompleted: 0,      // Assignments completed
  });

  const gainExp = (amount) => {
    setStats(prev => {
      const newExp = prev.exp + amount;
      if (newExp >= prev.nextLevelExp) {
        return {
          ...prev,
          level: prev.level + 1,
          exp: newExp - prev.nextLevelExp,
          nextLevelExp: Math.floor(prev.nextLevelExp * 1.5),
          attributes: {
            intelligence: prev.attributes.intelligence + 2,
            focus: prev.attributes.focus + 1,
            memory: prev.attributes.memory + 1,
            comprehension: prev.attributes.comprehension + 1,
            persistence: prev.attributes.persistence + 1,
          },
        };
      }
      return {
        ...prev,
        exp: newExp,
      };
    });
  };

  const updateRank = () => {
    const ranks = ['E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank'];
    const newRankIndex = Math.floor(stats.level / 10);
    if (newRankIndex < ranks.length) {
      setStats(prev => ({
        ...prev,
        rank: `${ranks[newRankIndex]} Hunter`,
      }));
    }
  };

  const addSkill = (skill) => {
    setStats(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  return (
    <StatsContext.Provider value={{ stats, gainExp, updateRank, addSkill }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export default StatsContext;
