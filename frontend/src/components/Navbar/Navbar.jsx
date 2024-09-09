import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './Search';
import AuthButtons from './AuthButton.jsx';
import LoginForm from '../Forms/LoginForm';
import classes from './Navbar.module.css';
import { useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


    const handleHomeRedirect = () => {
        navigate('/');
    };




    const handleLoginClick = () => {

        setIsLoginModalOpen(true);
    };

    const handleCloseModal = () => {

        setIsLoginModalOpen(false);
    };

    return (
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <AppBar
                className={classes.navbar}
                position="static"
                sx={{
                    backgroundColor: '#393E46',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)',
                    width: '98%',
                    margin: 'auto',
                    marginTop: '0',
                    '&:hover': {
                        boxShadow: '0px 4px 6px rgba(211, 84, 36, 0.3)',
                    },
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleHomeRedirect}
                        sx={{
                            mr: 2,
                            '&:focus': {
                                color: '#EEEEEE',
                            },
                            '&:active': {
                                color: 'rgba(211, 84, 36)',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <SearchBar />
                    </Box>

                    <AuthButtons onLoginClick={handleLoginClick} />
                </Toolbar>
            </AppBar>


            {isLoginModalOpen && (
                <LoginForm onClose={handleCloseModal} />
            )}
        </Box>
    );
}
