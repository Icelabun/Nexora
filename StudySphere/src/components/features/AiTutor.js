import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Chip,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(45deg, #132F4C 30%, #173d5d 90%)',
  border: '1px solid rgba(76, 170, 255, 0.3)',
  boxShadow: '0 0 15px rgba(76, 170, 255, 0.2)',
  height: 'calc(100vh - 100px)',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageList = styled(List)({
  flexGrow: 1,
  overflow: 'auto',
  padding: '20px',
});

const MessageBubble = styled(Box)(({ isUser }) => ({
  background: isUser ? '#4CAAFF' : '#1E4976',
  padding: '10px 15px',
  borderRadius: '15px',
  maxWidth: '70%',
  wordWrap: 'break-word',
  marginLeft: isUser ? 'auto' : '0',
  marginRight: isUser ? '0' : 'auto',
  marginBottom: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(76, 170, 255, 0.3)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(76, 170, 255, 0.1)',
    '& fieldset': {
      borderColor: 'rgba(76, 170, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(76, 170, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
}));

const SuggestedQuestions = [
  "Can you explain the concept of quantum mechanics?",
  "How do I solve quadratic equations?",
  "What are the key events of World War II?",
  "Explain the process of photosynthesis",
];

const AiTutor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      text: `Welcome, ${user?.username || 'Hunter'}! I'm your AI Study Assistant. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        text: generateAIResponse(input),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question) => {
    // This is a mock response. In a real application, you would call your AI service here
    const responses = [
      "That's an interesting question! Let me break it down for you...",
      "Based on your current level, here's how I would explain it...",
      "Great question! Here's what you need to know...",
      "Let me help you understand this concept better...",
    ];
    return responses[Math.floor(Math.random() * responses.length)] +
      " [Detailed explanation would be provided by actual AI service]";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: 'calc(100vh - 100px)' }}>
      <StyledPaper>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(76, 170, 255, 0.3)' }}>
          <Typography variant="h5" sx={{ color: '#4CAAFF' }}>
            AI Study Assistant
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Ask me anything about your studies!
          </Typography>
        </Box>

        <MessageList>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                padding: '10px 20px',
              }}
            >
              {!message.isUser && (
                <Avatar
                  sx={{
                    bgcolor: '#4CAAFF',
                    mr: 2,
                    boxShadow: '0 0 10px rgba(76, 170, 255, 0.3)',
                  }}
                >
                  <SchoolIcon />
                </Avatar>
              )}
              <MessageBubble isUser={message.isUser}>
                <Typography color="white">{message.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mt: 1 }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </MessageBubble>
              {message.isUser && (
                <Avatar
                  sx={{
                    ml: 2,
                    bgcolor: '#FF4C4C',
                    boxShadow: '0 0 10px rgba(255, 76, 76, 0.3)',
                  }}
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              )}
            </ListItem>
          ))}
          {isTyping && (
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  AI is typing...
                </Typography>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </MessageList>

        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SuggestedQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => handleSuggestedQuestion(question)}
                sx={{
                  bgcolor: 'rgba(76, 170, 255, 0.1)',
                  color: '#4CAAFF',
                  '&:hover': {
                    bgcolor: 'rgba(76, 170, 255, 0.2)',
                  },
                }}
              />
            ))}
          </Box>
          <InputContainer>
            <StyledTextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your question..."
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              sx={{
                minWidth: '100px',
                background: 'linear-gradient(45deg, #4CAAFF 30%, #60B6FF 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3182CE 30%, #4CAAFF 90%)',
                },
              }}
            >
              {isTyping ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <SendIcon />
              )}
            </Button>
          </InputContainer>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default AiTutor;
