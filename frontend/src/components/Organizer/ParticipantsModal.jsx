import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    CircularProgress,
    Button,
    Stack,
    Chip,
    ListItemText
} from '@mui/material';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ParticipantsModal = ({ open, onClose, participants, contestId }) => {
    const [newlyAddedParticipants, setNewlyAddedParticipants] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const finalParticipants = [...participants, ...newlyAddedParticipants];


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
        if (!contestId || !query) return;

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No access token found');

            const url = `${BACKEND_BASE_URL}api/user/participant/suggestions?query=${query}&contestId=${contestId}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Failed to fetch suggestions: ${response.statusText}`);

            const fetchedSuggestions = await response.json();
            const filteredSuggestions = fetchedSuggestions.filter(
                (suggestion) => !finalParticipants.some((participant) => participant.id === suggestion.id)
            );

            setSuggestions(filteredSuggestions);
        } catch (err) {
            setError(`Error fetching suggestions: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddParticipantFromSuggestion = (suggestion) => {
        setNewlyAddedParticipants((prev) => [...prev, suggestion]);
        setSearchTerm('');
        setSuggestions([]);
    };

    const handleRemoveParticipant = (id) => {
        setNewlyAddedParticipants((prev) => prev.filter((participant) => participant.id !== id));
    };

    const handleSubmit = async () => {
        const selectedParticipantIds = newlyAddedParticipants.map(participant => participant.id);
        const url = `${BACKEND_BASE_URL}api/contest/${contestId}/participants/invite`;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No access token found');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedParticipantIds),
            });

            if (!response.ok) throw new Error(`Failed to invite participants: ${response.statusText}`);

            onClose();
        } catch (error) {
            console.error("Error submitting participants:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: '2rem', backgroundColor: 'black', width: '400px', margin: '10vh auto', color: 'white' }}>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: '1rem' }}>
                    Participants
                </Typography>


                <List sx={{ marginBottom: '1rem' }}>
                    {finalParticipants.map((participant, index) => (
                        <ListItem key={participant.id} sx={{ color: 'white' }}>
                            <ListItemText primary={`${index + 1}. ${participant.firstName} ${participant.lastName} (${participant.rank})`} />
                        </ListItem>
                    ))}
                </List>

                <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {newlyAddedParticipants.map((participant) => (
                        <Chip
                            key={participant.id}
                            label={participant.firstName}
                            onDelete={() => handleRemoveParticipant(participant.id)}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        />
                    ))}
                </Stack>

                <TextField
                    label="Search Participant"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{
                        marginBottom: '0',
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' },
                            '&:hover fieldset': { borderColor: 'gray' },
                        },
                        '& label': { color: 'white' },
                    }}
                />

                {loading && <CircularProgress sx={{ color: 'white' }} />}

                {error && <Typography color="error">{error}</Typography>}

                {!loading && suggestions.length > 0 && (
                    <Box sx={{ backgroundColor: '#393E46', marginBottom: '1rem', borderRadius: '4px', overflow: 'hidden' }}>
                        {suggestions.map((suggestion) => (
                            <ListItem
                                key={suggestion.id}
                                button="true"
                                onClick={() => handleAddParticipantFromSuggestion(suggestion)}
                                sx={{ padding: '8px 16px', '&:hover': { backgroundColor: 'rgba(211, 84, 36)' } }}
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
                    Submit Participants
                </Button>
            </Box>
        </Modal>
    );
};

export default ParticipantsModal;
