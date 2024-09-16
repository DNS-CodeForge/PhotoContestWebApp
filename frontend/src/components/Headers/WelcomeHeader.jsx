import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {isAuthenticated} from "../../utils/authUtils.jsx";

const WelcomeHeader = () => {
    const navigate = useNavigate();

    const handleJoinUsClick = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                padding: '2vh 1vw',
                backgroundColor: ' #393E46',
                borderRadius: '16px',
                margin: '0 auto',
                marginBottom: '5vh',
                maxWidth: '98vw',
            }}
        >
            <Typography variant="h2" component="h1" gutterBottom>
                Hello fellow artistic adventurer!
            </Typography>
            <Typography variant="body1" component="p" sx={{ fontSize: '1.2rem' }}>
                Welcome to our photography contest website, where creativity knows no bounds!
                Whether you&apos;re an amateur looking for inspiration or a professional ready to showcase your talent,
                you&apos;ve come to the right place. Join our vibrant community of photographers and get ready to embark
                on exciting challenges, meet like-minded creators, and share your unique perspective of the world.
            </Typography>


            {!isAuthenticated(localStorage.getItem("accessToken")) && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '20px',
                        backgroundColor: 'rgba(130,130,130,0.2)' }}
                    onClick={handleJoinUsClick}
                >
                    Join Us
                </Button>
            )}
        </Box>
    );
};

export default WelcomeHeader;
