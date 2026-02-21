import React from 'react';
import { Container, Typography, Box, Paper, FormControlLabel, Switch, Button, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Settings = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 36 }} /> Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account settings and preferences.
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
        <FormControlLabel control={<Switch defaultChecked />} label="Push notifications" />
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Privacy
        </Typography>
        <FormControlLabel control={<Switch />} label="Make profile public" />
        <FormControlLabel control={<Switch defaultChecked />} label="Show activity status" />
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained">Save Changes</Button>
          <Button variant="outlined">Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
