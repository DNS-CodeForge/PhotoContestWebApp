import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Pagination, Modal, Stack } from '@mui/material';
import ContestInfoModal from './ContestInfoModal';
import JudgesModal from './JudgesModal'; // Import JudgesModal
import ParticipantsModal from './ParticipantsModal'; // Import ParticipantsModal
import CreateContest from '../Forms/CreateContest';
import { refreshTokenIfNecessary } from '../../utils/authUtils';
import { arrayToDate } from '../../utils/dateUtils';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const OrganizerContestPage = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null); // Used for Info modal only
    const [selectedJudgesContest, setSelectedJudgesContest] = useState(null); // Separate state for Judges modal
    const [selectedParticipantsContest, setSelectedParticipantsContest] = useState(null); // Separate state for Participants modal
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Modal state for Judges and Participants
    const [openJudgesModal, setOpenJudgesModal] = useState(false);
    const [openParticipantsModal, setOpenParticipantsModal] = useState(false);

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
        setSelectedContest(contest); // Open the Info modal by setting selectedContest
    };

    const handleCloseInfoModal = () => {
        setSelectedContest(null); // Close Info modal
    };

    const handlePageChange = (event, value) => {
        navigate(`/organizer/page/${value}`);
    };

    const isBeforeStartDate = (startDate) => {
        const now = moment();
        const formattedStartDate = arrayToDate(startDate);
        return now.isBefore(formattedStartDate);
    };

    const handleOpenJudgesModal = (contest) => {
        setSelectedJudgesContest(contest); // Set contest for Judges modal
        setOpenJudgesModal(true); // Open Judges modal
    };

    const handleCloseJudgesModal = () => {
        setOpenJudgesModal(false); // Close Judges modal
        setSelectedJudgesContest(null); // Clear selected contest for Judges modal
    };

    const handleOpenParticipantsModal = (contest) => {
        setSelectedParticipantsContest(contest); // Set contest for Participants modal
        setOpenParticipantsModal(true); // Open Participants modal
    };

    const handleCloseParticipantsModal = () => {
        setOpenParticipantsModal(false); // Close Participants modal
        setSelectedParticipantsContest(null); // Clear selected contest for Participants modal
    };

    const addJudge = (judge) => {
        const updatedContest = {
            ...selectedJudgesContest,
            jury: [...selectedJudgesContest.jury, judge],
        };
        setSelectedJudgesContest(updatedContest); // Update the contest for the Judges modal
    };

    const addParticipant = (participant) => {
        const updatedContest = {
            ...selectedParticipantsContest,
            participants: [...selectedParticipantsContest.participants, participant],
        };
        setSelectedParticipantsContest(updatedContest); // Update the contest for the Participants modal
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
                            <Stack direction="row" spacing={2}>
                                {isBeforeStartDate(contest.startDate) && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            sx={{ color: 'white', borderColor: 'orange' }}
                                            onClick={() => handleOpenJudgesModal(contest)}
                                        >
                                            Judges
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{ color: 'white', borderColor: 'orange' }}
                                            onClick={() => handleOpenParticipantsModal(contest)}
                                        >
                                            Participants
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'orange' }}
                                    onClick={() => handleViewContestInfo(contest)}
                                >
                                    Info
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'orange' }}
                                    onClick={() => handleViewContestInfo(contest)}
                                >
                                    Delete
                                </Button>
                            </Stack>
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

            {/* Info Modal */}
            {selectedContest && (
                <ContestInfoModal selectedContest={selectedContest} handleCloseInfoModal={handleCloseInfoModal} />
            )}

            {/* Judges Modal */}
            {selectedJudgesContest && (
                <JudgesModal
                    open={openJudgesModal}
                    onClose={handleCloseJudgesModal}
                    judges={selectedJudgesContest.jury}
                    addJudge={addJudge}
                    contestId={selectedJudgesContest.id}
                />
            )}

            {/* Participants Modal */}
            {selectedParticipantsContest && (
                <ParticipantsModal
                    open={openParticipantsModal}
                    onClose={handleCloseParticipantsModal}
                    participants={selectedParticipantsContest.participants}
                    addParticipant={addParticipant}
                />
            )}
        </Box>
    );
};

export default OrganizerContestPage;
