import { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import { getId } from '../../utils/jwtUtils';

export default function ContestJoinButton({ onClick, contest, phase }) {
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
        if (userId) {
            const submission = contest.photoSubmissions.find(sub => sub.creator.id === userId);
            setUserSubmission(submission);

            const participant = contest.participants.some(participant => participant.id === userId);
            setIsParticipant(participant);
        }
    }, [userId, contest]);


    if (contest.organizer.id === userId) {
        return <EditContestButton onClick={onClick} />;
    }


    if (phase !== 'Submission') {
        return <></>;
    }

    // Handle private contests
    if (contest.private) {
        if (!isParticipant) {

            return (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: '#ffffff',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        padding: '0.8rem 2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                        '&:active': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        },
                    }}
                >
                    <LockIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.5rem', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                        Invite only
                    </Typography>
                </Box>
            );
        } else if (!userSubmission) {

            return <JoinContestButton onClick={onClick} />;
        } else {

            return <EditSubmissionButton onClick={onClick} />;
        }
    } else {

        if (!userSubmission) {

            return <JoinContestButton onClick={onClick} />;
        } else {

            return <EditSubmissionButton onClick={onClick} />;
        }
    }
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
                '&:active': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
                '&:active': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
            }}
            startIcon={<EditIcon />}
            onClick={onClick}
        >
            Edit Submission
        </Button>
    );
}

function EditContestButton({ onClick }) {
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
                '&:active': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
            }}
            startIcon={<EditIcon />}
            onClick={onClick}
        >
            Edit Contest
        </Button>
    );
}
