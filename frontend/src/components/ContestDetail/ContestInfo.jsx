import { Typography, Box } from '@mui/material';

export default function ContestInfo ({contest}) {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant='h4'>{contest.title}</Typography>
            <Typography variant='h5'>Category: {contest.category}</Typography>
        </Box>
    );
}
