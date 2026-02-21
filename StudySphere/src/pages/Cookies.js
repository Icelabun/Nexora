import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';

const Cookies = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CookieIcon color="primary" sx={{ fontSize: 36 }} /> Cookie Policy
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Last Updated: January 2024
        </Typography>
        <Typography variant="body1" paragraph>
          This Cookie Policy explains how StudySphere uses cookies and similar technologies to recognize you when you visit our website.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          What Are Cookies?
        </Typography>
        <Typography variant="body1" paragraph>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          How We Use Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Managing Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          You can control and manage cookies in your browser settings. However, disabling cookies may affect the functionality of our website.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Cookies;
