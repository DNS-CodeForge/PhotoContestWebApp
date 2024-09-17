import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Pagination, Modal } from '@mui/material';
import ContestInfoModal from './ContestInfoModal';
import CreateContest from '../Forms/CreateContest';
import { refreshTokenIfNecessary } from '../../utils/authUtils';
import { useNavigate, useParams } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const OrganizerContestPage = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const navigate = useNavigate();
    const { page } = useParams();
    const currentPage = Number(page) || 1;

    const fetchOrganizerContests = async (page = 1) => {
        try {
            const tokenRefreshSuccess = await refreshTokenIfNecessary(navigate);
            if (!tokenRefreshSuccess) return;

            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_BASE_URL}api/contest/organizer?page=${page - 1}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch contests');

            const data = await response.json();
            setContests(data.content || []);
            setTotalPages(data.totalPages || 1);

            if (currentPage > data.totalPages) {
                navigate(`/organizer/page/${data.totalPages}`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizerContests(currentPage);
    }, [currentPage]);

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleViewContestInfo = (contest) => {
        setSelectedContest(contest);
    };

    const handleCloseInfoModal = () => {
        setSelectedContest(null);
    };

    const handlePageChange = (event, value) => {
        navigate(`/organizer/page/${value}`);
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
        <Box sx={{ padding: '2rem', backgroundColor: 'transparent', width: '96vw', margin: '5vh auto' }}>
            <Typography variant="h4" sx={{ color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
                Organized Contests
            </Typography>
            <Button
                variant="contained"
                sx={{ marginBottom: '2rem', color: 'white', backgroundColor: 'orange' }}
                onClick={handleOpenCreateModal}
            >
                Create Contest
            </Button>
            <Box>
                {contests.length > 0 ? (
                    contests.map((contest) => (
                        <Box
                            key={contest.id}
                            sx={{
                                marginBottom: '1rem',
                                padding: '1rem',
                                border: '1px solid white',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography sx={{ color: 'white' }}>{contest.title}</Typography>
                            <Button
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'orange' }}
                                onClick={() => handleViewContestInfo(contest)}
                            >
                                View Info
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ color: 'white', textAlign: 'center' }}>No contests available</Typography>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
            {showCreateModal && (
                <Modal open={showCreateModal} onClose={handleCloseCreateModal}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CreateContest onClose={handleCloseCreateModal} />
                    </Box>
                </Modal>
            )}
            {selectedContest && (
                <ContestInfoModal selectedContest={selectedContest} handleCloseInfoModal={handleCloseInfoModal} />
            )}
        </Box>
    );
};

export default OrganizerContestPage;
