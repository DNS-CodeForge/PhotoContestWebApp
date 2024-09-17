import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dialog, Button, Box, Typography } from '@mui/material';
import ReviewForm from '../Forms/ReviewForm';

export default function JurySubmissionView({ itemData, onReviewSuccess }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);

    const navigate = useNavigate();

    const handleImageClick = (index) => {
        setSelectedImage(itemData[index]);
        setCurrentIndex(index);
        setIsReviewing(false);
    };

    const handleClose = () => {
        setSelectedImage(null);
        setCurrentIndex(null);
        setIsReviewing(false);
    };

    const handleViewContest = () => {
        if (selectedImage) {
            const contestId = selectedImage.contestId;
            navigate(`/contest/${contestId}`);
        }
    };

    const handleReviewSubmission = () => {
        setIsReviewing(true);
    };

    const handleReviewSubmitSuccess = (newReview) => {
        onReviewSuccess(newReview);
        handleClose();
    };

    return (
        <>
            <ImageList cols={6} gap={4} sx={{ margin: '1rem' }}>
                {itemData.map((item, index) => (
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
                        {!isReviewing ? (
                            <>
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
                            </>
                        ) : (
                            <ReviewForm
                                submissionId={selectedImage.id}
                                onClose={handleClose}
                                onSubmitSuccess={handleReviewSubmitSuccess}
                            />
                        )}
                    </Box>
                )}
            </Dialog>
        </>
    );
}
