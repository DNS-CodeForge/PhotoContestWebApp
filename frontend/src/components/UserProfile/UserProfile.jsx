
import React, { useEffect, useState } from 'react';
import { decodeToken } from '../../utils/jwtUtils';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SubmissionsList from '../ContestDetail/SubmissionsList';
import ContestList from '../ContestList/ContestList';
import { WidthFull } from '@mui/icons-material';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('submissions'); // New state for tab selection

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const decoded = decodeToken(token);

                if (decoded) {
                    const response = await fetch(`${BACKEND_BASE_URL}api/user/${decoded.userId}/resources`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await response.json();
                    setUserData(data);
                    console.log(data);
                } else {
                    throw new Error('Failed to decode token');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        console.log(userData);
    }, []);

    if (loading) {
        return (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                <CircularProgress color="gray" />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    const buttonStyle = (tab) => ({
        fontSize: '1rem',
        backgroundColor: selectedTab === tab ? '#393E46' : '#282c34',
        border: 'none',
         borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        padding: '10px 20px',
        margin: '0 5px',
        color: '#fff',
        width: '100%'
    });

    return (
        <>
            <Box display={"flex"} sx={{ backgroundColor: '#393E46' }} height={"12rem"} marginTop={"10rem"} flexDirection={'row'} justifyContent={"space-around"} alignItems={"center"}>

                <Box display={"flex"} flexDirection={"column"} padding={"5px"} marginLeft={"1rem"} sx={{ borderRadius: '12px', backgroundColor: '#282c34', width: '20rem', height: '10rem' }}>
                    <Typography variant='p'> First name: {userData.userProfile.firstName}</Typography>
                    <Typography variant='p'> Last name: {userData.userProfile.lastName}</Typography>
                    <Typography variant='p'> Email: {userData.email}</Typography>
                </Box>

                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Avatar sx={{ width: '10rem', height: '10rem', marginTop: '-8rem' }} />
                    <Typography marginTop={"0.2rem"} variant='p'>{userData.userProfile.rank || 'N/A'}</Typography>
                    <Typography marginTop={"0.2rem"} variant='h4'>{userData.username}</Typography>
                </Box>

                <Box display={"flex"} flexDirection={"column"} padding={"5px"} marginRight={"1rem"} sx={{ borderRadius: '12px', backgroundColor: '#282c34', width: '20rem', height: '10rem' }}>
                    <Typography variant='p'> Points: {userData.userProfile.points}</Typography>
                </Box>
            </Box>

            <Box display={'flex'} justifyContent={'center'}>
                <Button
                    sx={buttonStyle('submissions')}
                    onClick={() => setSelectedTab('submissions')}
                >
                    Submissions
                </Button>
                <Button
                    sx={buttonStyle('contests')}
                    onClick={() => setSelectedTab('contests')}
                >
                    Contests
                </Button>
            </Box>

            <Box sx={{ marginTop: '5px' }}>
                {selectedTab === 'submissions' && <SubmissionsList itemData={userData.submissions} />}
                {selectedTab === 'contests' && <ContestList contests={userData.contests}/>}
            </Box>
        </>
    );
}

