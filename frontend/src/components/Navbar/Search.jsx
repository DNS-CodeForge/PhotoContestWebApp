import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const Search = styled('div')(({ theme, focused }) => ({
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: '3.5rem',
    width: focused ? '300px' : '200px',
    transition: theme.transitions.create('width', {
        duration: theme.transitions.duration.standard,
    }),
    [theme.breakpoints.up('sm')]: {
        width: focused ? '22rem' : '15rem',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const SettingsIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        paddingRight: `calc(1em + ${theme.spacing(5)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('md')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));


export default function SearchBar({ onSearch }) {
    const [focused, setFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && searchTerm.trim()) {
            onSearch(searchTerm);  // Trigger search on Enter
        }
    };

    return (
        <Search focused={focused}>
            {focused ? (
                <SettingsIconWrapper>
                    <ManageSearchIcon sx={{ color: '#EEEEEE' }} />
                </SettingsIconWrapper>
            ) : (
                <SearchIconWrapper>
                    <SearchIcon sx={{ color: '#EEEEEE' }} />
                </SearchIconWrapper>
            )}
            <StyledInputBase
                placeholder={!focused ? 'Search…' : ''}
                inputProps={{ 'aria-label': 'search' }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}  // Handle Enter key press
                value={searchTerm}
                sx={{ color: '#EEEEEE' }}
            />
        </Search>
    );
}

