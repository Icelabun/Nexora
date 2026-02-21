import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const Careers = () => {
  const positions = [
    { title: 'Frontend Developer', department: 'Engineering', location: 'Remote' },
    { title: 'UX Designer', department: 'Design', location: 'San Francisco' },
    { title: 'Product Manager', department: 'Product', location: 'New York' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WorkIcon color="primary" sx={{ fontSize: 36 }} /> Careers
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Join our team and help shape the future of education.
      </Typography>
      <Grid container spacing={3}>
        {positions.map((position, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {position.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {position.department} • {position.location}
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Careers;
