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
import ContestButton from './ContestButton';
import { arrayToDate, formatDate } from '../../utils/dateUtils';
import moment from 'moment';

export default function ContestInfo({ contest, setShowJoinModal, setShowEditModal }) {
    const currentDate = moment();
    const startDate = arrayToDate(contest.startDate);
    const submissionEndDate = arrayToDate(contest.submissionEndDate);
    const endDate = arrayToDate(contest.endDate);

    const formattedStartDate = formatDate(startDate);
    const formattedSubmissionEndDate = formatDate(submissionEndDate);
    const formattedEndDate = formatDate(endDate);

    let phase = '';
    let phaseIcon = null;
    let phaseDate = '';


    if (currentDate.isBefore(startDate)) {
        phase = 'Start';
        phaseIcon = <PlayArrowIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />;
        phaseDate = formattedStartDate;
    } else if (currentDate.isSameOrAfter(startDate) && currentDate.isBefore(submissionEndDate)) {
        phase = 'Submission';
        phaseIcon = <FileUploadIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />;
        phaseDate = formattedSubmissionEndDate;
    } else if (currentDate.isSameOrAfter(submissionEndDate) && currentDate.isBefore(endDate)) {
        phase = 'Reviewing';
        phaseIcon = <RateReviewIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />;
        phaseDate = formattedEndDate;
    } else if (currentDate.isSameOrAfter(endDate)) {
        phase = 'Finished';
        phaseIcon = <DoneIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />;
        phaseDate = formattedEndDate;
    }

    const categoryIcons = {
        LANDSCAPE: <LandscapeIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />,
        PORTRAIT: <PersonIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />,
        STREET: <LocationCityIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />,
        WILDLIFE: <PetsIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />,
        ABSTRACT: <BrushIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />,
    };

    return (
        <>
            <Typography variant="h4" sx={{ marginBottom: '1.2rem', fontSize: '2rem', fontFamily: 'serif', fontWeight: 'bold' }}>
                {contest.title}
            </Typography>

            <Box display="flex" flexDirection="column" gap={0} sx={{ marginBottom: '2rem' }}>
                <Box display="flex" alignItems="center" justifyContent="left">
                    {categoryIcons[contest.category] || <InsertPhotoIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />}
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{contest.category}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <GavelIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Jury: {contest.jury.length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <InsertPhotoIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Entries: {contest.photoSubmissions.length}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    {phaseIcon}
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{phase}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="left">
                    <WatchLaterIcon sx={{ height: '2rem', width: '2rem', marginRight: '0.8rem', marginLeft: '0.8rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{phaseDate}</Typography>
                </Box>
            </Box>

            <ContestButton
                contest={contest}
                phase={phase}
                submissions={contest.photoSubmissions}
                setShowJoinModal={setShowJoinModal}
                setShowEditModal={setShowEditModal}
            />
        </>
    );
}
