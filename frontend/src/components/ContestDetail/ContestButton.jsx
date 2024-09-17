import { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { getId } from '../../utils/jwtUtils';

export default function ContestButton({ contest, phase, submissions, setShowJoinModal, setShowEditModal }) {
    const [userId, setUserId] = useState(null);
    const [userSubmission, setUserSubmission] = useState(null);
    const [isParticipant, setIsParticipant] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const id = getId(accessToken);
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        if (userId && submissions) {
            const submission = submissions.find(sub => sub?.creator?.id === userId);
            setUserSubmission(submission);
            const participant = contest?.participants?.some(participant => participant.id === userId);
            setIsParticipant(participant);
        }
    }, [userId, submissions, contest]);

    if (!contest || !userId) {
        return null;
    }

    if (contest.organizer.id === userId) {
        return <EditContestButton contestId={contest.id} />;
    }

    if (phase !== 'Submission') {
        return null;
    }

    if (contest.private && !isParticipant) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: '#a0a0a0',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    padding: '0.8rem 2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    textTransform: 'uppercase',
                    cursor: 'not-allowed',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <LockIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem' }} />
                <Typography variant="body2" sx={{ fontSize: '1.5rem', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                    Invite Only
                </Typography>
            </Box>
        );
    }

    if (!userSubmission) {
        return <JoinContestButton onClick={() => setShowJoinModal(true)} />;
    }

    if (userSubmission?.photoReviews?.length > 0) {
        return null;
    }

    return <EditSubmissionButton onClick={() => setShowEditModal(true)} />;
}

function EditContestButton() {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/organizer`);
    };

    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                textTransform: 'uppercase',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
            }}
            startIcon={<EditIcon />}
            onClick={handleEditClick}
        >
            Edit Contest
        </Button>
    );
}

function JoinContestButton({ onClick }) {
    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                textTransform: 'uppercase',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
            }}
            startIcon={<InsertPhotoIcon />}
            onClick={onClick}
        >
            Join Contest
        </Button>
    );
}

function EditSubmissionButton({ onClick }) {
    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                textTransform: 'uppercase',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
            }}
            startIcon={<EditIcon />}
            onClick={onClick}
        >
            Edit Submission
        </Button>
    );
}
