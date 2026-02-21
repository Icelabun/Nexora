import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GavelIcon color="primary" sx={{ fontSize: 36 }} /> Terms of Service
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Last Updated: January 2024
        </Typography>
        <Typography variant="body1" paragraph>
          Please read these Terms of Service carefully before using StudySphere.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using StudySphere, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Use License
        </Typography>
        <Typography variant="body1" paragraph>
          Permission is granted to temporarily use StudySphere for personal, non-commercial purposes only.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          User Accounts
        </Typography>
        <Typography variant="body1" paragraph>
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms;
