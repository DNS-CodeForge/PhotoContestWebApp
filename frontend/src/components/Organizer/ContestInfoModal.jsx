import React from 'react';
import { Box, Typography, Modal } from '@mui/material';
import { formatDate, arrayToDate } from '../../utils/dateUtils.jsx';

const ContestInfoModal = ({ selectedContest, handleCloseInfoModal }) => {
    return (
        <Modal open={!!selectedContest} onClose={handleCloseInfoModal}>
            <Box sx={{ padding: '2rem', backgroundColor: 'black', borderRadius: '8px', margin: '10vh auto', width: '40vw' }}>
                <Typography variant="h5" gutterBottom>
                    Contest Information
                </Typography>

                <Typography><strong>Title:</strong> {selectedContest.title}</Typography>
                <Typography><strong>Category:</strong> {selectedContest.category}</Typography>
                <Typography><strong>Private:</strong> {selectedContest.private ? 'Yes' : 'No'}</Typography>
                <Typography><strong>Start Date:</strong> {formatDate(arrayToDate(selectedContest.startDate))}</Typography>
                <Typography><strong>End Date:</strong> {formatDate(arrayToDate(selectedContest.endDate))}</Typography>
                <Typography><strong>Submission End Date:</strong> {formatDate(arrayToDate(selectedContest.submissionEndDate))}</Typography>

                <Typography variant="h6" sx={{ marginTop: '1rem' }}>Participants</Typography>
                {selectedContest.participants.length > 0 ? (
                    <Box>
                        {selectedContest.participants.map((participant, index) => (
                            <Typography key={index}>{participant.firstName} {participant.lastName} (Rank: {participant.rank})</Typography>
                        ))}
                    </Box>
                ) : (
                    <Typography>No participants yet.</Typography>
                )}

                <Typography variant="h6" sx={{ marginTop: '1rem' }}>Jury</Typography>
                {selectedContest.jury.length > 0 ? (
                    <Box>
                        {selectedContest.jury.map((juryMember, index) => (
                            <Typography key={index}>{juryMember.firstName} {juryMember.lastName} (Rank: {juryMember.rank})</Typography>
                        ))}
                    </Box>
                ) : (
                    <Typography>No jury members yet.</Typography>
                )}

            </Box>
        </Modal>
    );
};

export default ContestInfoModal;
