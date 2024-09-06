import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './Search';
import AuthButtons from './AuthButton.jsx';
import classes from './Navbar.module.css';

export default function Navbar() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    className={classes.navbar}
                    position="fixed"
                    sx={{
                        backgroundColor: '#393E46FF',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '15px',
                        backdropFilter: "blur(10px)",
                        top: '1.5rem',
                        zIndex: 1000,
                        '&:hover': {
                            boxShadow: '0 4px 10px rgba(0, 173, 181, 0.1)'
                        },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <SearchBar />
                        </Box>
                        <AuthButtons />
                    </Toolbar>
                </AppBar>
            </Box>
            <div className={classes.navbarSpacer}></div>
        </>
    );
}
