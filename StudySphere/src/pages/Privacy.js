import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PrivacyTipIcon color="primary" sx={{ fontSize: 36 }} /> Privacy Policy
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Last Updated: January 2024
        </Typography>
        <Typography variant="body1" paragraph>
          At StudySphere, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information that you provide directly to us, such as when you create an account, use our services, or contact us for support.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy;
