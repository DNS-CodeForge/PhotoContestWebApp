import { Typography, Box} from '@mui/material'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export default function ContestInfo ({contest}) {
    console.log(contest);
 const formattedEndDate = new Date(contest.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
    return (
        <Box display={"flex"} flexDirection={"column"} textAlign={"center"} height={"30vh"} marginBottom={"-4rem"}>
            <Typography variant='h4'>{contest.title}</Typography>
            <Typography variant='h5'>Category: {contest.category}</Typography>
             <Box display={"flex"} marginTop={"auto"} justifyContent={"space-evenly"}>
             <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <BorderColorIcon sx={{height:"3rem", width: "3rem"}}/>
           <Typography variant='h5'> Photo reviewers count: {contest.jury.length}</Typography>
            </Box>
           <Box display={"flex"} alignItems={"center"}justifyContent={"center"} >
            <InsertPhotoIcon sx={{height:"3rem", width: "3rem"}}/>
            <Typography variant='h5' textAlign={"center"}>Submissions count: {contest.photoSubmissions.length}</Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} >
            <WatchLaterIcon sx={{height:"3rem", width: "3rem"}}/>
            <Typography variant='h5' textAlign={"center"}>Ends: {formattedEndDate}</Typography>
            </Box>


             </Box>

        </Box>
    );
}

