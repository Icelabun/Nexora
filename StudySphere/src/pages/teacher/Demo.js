import React from 'react';
import { Container, Typography, Box, Paper, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const TeacherDemo = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PlayCircleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Request a Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            See how StudySphere can transform your classroom
          </Typography>
        </Box>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Full Name" fullWidth required />
          <TextField label="School Name" fullWidth required />
          <TextField label="Email" type="email" fullWidth required />
          <TextField label="Phone Number" fullWidth />
          <TextField label="Message" multiline rows={4} fullWidth />
          <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
            Request Demo
          </Button>
          <Button component={Link} to="/teachers" variant="text" fullWidth>
            Back to Teachers Page
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherDemo;
