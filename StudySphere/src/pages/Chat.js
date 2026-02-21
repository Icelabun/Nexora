import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'other' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Connect with other students and get help with your studies.
      </Typography>
      <Paper sx={{ height: '500px', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexDirection: message.sender === 'me' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: message.sender === 'me' ? 'primary.main' : 'grey.200',
                      color: message.sender === 'me' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography>{message.text}</Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;
