import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, List, ListItem } from '@mui/material';

const ParticipantsModal = ({ open, onClose, participants, addParticipant }) => {
    const [newParticipant, setNewParticipant] = useState('');

    const handleAddParticipant = () => {
        if (newParticipant.trim()) {
            addParticipant(newParticipant);
            setNewParticipant('');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: '2rem', backgroundColor: 'white', width: '400px', margin: '10vh auto' }}>
                <Typography variant="h6">Participants</Typography>
                <List>
                    {participants.map((participant) => (
                        <ListItem key={participant.id}>
                            {participant.firstName} {participant.lastName} (Rank: {participant.rank}, Points: {participant.points})
                        </ListItem>
                    ))}
                </List>
                <TextField
                    label="Add Participant"
                    variant="outlined"
                    fullWidth
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    sx={{ marginBottom: '1rem' }}
                />
                <Button variant="contained" onClick={handleAddParticipant} fullWidth>
                    Add Participant
                </Button>
            </Box>
        </Modal>
    );
};

export default ParticipantsModal;
