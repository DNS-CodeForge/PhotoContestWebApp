import { Typography, Box } from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { arrayToDate, formatDate } from "../../utils/dateUtils.jsx";

export default function ContestRules({ contest }) {
    const startDate = arrayToDate(contest.startDate);
    const submissionEndDate = arrayToDate(contest.submissionEndDate);
    const endDate = arrayToDate(contest.endDate);

    const formattedStartDate = formatDate(startDate);
    const formattedSubmissionEndDate = formatDate(submissionEndDate);
    const formattedEndDate = formatDate(endDate);

    return (
        <Box sx={{ padding: '2rem' }}> {/* Added padding to the container */}
            <Typography variant="h4" sx={{ marginBottom: '1.2rem', fontSize: '2rem', fontFamily: 'serif', fontWeight: 'bold' }}>
                Contest Rules
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: '2rem' }}>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Use only personal photos.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Follow the approved format and resolution.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Respect all users and their submissions.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Ensure fair play in the voting process.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Adhere to the contest category.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        The photo story does not have to be real; it could be a thought or statement describing the photo.
                    </Typography>
                </Box>

                {/* New rule for submissions */}
                <Box display="flex" alignItems="center">
                    <RuleIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Submissions can be edited only during the submission phase and before any reviews are made.
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h4" sx={{ marginBottom: '1.2rem', fontSize: '2rem', fontFamily: 'serif', fontWeight: 'bold' }}>
                Contest Stages
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: '2rem' }}>

                <Box display="flex" alignItems="center">
                    <PlayArrowIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Start Date: {formattedStartDate}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <FileUploadIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Submission Ends: {formattedSubmissionEndDate}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <HowToVoteIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Voting starts after submissions close.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <EmojiEventsIcon sx={{ height: "2rem", width: "2rem", marginRight: '0.8rem' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                        Final Rankings available after the contest ends on: {formattedEndDate}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
