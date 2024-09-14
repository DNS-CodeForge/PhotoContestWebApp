import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import CollectionsIcon from '@mui/icons-material/Collections';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import logo from '../../assets/logo.png';
import { getRoles } from "../../utils/jwtUtils.jsx";
import { isAuthenticated } from "../../utils/authUtils.jsx";

export default function ToolbarMenu() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMenuClose();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Navigation" placement="bottom">
                <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="logo"
                    sx={{
                        padding: 0,
                        margin: 0,
                        borderRadius: '50%',
                        overflow: 'hidden',
                    }}
                >
                    <img src={logo} alt="Logo" style={{ height: '3rem', width: '3rem', borderRadius: '50%' }} />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onMouseLeave={handleMenuClose}
                slotProps={{
                    paper: {
                        elevation: 3,
                        sx: {
                            backgroundColor: '#393E46',
                            color: '#fff',
                            mt: 1.5,
                            '& .MuiMenuItem-root': {
                                '&:hover': {
                                    backgroundColor: 'rgba(211, 84, 36, 0.8)',
                                    color: '#fff',
                                },
                            },
                        },
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem
                    onClick={() => handleNavigation('/home')}
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
                    <HomeIcon sx={{ mr: 1, color: '#fff' }} />
                    Home
                </MenuItem>

                {isAuthenticated(localStorage.getItem('accessToken')) && (
                    <>
                        <MenuItem
                            onClick={() => handleNavigation('/contest')}
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
                            <EmojiEventsIcon sx={{ mr: 1, color: '#fff' }} />
                            Contest
                        </MenuItem>

                        <MenuItem
                            onClick={() => handleNavigation('/my-contests')}
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
                            <CollectionsIcon sx={{ mr: 1, color: '#fff' }} />
                            My Contests
                        </MenuItem>

                        <MenuItem
                            onClick={() => handleNavigation('/my-submissions')}
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
                            <HowToVoteIcon sx={{ mr: 1, color: '#fff' }} />
                            My Submissions
                        </MenuItem>

                        {getRoles(localStorage.getItem('accessToken')).includes('ADMIN') && (
                            <MenuItem
                                onClick={() => handleNavigation('/organizer')}
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
                                <GroupIcon sx={{ mr: 1, color: '#fff' }} />
                                Organizer
                            </MenuItem>
                        )}
                    </>
                )}

                <MenuItem
                    onClick={() => handleNavigation('/about')}
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
                    <InfoIcon sx={{ mr: 1, color: '#fff' }} />
                    About
                </MenuItem>
            </Menu>
        </Box>
    );
}
