
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SearchBar from './Search';
import AuthButtons from './AuthButton.jsx';
import LoginForm from '../Forms/LoginForm';
import RegisterForm from '../Forms/RegisterForm.jsx';
import UserProfileMenu from './UserProfileMenu';
import classes from './Navbar.module.css';
import { isAuthenticated } from '../../utils/authUtils';
import ToolbarMenu from './ToolbarMenu.jsx';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const authenticated = isAuthenticated();

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

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleCloseModal = () => {
        navigate('/');
    };

    const handleSearch = (searchParams) => {
        // Create a URLSearchParams instance and append non-null values
        const params = new URLSearchParams();
        
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                params.append(key, value);
            }
        });
        
        const searchParamsString = params.toString();
        console.log(params.toString())
        navigate(`/contest/page/1?${searchParamsString}`);
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
                    '&:hover .MuiIconButton-root': {
                        boxShadow: 'none',
                    },
                }}
            >
                <Toolbar>
                    <ToolbarMenu />
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        {authenticated && <SearchBar onSearch={handleSearch} />}
                    </Box>

                    {!authenticated ? (
                        <AuthButtons onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
                    ) : (
                        <UserProfileMenu />
                    )}
                </Toolbar>
            </AppBar>

            {!authenticated && isLoginModalOpen && <LoginForm onClose={handleCloseModal} />}
            {!authenticated && isRegisterModalOpen && <RegisterForm onClose={handleCloseModal} />}
        </Box>
    );
}

