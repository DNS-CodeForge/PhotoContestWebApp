import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery } from '@mui/material';

export default function SubmissionsList() {

  const isSmallScreen = useMediaQuery('(max-width: 425px)');
  const isMediumScreen = useMediaQuery('(max-width: 770px)');
  const isTabletScreen = useMediaQuery('(max-width: 1024px)');
  const is1440pxScreen = useMediaQuery('(max-width: 1440px)');
  const is1920pxScreen = useMediaQuery('(max-width: 1920px)');
  const is2560pxScreen = useMediaQuery('(min-width: 2560px)');

  const itemData = [
    { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'Breakfast' },
    { img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d', title: 'Burger' },
    { img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', title: 'Camera' },
    { img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c', title: 'Coffee' },
    { img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8', title: 'Hats' },
    { img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62', title: 'Honey' },
    { img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6', title: 'Basketball' },
    { img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f', title: 'Fern' },
    { img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25', title: 'Mushrooms' },
    { img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af', title: 'Tomato basil' },
    { img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1', title: 'Sea star' },
    { img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6', title: 'Bike' },
  ];

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

  return (
      <ImageList cols={cols} gap={8} sx={{ margin: '1rem' }}>
        {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                  srcSet={`${item.img}?w=225&h=225&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=225&h=225&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
              />
            </ImageListItem>
        ))}
      </ImageList>
  );
}
