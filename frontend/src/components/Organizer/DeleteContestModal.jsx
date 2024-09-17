import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { refreshTokenIfNecessary } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const DeleteContestModal = ({ onClose, contest }) => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        if (confirmText === 'confirm') {
            setLoading(true);
            try {
                const tokenRefreshSuccess = await refreshTokenIfNecessary(navigate);
                if (!tokenRefreshSuccess) return;

                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${BACKEND_BASE_URL}api/contest/${contest.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to delete contest');
                console.log('Response:', response);
                onClose(); // Close the modal after deletion
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <Modal onClose={onClose}>
            <Box sx={{ padding: '2rem', backgroundColor: 'black', color: 'white' }}>
                <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                    Are you sure you want to delete the contest &quot;{contest.title}&quot;?
                </Typography>
                <Typography sx={{ marginBottom: '1rem' }}>
                    Type &quot;confirm&quot; to proceed.
                </Typography>
                <TextField
                    variant="outlined"
                    label="Type 'confirm'"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    sx={{
                        marginBottom: '1rem',
                        width: '100%',
                        input: { color: 'white' }, // Text color inside the TextField
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white', // Border color
                            },
                            '&:hover fieldset': {
                                borderColor: 'gray', // Border color on hover
                            },
                        },
                        '& label': { color: 'white' } // Label color
                    }}
                />
                {loading ? (
                    <CircularProgress sx={{ color: 'white' }} />
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'gray', color: 'white', marginRight: '1rem' }} // Button color
                            onClick={handleDelete}
                            disabled={confirmText !== 'confirm'}
                        >
                            Delete
                        </Button>
                        <Button variant="outlined" onClick={onClose} sx={{ color: 'white' }}>
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default DeleteContestModal;
