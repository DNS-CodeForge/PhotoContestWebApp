
import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const Search = styled('div')(({ theme, focused, showForm }) => ({
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: '3.5rem',
    width: focused || showForm ? '300px' : '200px',
    transition: theme.transitions.create('width', {
        duration: theme.transitions.duration.standard,
    }),
    [theme.breakpoints.up('sm')]: {
        width: focused || showForm ? '22rem' : '15rem',
    },
    zIndex: 2,
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
    cursor: 'pointer',
    zIndex: 3,
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

const FormWrapper = styled('div')(({ theme, open }) => ({
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    backgroundColor: '#393E46',
    padding: theme.spacing(2),
    borderRadius: '8px',
    zIndex: 1000,
    minWidth: '30rem',
    display: open ? 'block' : 'none',
}));


export default function SearchBar({ onSearch }) {
    const [focused, setFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [category, setCategory] = useState(null);
    const [status, setStatus] = useState('all'); // For active and active submission
    const [privacy, setPrivacy] = useState('all'); // For private and public

    const toggleForm = () => {
        if (showForm) {
            setCategory(null);
            setStatus('all');
            setPrivacy('all');
        }
        setShowForm(!showForm);
    };

    const handleBlur = () => {
        setTimeout(() => setFocused(false), 200);
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && searchTerm.trim()) {
            const data = { title: searchTerm };
            onSearch(data);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = {
            title: searchTerm || null,
            category: category || null,
            isPrivate: privacy === 'private' ? true : privacy === 'public' ? false : null,
            active: status === 'active' ? true : status === 'all' ? null : false,
            activeSubmission: status === 'activeSubmission' ? true : status === 'all' ? null : false,
        };
        onSearch(formData);
        setShowForm(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Search focused={focused} showForm={showForm}>
                {focused || showForm ? (
                    <SettingsIconWrapper onClick={toggleForm}>
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
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    value={searchTerm}
                    sx={{ color: '#EEEEEE' }}
                />
            </Search>

            <FormWrapper open={showForm}>
                <form onSubmit={handleFormSubmit}>
                    <FormControl fullWidth sx={{ marginBottom: '1rem', minWidth: '8rem',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'orange',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'orange',
                            },
                        },
                        '& .MuiFormLabel-root': {
                            color: 'white',
                            '&.Mui-focused': {
                                color: 'orange',
                            },
                        },
                        '& .MuiSelect-icon': {
                            color: 'white',
                        }
                    }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category || ''}
                            onChange={(e) => setCategory(e.target.value || null)}
                            label="Category"
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: 'black',
                                        color: 'white',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiSelect-select': {
                                    color: 'white',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'white',
                                },
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="LANDSCAPE">Landscape</MenuItem>
                            <MenuItem value="PORTRAIT">Portrait</MenuItem>
                            <MenuItem value="STREET">Street</MenuItem>
                            <MenuItem value="WILDLIFE">Wildlife</MenuItem>
                            <MenuItem value="ABSTRACT">Abstract</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
                        <RadioGroup
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <FormControlLabel value="all" control={<Radio />} label="All" />
                            <FormControlLabel value="active" control={<Radio />} label="Active" />
                            <FormControlLabel value="activeSubmission" control={<Radio />} label="Active Submission" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
                        <RadioGroup
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                        >
                            <FormControlLabel value="all" control={<Radio />} label="All" />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                            <FormControlLabel value="public" control={<Radio />} label="Public" />
                        </RadioGroup>
                    </FormControl>

                    <Button type="submit" variant="contained" color="secondary" sx={{ backgroundColor: 'orange' }}>
                        Search
                    </Button>
                </form>
            </FormWrapper>
        </div>
    );
}

