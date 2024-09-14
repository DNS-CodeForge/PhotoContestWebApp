import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery } from '@mui/material';

export default function SubmissionsList({itemData}) {

  const isSmallScreen = useMediaQuery('(max-width: 425px)');
  const isMediumScreen = useMediaQuery('(max-width: 770px)');
  const isTabletScreen = useMediaQuery('(max-width: 1024px)');
  const is1440pxScreen = useMediaQuery('(max-width: 1440px)');
  const is1920pxScreen = useMediaQuery('(max-width: 1920px)');
  const is2560pxScreen = useMediaQuery('(min-width: 2560px)');


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
            <ImageListItem key={item.id}>
              <img
                  srcSet={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.photoUrl}?w=225&h=225&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
              />
            </ImageListItem>
        ))}
      </ImageList>
  );
}
