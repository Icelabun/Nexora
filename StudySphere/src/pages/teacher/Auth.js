import React from 'react';
import { Container, Typography, Box, Paper, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const TeacherAuth = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Teacher Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your teacher dashboard
          </Typography>
        </Box>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" type="email" fullWidth required />
          <TextField label="Password" type="password" fullWidth required />
          <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
            Sign In
          </Button>
          <Button component={Link} to="/auth" variant="text" fullWidth>
            Student Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherAuth;
