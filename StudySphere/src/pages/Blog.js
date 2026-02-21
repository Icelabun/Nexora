import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

const Blog = () => {
  const posts = [
    { title: '10 Study Tips for Success', date: '2024-01-15', excerpt: 'Learn effective study techniques...' },
    { title: 'How to Stay Motivated', date: '2024-01-10', excerpt: 'Discover ways to maintain motivation...' },
    { title: 'Time Management Strategies', date: '2024-01-05', excerpt: 'Master the art of time management...' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ArticleIcon color="primary" sx={{ fontSize: 36 }} /> Blog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Read our latest articles on study tips, learning strategies, and educational insights.
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={3}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArticleIcon sx={{ fontSize: 60, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {post.date}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {post.excerpt}
                </Typography>
                <Button variant="outlined" fullWidth>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
