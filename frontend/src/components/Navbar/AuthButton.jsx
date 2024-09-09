import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function AuthButtons({ onLoginClick, onRegisterClick }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                    m: 1,
                },
            }}
        >
            <ButtonGroup orientation="vertical" variant="text">
                <Button
                    size="small"
                    sx={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                            color: 'rgb(211, 84, 36)',
                            backgroundColor: 'transparent',
                        },
                    }}
                    onClick={onLoginClick}
                >
                    LOGIN
                </Button>
                <Divider sx={{ backgroundColor: '#FFFFFF' }} />
                <Button
                    size="small"
                    sx={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                            color: 'rgb(211, 84, 36)',
                            backgroundColor: 'transparent',
                        },
                    }}
                    onClick={onRegisterClick} 
                >
                    REGISTER
                </Button>
            </ButtonGroup>
        </Box>
    );
}
