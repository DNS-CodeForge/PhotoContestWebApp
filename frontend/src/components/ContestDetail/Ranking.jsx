import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function ContestDetails({rankedUsers, submissions, juryCount}) {


    const getReviewsCount = (user) => {
        const userId = user.userId;
        const submission = submissions.find(submission => submission.creator.id === userId);
        return submission && submission.photoReviews ? submission.photoReviews.length : 0;
    };


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            sx={{
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
            }}
        >
            <List
                sx={{width: '100%', maxWidth: '100%', bgcolor: 'transparent', padding: '0 0'}}
                subheader={
                    <ListSubheader
                        component="div"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderTopRightRadius: '12px',
                            borderTopLeftRadius: '12px',
                        }}
                    >
                        <Typography sx={{width: '10%', textAlign: 'center'}}>Rank</Typography>
                        <Typography sx={{width: '30%', textAlign: 'center'}}>Username</Typography>
                        <Typography sx={{width: '20%', textAlign: 'center'}}>Submissions</Typography>
                        <Typography sx={{width: '20%', textAlign: 'center'}}>Reviews</Typography>
                        <Typography sx={{width: '20%', textAlign: 'center'}}>Points</Typography>
                    </ListSubheader>
                }
            >
                {rankedUsers.map((user, index) => (
                    <ListItem
                        key={user.username}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            padding: '10px',
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                cursor: 'pointer',
                            },
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <Typography sx={{width: '10%'}}>{index + 1}</Typography>
                        <Typography sx={{width: '30%'}}>{user.username}</Typography>
                        <Typography sx={{width: '20%'}}>
                            <Link href="#" underline="hover" color="inherit">
                                View Submission
                            </Link>
                        </Typography>

                        <Typography sx={{width: '20%'}}>
                            {getReviewsCount(user)}/{juryCount}
                        </Typography>
                        <Typography sx={{width: '20%'}}>{user.points}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
