import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Pagination, Stack, Modal } from '@mui/material';
import ContestInfoModal from './ContestInfoModal';
import JudgesModal from './JudgesModal';
import ParticipantsModal from './ParticipantsModal';
import CreateContest from '../Forms/CreateContest';
import DeleteContestModal from './DeleteContestModal'; // Import the delete modal
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
    const [selectedContest, setSelectedContest] = useState(null);
    const [selectedJudgesContest, setSelectedJudgesContest] = useState(null);
    const [selectedParticipantsContest, setSelectedParticipantsContest] = useState(null);
    const [selectedDeleteContest, setSelectedDeleteContest] = useState(null); // State for the contest to delete
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const [openJudgesModal, setOpenJudgesModal] = useState(false);
    const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // State for delete modal
    const [modalUpdate, setModalUpdate] = useState(false); // State to trigger re-fetch

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
    }, [currentPage, modalUpdate]);

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setModalUpdate(!modalUpdate); // Toggle to trigger re-fetch
    };

    const handleViewContestInfo = (contest) => {
        setSelectedContest(contest);
    };

    const handleCloseInfoModal = () => {
        setSelectedContest(null);
        setModalUpdate(!modalUpdate); // Toggle to trigger re-fetch
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
        setSelectedJudgesContest(contest);
        setOpenJudgesModal(true);
    };

    const handleCloseJudgesModal = () => {
        setOpenJudgesModal(false);
        setSelectedJudgesContest(null);
        setModalUpdate(!modalUpdate); // Toggle to trigger re-fetch
    };

    const handleOpenParticipantsModal = (contest) => {
        setSelectedParticipantsContest(contest);
        setOpenParticipantsModal(true);
    };

    const handleCloseParticipantsModal = () => {
        setOpenParticipantsModal(false);
        setSelectedParticipantsContest(null);
        setModalUpdate(!modalUpdate); // Toggle to trigger re-fetch
    };

    const handleOpenDeleteModal = (contest) => {
        setSelectedDeleteContest(contest); // Set the contest to delete
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedDeleteContest(null);
        setModalUpdate(!modalUpdate); // Toggle to trigger re-fetch
    };

    const addJudge = (judge) => {
        const updatedContest = {
            ...selectedJudgesContest,
            jury: [...selectedJudgesContest.jury, judge],
        };
        setSelectedJudgesContest(updatedContest);
    };

    const addParticipant = (participant) => {
        const updatedContest = {
            ...selectedParticipantsContest,
            participants: [...selectedParticipantsContest.participants, participant],
        };
        setSelectedParticipantsContest(updatedContest);
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
                                        {contest.private && ( // Show Invite button only for private contests
                                            <Button
                                                variant="outlined"
                                                sx={{ color: 'white', borderColor: 'orange' }}
                                                onClick={() => handleOpenParticipantsModal(contest)}
                                            >
                                                Participants
                                            </Button>
                                        )}
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
                                    onClick={() => handleOpenDeleteModal(contest)} // Open delete modal
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

            {/* Delete Modal */}
            {openDeleteModal && selectedDeleteContest && (
                <DeleteContestModal
                    onClose={handleCloseDeleteModal}
                    contest={selectedDeleteContest}
                />
            )}
        </Box>
    );
};

export default OrganizerContestPage;
