import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const StudyMaterials = () => {
  const materials = [
    {
      title: 'Introduction to Programming',
      type: 'Video Course',
      description: 'Learn the basics of programming with Python',
      duration: '2 hours',
    },
    {
      title: 'Web Development Fundamentals',
      type: 'Interactive Tutorial',
      description: 'HTML, CSS, and JavaScript basics',
      duration: '3 hours',
    },
    {
      title: 'Data Structures and Algorithms',
      type: 'PDF Document',
      description: 'Comprehensive guide to DS & Algorithms',
      pages: '150 pages',
    },
    {
      title: 'Machine Learning Basics',
      type: 'Video Series',
      description: 'Introduction to ML concepts',
      duration: '4 hours',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Study Materials
      </Typography>
      
      <TextField
        fullWidth
        margin="normal"
        placeholder="Search study materials..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {materials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {material.title}
                </Typography>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {material.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {material.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {material.duration || material.pages}
                </Typography>
              </CardContent>
              <Button size="small" color="primary" sx={{ m: 2 }}>
                Start Learning
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudyMaterials;
