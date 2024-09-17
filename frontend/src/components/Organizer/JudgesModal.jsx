import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Chip, Stack, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const JudgesModal = ({ open, onClose, judges, contestId }) => {
    const [newlyAddedJudges, setNewlyAddedJudges] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const finalJudges = [...judges, ...newlyAddedJudges];

    const handleAddJudgeFromSuggestion = (suggestion) => {
        setNewlyAddedJudges((prev) => [...prev, suggestion]);
        setSearchTerm('');
        setSuggestions([]);
    };

    const handleRemoveJudge = (id) => {
        setNewlyAddedJudges((prev) => prev.filter((judge) => judge.id !== id));
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);

        if (typingTimeout) clearTimeout(typingTimeout);

        if (value.length >= 3) {
            setTypingTimeout(setTimeout(() => fetchSuggestions(value), 500));
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = async (query) => {
        if (!contestId || !query) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No access token found');

            const url = `${BACKEND_BASE_URL}api/user/jury/suggestions?query=${query}&contestId=${contestId}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Failed to fetch suggestions: ${response.statusText}`);

            const fetchedSuggestions = await response.json();
            const filteredSuggestions = fetchedSuggestions.filter(
                (suggestion) => !finalJudges.some((judge) => judge.id === suggestion.id)
            );

            setSuggestions(filteredSuggestions);
        } catch (err) {
            setError(`Error fetching suggestions: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const selectedJudgeIds = newlyAddedJudges.map(judge => judge.id);
        const url = `${BACKEND_BASE_URL}api/contest/${contestId}/judges/invite`;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No access token found');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedJudgeIds),
            });

            if (!response.ok) throw new Error(`Failed to invite judges: ${response.statusText}`);

            onClose();
        } catch (error) {
            console.error("Error submitting judges:", error);
        }
    };




    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: '2rem', backgroundColor: 'black', width: '400px', margin: '10vh auto', color: 'white' }}>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: '1rem' }}>
                    Judges
                </Typography>

                <List sx={{ marginBottom: '1rem' }}>
                    {finalJudges.map((judge, index) => (
                        <ListItem key={judge.id} sx={{ color: 'white' }}>
                            <ListItemText primary={`${index + 1}. ${judge.firstName} ${judge.lastName}`} />
                        </ListItem>
                    ))}
                </List>

                <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {newlyAddedJudges.map((judge) => (
                        <Chip
                            key={judge.id}
                            label={judge.firstName}
                            onDelete={() => handleRemoveJudge(judge.id)}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        />
                    ))}
                </Stack>

                <TextField
                    label="Search Judge"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{
                        marginBottom: '0',
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'gray',
                            },
                        },
                        '& label': { color: 'white' }
                    }}
                />

                {loading && <CircularProgress sx={{ color: 'white' }} />}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && suggestions.length > 0 && (
                    <Box
                        sx={{
                            backgroundColor: '#393E46',
                            marginBottom: '1rem',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <ListItem
                                key={suggestion.id}
                                button="true"
                                onClick={() => handleAddJudgeFromSuggestion(suggestion)}
                                sx={{
                                    padding: '8px 16px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(211, 84, 36)',
                                    },
                                }}
                            >
                                <ListItemText primary={`${suggestion.username} ${suggestion.firstName} ${suggestion.lastName}`} />
                            </ListItem>
                        ))}
                    </Box>
                )}
                {!loading && suggestions.length === 0 && searchTerm.length >= 3 && (
                    <Typography color="white">No results found</Typography>
                )}

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{ backgroundColor: 'green', color: 'white', marginTop: '1rem' }}
                >
                    Submit Judges
                </Button>
            </Box>
        </Modal>
    );
};

export default JudgesModal;
