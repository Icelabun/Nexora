import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  EmojiEvents as RankIcon,
  Timer as TimerIcon,
  Psychology as PsychologyIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';

const GlowingButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAAFF 30%, #60B6FF 90%)',
  border: 0,
  borderRadius: 8,
  boxShadow: '0 3px 5px 2px rgba(76, 170, 255, .3)',
  color: 'white',
  padding: '10px 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #60B6FF 30%, #4CAAFF 90%)',
    boxShadow: '0 3px 8px 2px rgba(76, 170, 255, .5)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
  border: '1px solid rgba(76, 170, 255, 0.3)',
  boxShadow: '0 0 15px rgba(76, 170, 255, 0.2)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const RankCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
  border: '1px solid rgba(76, 170, 255, 0.3)',
  boxShadow: '0 0 15px rgba(76, 170, 255, 0.2)',
  '&:hover': {
    boxShadow: '0 0 20px rgba(76, 170, 255, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const assessmentSteps = ['Preparation', 'Knowledge Test', 'Practical Test', 'Final Evaluation'];

const mockQuestions = [
  {
    question: "What is your current study routine?",
    options: [
      "I study regularly with a structured plan",
      "I study when I have time",
      "I only study before exams",
      "I don't have a study routine"
    ]
  },
  {
    question: "How do you handle difficult concepts?",
    options: [
      "Break them down and use multiple resources",
      "Ask for help from teachers or peers",
      "Try to memorize without full understanding",
      "Skip them and focus on easier topics"
    ]
  },
  {
    question: "What's your preferred learning method?",
    options: [
      "Interactive practice and application",
      "Reading and note-taking",
      "Video lectures and tutorials",
      "Group study and discussion"
    ]
  },
];

const RankAssessment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [showResult, setShowResult] = useState(false);
  const [currentRank, setCurrentRank] = useState('E');
  const [isAssessing, setIsAssessing] = useState(false);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAnswer = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const startAssessment = () => {
    setIsAssessing(true);
  };

  const completeAssessment = () => {
    setShowResult(true);
    // Mock rank calculation
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const randomRank = ranks[Math.floor(Math.random() * (ranks.length - 1))];
    setCurrentRank(randomRank);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4CAAFF' }}>
              Assessment Requirements
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                • Complete a series of knowledge and practical tests
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                • Demonstrate your problem-solving abilities
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                • Show your learning capabilities
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
                • Time limit: 5 minutes per section
              </Typography>
              <GlowingButton onClick={startAssessment}>
                Start Assessment
              </GlowingButton>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4CAAFF' }}>
              Knowledge Assessment
            </Typography>
            {mockQuestions.map((q, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                  {q.question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswer(index, e.target.value)}
                  >
                    {q.options.map((option, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        value={option}
                        control={<Radio sx={{ color: '#4CAAFF' }} />}
                        label={<Typography sx={{ color: '#fff' }}>{option}</Typography>}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4CAAFF' }}>
              Practical Assessment
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
              Complete the following practical exercises to demonstrate your abilities.
            </Typography>
            {/* Add practical exercises here */}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4CAAFF' }}>
              Final Evaluation
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
              Your responses are being evaluated to determine your rank.
            </Typography>
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(76, 170, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4CAAFF',
                  }
                }} 
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RankIcon sx={{ color: '#4CAAFF', fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{
              color: '#4CAAFF',
              textShadow: '0 0 10px rgba(76, 170, 255, 0.5)',
            }}
          >
            Rank Assessment
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#fff' }}>
          Prove your worth and determine your hunter rank through a series of tests.
        </Typography>
      </StyledPaper>

      <StyledPaper>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              color: '#fff',
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(76, 170, 255, 0.3)',
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: '#4CAAFF',
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: '#4CAAFF',
            },
          }}
        >
          {assessmentSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              sx={{ color: '#4CAAFF', mr: 1 }}
            >
              Back
            </Button>
          )}
          {activeStep < assessmentSteps.length - 1 ? (
            <GlowingButton onClick={handleNext}>
              Continue
            </GlowingButton>
          ) : (
            <GlowingButton onClick={completeAssessment}>
              Complete Assessment
            </GlowingButton>
          )}
        </Box>
      </StyledPaper>

      <Dialog 
        open={showResult} 
        onClose={() => setShowResult(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
            border: '1px solid rgba(76, 170, 255, 0.3)',
            boxShadow: '0 0 30px rgba(76, 170, 255, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#4CAAFF' }}>Assessment Complete</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Your Current Rank:
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#4CAAFF',
                textShadow: '0 0 20px rgba(76, 170, 255, 0.8)',
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              {currentRank}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              Continue training to improve your rank and unlock new abilities.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GlowingButton onClick={() => setShowResult(false)}>
            Close
          </GlowingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RankAssessment;
