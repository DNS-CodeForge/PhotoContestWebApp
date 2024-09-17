import React from 'react';
import { Container, Typography, Paper, Box, Avatar, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GitHub, LinkedIn } from '@mui/icons-material';

const StyledPaper = styled(Paper)({
  padding: '24px',
  textAlign: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  color: 'white',
  boxShadow: 'none',
});

const SectionBox = styled(Box)({
  marginBottom: '32px',
});

const DeveloperCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  borderRadius: '8px',
}));

const DeveloperBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
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
            <Typography variant="body1" component="p">
              We are excited to present our Photo Contest App, a platform designed to foster creativity and community through photo contests. Our goal is to provide a user-friendly experience where participants can easily enter contests, share their work, and interact with fellow users.
            </Typography>
          </SectionBox>
          <SectionBox>
            <Typography variant="h6" component="h2">
              Meet the Developers
            </Typography>
            <Stack spacing={2}>
              <DeveloperCard>
                <DeveloperBox>
                  <DeveloperAvatar>S</DeveloperAvatar>
                  <div>
                    <Typography variant="body1" component="p">
                      <strong>S:</strong> S is a versatile developer with experience in both front-end and back-end technologies. S has focused on crafting a seamless user experience and ensuring the app&apos;s interface is both functional and aesthetically pleasing.
                    </Typography>
                    <Box>
                      <IconButton color="inherit" href="https://github.com/DNS-CodeForge" target="_blank">
                        <GitHub sx={{ color: 'white' }} />
                      </IconButton>
                      <IconButton color="inherit" href="https://www.linkedin.com" target="_blank">
                        <LinkedIn sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  </div>
                </DeveloperBox>
              </DeveloperCard>
              <DeveloperCard>
                <DeveloperBox>
                  <DeveloperAvatar>D</DeveloperAvatar>
                  <div>
                    <Typography variant="body1" component="p">
                      <strong>D:</strong> D is a skilled developer who has worked extensively on both the server-side and client-side aspects of the app. D&apos;s expertise in backend architecture and database management has been key in making sure the app performs efficiently and reliably.
                    </Typography>
                    <Box>
                      <IconButton color="inherit" href="https://github.com/DNS-CodeForge" target="_blank">
                        <GitHub sx={{ color: 'white' }} />
                      </IconButton>
                      <IconButton color="inherit" href="https://www.linkedin.com" target="_blank">
                        <LinkedIn sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  </div>
                </DeveloperBox>
              </DeveloperCard>
            </Stack>
          </SectionBox>
                  <SectionBox>
            <Typography variant="h6" component="h2">
              Disclaimer
            </Typography>
            <Typography variant="body1" component="p">
              This is a Demo app developed as part of a journey to expand knowledge in web development. All artistic materials used are royalty-free, with heartfelt appreciation extended to the creators who contribute to the beauty of art in all its forms.
            </Typography>
          </SectionBox>
        </StyledPaper>
      </Container>
  );
};

export default AboutPage;
