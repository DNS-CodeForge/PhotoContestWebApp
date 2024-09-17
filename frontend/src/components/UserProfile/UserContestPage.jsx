import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Switch, FormControlLabel, Button } from '@mui/material';
import ContestList from '../ContestList/ContestList.jsx';
import { refreshTokenIfNecessary } from '../../utils/authUtils';
import { getContestPhase } from '../../utils/contestUtils';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserContestPage = () => {
    const [contests, setContests] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredContests, setFilteredContests] = useState([]);

    const [contestType, setContestType] = useState('all');
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const navigate = useNavigate();

    const fetchUserContests = async () => {
        try {
            const tokenRefreshSuccess = await refreshTokenIfNecessary(navigate);
            if (!tokenRefreshSuccess) return;

            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_BASE_URL}api/user/contest`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user contests');

            const data = await response.json();
            setContests(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserContests();
    }, []);

    useEffect(() => {
        filterContests();
    }, [contests, contestType, showActiveOnly]);

    const filterContests = () => {
        const filtered = contests.filter(contest => {
            const contestPhase = getContestPhase(contest);
            const isPrivate = contest.private;
            const isActive = contestPhase === 'active';

            if (contestType === 'private' && !isPrivate) return false;
            if (contestType === 'public' && isPrivate) return false;
            if (showActiveOnly && !isActive) return false;

            return true;
        });
        setFilteredContests(filtered);
    };

    const toggleActiveContests = () => {
        setShowActiveOnly(!showActiveOnly);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (

        <Box
            sx={{
                backgroundColor: 'transparent',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                width: '96vw',

                margin: '5vh auto',




            }}
        >
            <Typography variant="h4" sx={{ color: 'white', marginBottom: '2rem' }}>
                My Contests
            </Typography>

            {/* Section Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    margin: '0 auto',
                    maxWidth: '20cw',
                }}
            >
                <Button
                    variant={contestType === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setContestType('all')}
                    sx={{ width: '100px', margin: '0 5px', color: 'white', border: 'none',
                        backgroundColor:"rgba(12,12,12,0.38)"
                    }}
                >
                    All
                </Button>
                <Button
                    variant={contestType === 'private' ? 'contained' : 'outlined'}
                    onClick={() => setContestType('private')}
                    sx={{ width: '100px', margin: '0 5px', color: 'white', border: 'none',
                        backgroundColor:"rgba(12,12,12,0.38)" }}
                >
                    Private
                </Button>
                <Button
                    variant={contestType === 'public' ? 'contained' : 'outlined'}
                    onClick={() => setContestType('public')}
                    sx={{ width: '100px', margin: '0 5px', color: 'white', border: 'none',
                        backgroundColor:"rgba(12,12,12,0.38)" }}
                >
                    Public
                </Button>
            </Box>

            <Box sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showActiveOnly}
                            onChange={toggleActiveContests}
                            color="primary"
                        />
                    }
                    label={showActiveOnly ? 'Show Active' : 'Show All'}
                    sx={{ color: 'white' }}
                />
            </Box>



            <Typography variant="h5" sx={{ color: 'white', marginBottom: '1rem' }}>
                {contestType.charAt(0).toUpperCase() + contestType.slice(1)} Contests
            </Typography>
            <ContestList
                contests={filteredContests}
            />

        </Box>

    );
};

export default UserContestPage;
