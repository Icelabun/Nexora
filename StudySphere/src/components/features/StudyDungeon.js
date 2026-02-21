import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useStats } from '../../contexts/StatsContext';
import useStudySession from '../../hooks/useStudySession';

const GlowingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: '0 0 10px rgba(76, 170, 255, 0.5)',
}));

const DungeonCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
  border: '1px solid rgba(76, 170, 255, 0.3)',
  boxShadow: '0 0 15px rgba(76, 170, 255, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 0 20px rgba(76, 170, 255, 0.4)',
  },
}));

const StudyDungeon = () => {
  const { stats } = useStats();
  const { 
    isActive, 
    timeLeft, 
    rewards, 
    formatTime, 
    getProgress, 
    startSession, 
    endSession 
  } = useStudySession();
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  const dungeons = [
    {
      name: 'Quick Study Sprint',
      duration: 1 * 60, // 25 minutes
      expReward: 50,
      difficulty: 'E-Rank',
      description: 'A short focused study session. Perfect for beginners.',
      minLevel: 1,
      color: '#4CAAFF',
    },
    {
      name: 'Knowledge Warrior\'s Trial',
      duration: 45 * 60, // 45 minutes
      expReward: 100,
      difficulty: 'D-Rank',
      description: 'Medium length study session with increased focus requirement.',
      minLevel: 5,
      color: '#52FF52',
    },
    {
      name: 'Scholar\'s Challenge',
      duration: 60 * 60, // 60 minutes
      expReward: 150,
      difficulty: 'C-Rank',
      description: 'Long study session for experienced hunters.',
      minLevel: 10,
      color: '#FFD700',
    },
    {
      name: 'Archmage\'s Ordeal',
      duration: 90 * 60, // 90 minutes
      expReward: 250,
      difficulty: 'B-Rank',
      description: 'Intense study session with high rewards.',
      minLevel: 15,
      color: '#FF4C4C',
    },
    {
      name: 'Supreme Knowledge Gate',
      duration: 120 * 60, // 120 minutes
      expReward: 400,
      difficulty: 'A-Rank',
      description: 'Master-level study session with maximum rewards.',
      minLevel: 20,
      color: '#FF00FF',
    },
  ];

  const handleStartDungeon = (dungeon) => {
    if (stats.level < dungeon.minLevel) {
      alert(`You need to be level ${dungeon.minLevel} to enter this dungeon!`);
      return;
    }
    setSelectedDungeon(dungeon);
    startSession(dungeon.duration, dungeon.expReward);
  };

  const handleEndDungeon = (wasSuccessful = true) => {
    endSession(wasSuccessful);
    setSelectedDungeon(null);
    if (wasSuccessful) {
      setShowRewardDialog(true);
    }
  };

  useEffect(() => {
    if (rewards) {
      setShowRewardDialog(true);
    }
  }, [rewards]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <GlowingText variant="h4" gutterBottom>
          Study Dungeons
        </GlowingText>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Enter a dungeon to start your focused study session. Higher rank dungeons provide greater rewards.
        </Typography>
      </Box>

      {isActive && selectedDungeon ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <GlowingText variant="h5" gutterBottom>
            {selectedDungeon.name}
          </GlowingText>
          <Typography variant="h3" sx={{ my: 4, fontFamily: 'monospace', color: selectedDungeon.color }}>
            {formatTime(timeLeft)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 3,
              backgroundColor: 'rgba(76, 170, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: selectedDungeon.color,
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to abandon this dungeon? No rewards will be given.')) {
                handleEndDungeon(false);
              }
            }}
          >
            Abandon Dungeon
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {dungeons.map((dungeon) => (
            <Grid item xs={12} md={6} key={dungeon.name}>
              <DungeonCard>
                <CardContent>
                  <Typography variant="h6" sx={{ color: dungeon.color }} gutterBottom>
                    {dungeon.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'warning.main',
                      mb: 2,
                    }}
                  >
                    {dungeon.difficulty} Dungeon
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} paragraph>
                    {dungeon.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Duration: {formatTime(dungeon.duration)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Base EXP Reward: {dungeon.expReward}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Required Level: {dungeon.minLevel}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartDungeon(dungeon)}
                    disabled={stats.level < dungeon.minLevel}
                    sx={{
                      backgroundColor: dungeon.color,
                      '&:hover': {
                        backgroundColor: dungeon.color,
                        filter: 'brightness(0.9)',
                      },
                    }}
                  >
                    Enter Dungeon
                  </Button>
                </CardContent>
              </DungeonCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={showRewardDialog}
        onClose={() => setShowRewardDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
            border: '1px solid rgba(76, 170, 255, 0.3)',
          },
        }}
      >
        <DialogTitle>
          <GlowingText>Dungeon Cleared!</GlowingText>
        </DialogTitle>
        <DialogContent>
          {rewards && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedDungeon?.name || 'Study Session'}
              </Typography>
              <Typography variant="body1" paragraph>
                Base EXP: {rewards.baseExp}
              </Typography>
              <Typography variant="body1" paragraph>
                Intelligence Bonus: +{rewards.intelligenceBonus} EXP
              </Typography>
              <Typography variant="body1" paragraph>
                Focus Bonus: +{rewards.focusBonus} EXP
              </Typography>
              <Typography variant="body1" paragraph>
                Persistence Bonus: +{rewards.persistenceBonus} EXP
              </Typography>
              <Typography variant="body1" paragraph>
                Random Bonus: +{rewards.randomBonus} EXP
              </Typography>
              <Typography variant="h5" sx={{ color: 'primary.main', mt: 2 }}>
                Total EXP Gained: {rewards.totalExp}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRewardDialog(false)} sx={{ color: 'primary.main' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudyDungeon;
