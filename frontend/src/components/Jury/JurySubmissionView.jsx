import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dialog, Button, Box, Typography } from '@mui/material';
import { getId } from '../../utils/jwtUtils';

export default function JurySubmissionView({ itemData }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const navigate = useNavigate();


    const userId = getId(localStorage.getItem('accessToken'));

    useEffect(() => {

        const submissionsNotReviewedByUser = itemData.filter(item => !item.reviewedByJuryIds.includes(userId));
        setFilteredSubmissions(submissionsNotReviewedByUser);
    }, [itemData, userId]);

    const handleImageClick = (index) => {
        setSelectedImage(filteredSubmissions[index]);

    };

    const handleClose = () => {
        setSelectedImage(null);
        
    };

    const handleViewContest = () => {
        if (selectedImage) {
            const contestId = selectedImage.contestId;
            navigate(`/contest/${contestId}`);
        }
    };

    const handleReviewSubmission = () => {
        const submissionId = selectedImage.id;
        console.log(`Review submission with id: ${submissionId}`);

    };

    return (
        <>

            <ImageList cols={6} gap={4} sx={{ margin: '1rem' }}>
                {filteredSubmissions.map((item, index) => (
                    <ImageListItem
                        key={item.id}
                        onClick={() => handleImageClick(index)}
                        sx={{ position: 'relative', cursor: 'pointer' }}
                    >
                        <img
                            srcSet={`${item.photoUrl}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.photoUrl}?w=150&h=150&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                            style={{ display: 'block', width: '100%', height: '100%' }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>


            <Dialog
                open={!!selectedImage}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: '#1c1c1e',
                        color: '#fff',
                    },
                }}
            >
                {selectedImage && (
                    <Box
                        position="relative"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            padding: '2rem',
                            flexDirection: 'column',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src={selectedImage.photoUrl}
                            alt={selectedImage.title}
                            style={{
                                maxWidth: '80%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                            }}
                        />

                        <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                            {selectedImage.title}
                        </Typography>

                        <Typography variant="body2" sx={{ marginTop: '0.5rem', color: '#f4b400' }}>
                            {selectedImage.story}
                        </Typography>


                        <Typography variant="body2" sx={{ marginTop: '0.5rem', color: '#f4b400' }}>
                            Reviewed by {selectedImage.reviewedByJuryIds.length} jury members
                        </Typography>


                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '2rem',
                                right: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleViewContest}
                                sx={{ backgroundColor: '#502e0e', width: '150px' }}
                            >
                                View Contest
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleReviewSubmission}
                                sx={{ backgroundColor: '#ff4646', width: '150px' }}
                            >
                                Review
                            </Button>
                        </Box>
                    </Box>
                )}
            </Dialog>
        </>
    );
}
