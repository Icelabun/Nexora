import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Book,
  School,
  Group,
  Timeline,
  Timer,
  PhoneAndroid,
  EmojiEvents,
  LocalLibrary,
} from '@mui/icons-material';

const features = [
  {
    icon: <Book sx={{ fontSize: 40 }} />,
    title: 'Study Materials',
    description: 'Access a wide range of study resources including videos, articles, and interactive content.',
    link: '/study-materials',
  },
  {
    icon: <School sx={{ fontSize: 40 }} />,
    title: 'Flashcards',
    description: 'Create and study with interactive flashcards to reinforce your learning.',
    link: '/flashcards',
  },
  {
    icon: <Group sx={{ fontSize: 40 }} />,
    title: 'Forum',
    description: 'Join discussion forums and collaborate with peers.',
    link: '/forum',
  },
  {
    icon: <Timeline sx={{ fontSize: 40 }} />,
    title: 'Progress Tracking',
    description: 'Monitor your progress and achieve your learning goals.',
    link: '/dashboard',
  },
  {
    icon: <Timer sx={{ fontSize: 40 }} />,
    title: 'Time Management',
    description: 'Use built-in timers and scheduling tools to manage your study sessions.',
    link: '/dashboard',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    title: 'Gamification',
    description: 'Earn badges and points as you progress in your studies.',
    link: '/dashboard',
  },
];

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to StudySphere
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Your personalized learning platform for success
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/dashboard"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                {feature.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {feature.title}
                </Typography>
                <Typography align="center" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <Box p={2} textAlign="center">
                <Button
                  component={RouterLink}
                  to={feature.link}
                  variant="outlined"
                  color="primary"
                >
                  Learn More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
