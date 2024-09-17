import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import JurySubmissionView from '../components/Jury/JurySubmissionView';
import { getId } from "../utils/jwtUtils.jsx";
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const JuryPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmissions = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Unauthorized: No access token found');
            }

            const response = await fetch(`${BACKEND_BASE_URL}api/jury/submissions`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            const userId = getId(accessToken);

            const filteredSubmissions = data.filter(submission =>
                !submission.reviewedByJuryIds.includes(parseInt(userId)) && submission.active
            );

            setSubmissions(filteredSubmissions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handleReviewSuccess = () => {
        fetchSubmissions();
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#282c34',
                    color: 'white',
                }}
            >
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#282c34',
                    color: 'white',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (submissions.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#282c34',
                    color: 'white',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    No Submissions Currently Await Reviewing
                </Typography>
            </Box>
        );
    }

    return (
        <JurySubmissionView
            itemData={submissions}
            onReviewSuccess={handleReviewSuccess}
        />
    );
};

export default JuryPage;
