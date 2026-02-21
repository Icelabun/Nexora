import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';

const Help = () => {
  const faqs = [
    {
      question: 'How do I create a study plan?',
      answer: 'Navigate to the Dashboard and click on "Create Study Plan" to get started.',
    },
    {
      question: 'What is the Study Dungeon?',
      answer: 'The Study Dungeon is a gamified learning experience where you complete tasks to level up.',
    },
    {
      question: 'How do I join a study group?',
      answer: 'Go to the Study Groups page and click "Join Group" on any group you\'re interested in.',
    },
    {
      question: 'Can I track my progress?',
      answer: 'Yes! Visit the Analytics page to see detailed insights into your study progress.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HelpIcon color="primary" sx={{ fontSize: 36 }} /> Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Find answers to common questions and get help with using StudySphere.
      </Typography>
      <Box>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default Help;
