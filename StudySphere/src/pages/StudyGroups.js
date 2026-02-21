import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardHeader, Avatar, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const StudyGroups = () => {
  const groups = [
    { name: 'Math Study Group', members: 12, subject: 'Mathematics' },
    { name: 'Science Club', members: 8, subject: 'Science' },
    { name: 'History Buffs', members: 15, subject: 'History' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GroupIcon color="primary" sx={{ fontSize: 36 }} /> Study Groups
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Join study groups to collaborate and learn together with other students.
      </Typography>
      <Grid container spacing={3}>
        {groups.map((group, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <GroupIcon />
                  </Avatar>
                }
                title={group.name}
                subheader={group.subject}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {group.members} members
                </Typography>
                <Button variant="contained" fullWidth>
                  Join Group
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudyGroups;
