import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { getRank } from '../../utils/jwtUtils.jsx';
import organizerImage from '../../assets/organizer.png';
import rank1Image from '../../assets/rank1.png';
import rank2Image from '../../assets/rank2.png';
import rank3Image from '../../assets/rank3.png';
import rank4Image from '../../assets/rank4.png';

export default function UserProfileMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const rank = getRank(accessToken);

        switch (rank.toLowerCase()) {
            case 'organizer':
                setUserAvatar(organizerImage);
                break;
            case 'junkie':
                setUserAvatar(rank1Image);
                break;
            case 'enthusiast':
                setUserAvatar(rank2Image);
                break;
            case 'master':
                setUserAvatar(rank3Image);
                break;
            case 'dictator':
                setUserAvatar(rank4Image);
                break;
            default:
                setUserAvatar(rank1Image);
                break;
        }
    }, []);

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
                    <Avatar alt="User" src={userAvatar} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                    paper: {
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
