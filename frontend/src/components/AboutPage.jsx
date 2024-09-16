
import React from 'react';
import { Container, Typography, Paper, Box, Avatar, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GitHub, LinkedIn } from '@mui/icons-material'; // Example icons

// Define custom styles using styled
const StyledPaper = styled(Paper)({
  padding: '24px',
  textAlign: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0)', 
  color: 'white',
    boxShadow: 'none'
});

const SectionBox = styled(Box)({
  marginBottom: '32px',
});

const DeveloperBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'left',
  marginBottom: '16px',
});

const DeveloperAvatar = styled(Avatar)({
  marginRight: '16px',
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 'bold',
  width: '56px',
  height: '56px',
  fontSize: '24px',
});

const AboutPage = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ backgroundColor: 'transparent', padding: 0 }}>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        <SectionBox>
          <Typography variant="h6" component="h2">
            Welcome to the Photo Contest App!
          </Typography>
          <Typography variant="body1" paragraph>
            We are excited to present our Photo Contest App, a platform designed to foster creativity and community through photo contests. Our goal is to provide a user-friendly experience where participants can easily enter contests, share their work, and interact with fellow users.
          </Typography>
        </SectionBox>
        <SectionBox>
          <Typography variant="h6" component="h2">
            Meet the Developers
          </Typography>
          <Stack spacing={2}>
            <DeveloperBox>
              <DeveloperAvatar>S</DeveloperAvatar>
              <div>
                <Typography variant="body1" paragraph>
                  <strong>S:</strong> S is a versatile developer with experience in both front-end and back-end technologies. S has focused on crafting a seamless user experience and ensuring the app's interface is both functional and aesthetically pleasing.
                </Typography>
                <Box>
                  <IconButton color="inherit" href="https://github.com/developerS" target="_blank">
                    <GitHub />
                  </IconButton>
                  <IconButton color="inherit" href="https://www.linkedin.com/in/developerS" target="_blank">
                    <LinkedIn />
                  </IconButton>
                </Box>
              </div>
            </DeveloperBox>
            <DeveloperBox>
              <DeveloperAvatar>D</DeveloperAvatar>
              <div>
                <Typography variant="body1" paragraph>
                  <strong>D:</strong> D is a skilled developer who has worked extensively on both the server-side and client-side aspects of the app. D's expertise in backend architecture and database management has been key in making sure the app performs efficiently and reliably.
                </Typography>
                <Box>
                  <IconButton color="inherit" href="https://github.com/developerD" target="_blank">
                    <GitHub />
                  </IconButton>
                  <IconButton color="inherit" href="https://www.linkedin.com/in/developerD" target="_blank">
                    <LinkedIn />
                  </IconButton>
                </Box>
              </div>
            </DeveloperBox>
          </Stack>
        </SectionBox>
        <SectionBox>
          <Typography variant="h6" component="h2">
            Our Vision
          </Typography>
          <Typography variant="body1" paragraph>
            Our vision is to build a robust and dynamic platform that enhances the experience of participating in and organizing photo contests. We aim to create an engaging space where users can showcase their work, compete, and connect, regardless of their level of expertise.
          </Typography>
        </SectionBox>
      </StyledPaper>
    </Container>
  );
};

export default AboutPage;

