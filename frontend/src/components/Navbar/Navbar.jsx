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
        <Box sx={{ flexGrow: 1, position: 'sticky', top: 0, zIndex:1000 }}>

            <AppBar
                className={classes.navbar}
                position="sticky"
                sx={{
                    backgroundColor: '#393E46FF',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    backdropFilter: "blur(10px)",

                    '&:hover': {
                        boxShadow: '0px 4px 6px rgba(211, 84, 36, 0.3)'
                    },
                }}
            >
                <Toolbar>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{
                            mr: 2,
                            '&:focus': {
                                color: 'rgba(211, 84, 36)',
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
                    <AuthButtons />
                </Toolbar>
            </AppBar>
        </Box>
    );
}