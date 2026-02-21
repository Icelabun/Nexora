import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const Accessibility = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessibilityIcon color="primary" sx={{ fontSize: 36 }} /> Accessibility Statement
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Our Commitment
        </Typography>
        <Typography variant="body1" paragraph>
          StudySphere is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Standards
        </Typography>
        <Typography variant="body1" paragraph>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Feedback
        </Typography>
        <Typography variant="body1" paragraph>
          If you encounter any accessibility barriers, please contact us. We welcome your feedback and suggestions.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Accessibility;
