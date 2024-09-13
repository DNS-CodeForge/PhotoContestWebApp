import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation and useNavigate
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './Search';
import AuthButtons from './AuthButton.jsx';
import LoginForm from '../Forms/LoginForm';
import RegisterForm from '../Forms/RegisterForm.jsx';
import classes from './Navbar.module.css';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route path
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);


    useEffect(() => {
        if (location.pathname === '/login') {
            setIsLoginModalOpen(true);
            setIsRegisterModalOpen(false);
        } else if (location.pathname === '/register') {
            setIsRegisterModalOpen(true);
            setIsLoginModalOpen(false);
        } else {

            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(false);
        }
    }, [location.pathname]);

    const handleHomeRedirect = () => {
        navigate('/create-contest'); //
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleCloseModal = () => {
        navigate('/home');
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

                    <AuthButtons onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
                </Toolbar>
            </AppBar>

            {/* Conditionally render LoginForm or RegisterForm based on route or button click */}
            {isLoginModalOpen && (
                <LoginForm onClose={handleCloseModal} />
            )}
            {isRegisterModalOpen && (
                <RegisterForm onClose={handleCloseModal} />
            )}
        </Box>
    );
}
