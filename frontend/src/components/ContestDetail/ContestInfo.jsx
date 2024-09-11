import { Typography, Box } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PetsIcon from '@mui/icons-material/Pets';
import BrushIcon from '@mui/icons-material/Brush';
import GavelIcon from '@mui/icons-material/Gavel';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DoneIcon from '@mui/icons-material/Done';

export default function ContestInfo({ contest }) {
    const currentDate = new Date();
    const startDate = new Date(contest.startDate);
    const submissionEndDate = new Date(contest.submissionEndDate);
    const endDate = new Date(contest.endDate);

    const formattedStartDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const formattedSubmissionEndDate = submissionEndDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const formattedEndDate = endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    let phase = "";
    let phaseIcon = null;
    let phaseDate = "";

    if (currentDate < startDate) {
        phase = "Start";
        phaseIcon = <PlayArrowIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />;
        phaseDate = formattedStartDate;
    } else if (currentDate >= startDate && currentDate < submissionEndDate) {
        phase = "Submission";
        phaseIcon = <FileUploadIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />;
        phaseDate = formattedSubmissionEndDate;
    } else if (currentDate >= submissionEndDate && currentDate < endDate) {
        phase = "Reviewing";
        phaseIcon = <RateReviewIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />;
        phaseDate = formattedEndDate;
    } else if (currentDate >= endDate) {
        phase = "Finished";
        phaseIcon = <DoneIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />;
        phaseDate = formattedEndDate;
    }

    const categoryIcons = {
        LANDSCAPE: <LandscapeIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />,
        PORTRAIT: <PersonIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />,
        STREET: <LocationCityIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />,
        WILDLIFE: <PetsIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />,
        ABSTRACT: <BrushIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />
    };

    return (
        <>
            <Typography variant="h4" sx={{ marginBottom: '1.2rem', fontSize: '2rem', fontFamily: 'serif', fontWeight: 'bold' }}>
                {contest.title}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: '2rem' }}>
                <Box display="flex" alignItems="center" justifyContent="left">
                    {categoryIcons[contest.category] || <InsertPhotoIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />}
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{contest.category}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <GavelIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Jury: {contest.jury.length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <InsertPhotoIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Entries: {contest.photoSubmissions.length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    {phaseIcon}
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{phase}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <WatchLaterIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem', marginLeft:'0.8rem'}} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{phaseDate}</Typography>
                </Box>
            </Box>
        </>
    );
}
