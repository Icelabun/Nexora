import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { styled } from '@mui/material/styles';

const StyledTimeline = styled(Timeline)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

const TimelinePage = () => {
  const events = [
    { date: '2024-01-15', title: 'Joined StudySphere', description: 'Started your learning journey' },
    { date: '2024-01-20', title: 'First Quest Completed', description: 'Completed your first study quest' },
    { date: '2024-01-25', title: 'Level Up!', description: 'Reached level 5' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Your Learning Timeline
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your progress and milestones throughout your study journey.
      </Typography>
      <StyledTimeline>
        {events.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" component="h2">
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.date}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {event.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </StyledTimeline>
    </Container>
  );
};

export default TimelinePage;
