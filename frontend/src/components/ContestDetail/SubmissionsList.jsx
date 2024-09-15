import React, { useState } from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery, Dialog, IconButton, Box } from '@mui/material';
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
    setSelectedImage(itemData[index].photoUrl);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
    setCurrentIndex(null);
  };

  const handleNext = () => {
    if (currentIndex < itemData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(itemData[currentIndex + 1].photoUrl);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(itemData[currentIndex - 1].photoUrl);
    }
  };

  return (
    <>
      <ImageList cols={cols} gap={8} sx={{ margin: '1rem' }}>
        {itemData.map((item, index) => (
          <ImageListItem key={item.id} onClick={() => handleImageClick(index)}>
            <img
              srcSet={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{ cursor: "pointer" }} 
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog open={!!selectedImage} onClose={handleClose} fullWidth maxWidth="lg">
        {selectedImage && (
          <Box position="relative" display="flex" justifyContent="center" alignItems="center">
            <img src={selectedImage} alt="Fullscreen" style={{ width: '100%', height: 'auto' }} />

            {currentIndex > 0 && (
              <IconButton
                onClick={handlePrevious}
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
              >
                <ArrowBackIosIcon fontSize="large" />
              </IconButton>
            )}

            {currentIndex < itemData.length - 1 && (
              <IconButton
                onClick={handleNext}
                style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
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
