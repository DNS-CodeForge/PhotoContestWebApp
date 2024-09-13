import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserProfileMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/home');
        window.location.reload();
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleMenuClose();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
                    <Avatar alt="User" src="/path-to-your-profile-image.jpg" />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        bgcolor: '#393E46',
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: '#393E46',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={handleProfileClick}
                    sx={{
                        padding: '1rem 1rem',
                        paddingRight: '3rem',
                        fontSize: '1rem',
                        justifyContent: 'flex-start',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 84, 36, 0.8)',
                            color: '#fff',
                        },
                    }}
                >
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <span style={{ color: '#fff' }}>Profile</span>
                </MenuItem>

                <Divider sx={{ bgcolor: '#555' }} />

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        padding: '1rem 1rem',
                        paddingRight: '3rem',
                        fontSize: '1rem',
                        justifyContent: 'flex-start',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 84, 36, 0.8)',
                            color: '#fff',
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <span style={{ color: '#fff' }}>Logout</span>
                </MenuItem>
            </Menu>
        </Box>
    );
}
