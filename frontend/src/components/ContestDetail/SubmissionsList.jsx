import React, { useState } from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery, Dialog, IconButton, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function SubmissionsList({ itemData }) {
  const isSmallScreen = useMediaQuery('(max-width: 425px)');
  const isMediumScreen = useMediaQuery('(max-width: 770px)');
  const isTabletScreen = useMediaQuery('(max-width: 1024px)');
  const is1440pxScreen = useMediaQuery('(max-width: 1440px)');
  const is1920pxScreen = useMediaQuery('(max-width: 1920px)');
  const is2560pxScreen = useMediaQuery('(min-width: 2560px)');

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [infoState, setInfoState] = useState({});

  let cols = 6;
  if (isSmallScreen) {
    cols = 2;
  } else if (isMediumScreen) {
    cols = 3;
  } else if (isTabletScreen) {
    cols = 4;
  } else if (is1440pxScreen) {
    cols = 6;
  } else if (is1920pxScreen) {
    cols = 8;
  } else if (is2560pxScreen) {
    cols = 11;
  }

  const handleImageClick = (index) => {
    setSelectedImage(itemData[index]);
    setCurrentIndex(index);
    setInfoState((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleClose = () => {
    setSelectedImage(null);
    setCurrentIndex(null);
    setInfoState((prevState) => ({ ...prevState, [currentIndex]: false }));
  };

  const handleNext = () => {
    if (currentIndex < itemData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(itemData[currentIndex + 1]);
      setInfoState((prevState) => ({ ...prevState, [currentIndex + 1]: false }));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(itemData[currentIndex - 1]);
      setInfoState((prevState) => ({ ...prevState, [currentIndex - 1]: false }));
    }
  };

  const toggleInfo = () => {
    setInfoState((prevState) => ({
      ...prevState,
      [currentIndex]: !prevState[currentIndex],
    }));
  };

  return (
      <>
        <ImageList cols={cols} gap={8} sx={{ margin: '1rem' }}>
          {itemData.map((item, index) => (
              <ImageListItem
                  key={item.id}
                  onClick={() => handleImageClick(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  sx={{ position: 'relative', cursor: 'pointer' }}
              >
                <img
                    srcSet={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                />

                {/* Hover Thumbnail Box */}
                {hoveredIndex === index && (
                    <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transition: 'opacity 0.3s ease',
                        }}
                    >
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2">{item.story}</Typography>
                    </Box>
                )}
              </ImageListItem>
          ))}
        </ImageList>

        <Dialog
            open={!!selectedImage}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
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
                    backgroundColor: 'transparent',
                  }}
                  onClick={toggleInfo}
              >
                <img
                    src={selectedImage.photoUrl}
                    alt="Fullscreen"
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '90vh',
                      height: '90vh',
                      aspectRatio: 'auto',
                      objectFit: 'contain',
                      backgroundColor: 'transparent',
                    }}
                />


                {infoState[currentIndex] && (
                    <Box
                        sx={{
                          position: 'absolute',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          padding: '1rem',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'start',
                          alignItems: 'center',
                          textAlign: 'center',
                          maxWidth: '50vw',
                          maxHeight: '50vh',
                          minWidth: '20vw',
                          minHeight: '10vh',
                          color: '#f4b400',

                          '& > *:nth-of-type(2)': {
                            marginTop: '1vh',
                          }
                        }}
                    >
                      <Typography variant="h6"
                                  sx={{marginBottom: '2vh'}}
                      >{selectedImage.title}</Typography>
                      <Typography
                          variant="body2"
                          sx={{ color: '#f4b400',  fontSize: '16px' }}
                      >
                        {selectedImage.story}
                      </Typography>
                    </Box>
                )}


                {currentIndex > 0 && (
                    <IconButton
                        onClick={handlePrevious}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    >
                      <ArrowBackIosIcon fontSize="large" />
                    </IconButton>
                )}


                {currentIndex < itemData.length - 1 && (
                    <IconButton
                        onClick={handleNext}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    >
                      <ArrowForwardIosIcon fontSize="large" />
                    </IconButton>
                )}
              </Box>
          )}
        </Dialog>
      </>
  );
}
