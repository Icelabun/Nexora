import React from 'react';
import { Container, Typography, Box, Paper, Button, TextField, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const TeacherContact = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ContactMailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Contact Sales
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get in touch with our sales team
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="primary" />
                <Typography>sales@studysphere.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon color="primary" />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="primary" />
                <Typography>123 Education St, Learning City, LC 12345</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" fullWidth required />
              <TextField label="Email" type="email" fullWidth required />
              <TextField label="School/Organization" fullWidth />
              <TextField label="Message" multiline rows={4} fullWidth required />
              <Button variant="contained" fullWidth size="large">
                Send Message
              </Button>
              <Button component={Link} to="/teachers" variant="text" fullWidth>
                Back to Teachers Page
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TeacherContact;
