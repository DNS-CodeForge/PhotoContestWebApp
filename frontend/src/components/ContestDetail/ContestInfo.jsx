import { Typography, Box, Button} from '@mui/material'

export default function ContestInfo ({contest}) {
    console.log(contest);
    return (
        <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
            <Typography variant='h4'>{contest.title}</Typography>
            <Typography variant='h5'>Category: {contest.category}</Typography>
            <Typography variant='h5'>Participants count: {contest.participants.length}</Typography>
            <Typography variant='h5'>Jury count: {contest.jury.length}</Typography>
               <Button
                  sx={{maxWidth:'10rem'}}
                  variant="contained"
                  color='success'
                  onClick={() => {
                    alert('clicked');
                  }}
                >
                  Join Contest
                </Button>
        </Box>
    );
}

