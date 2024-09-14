import React, { useEffect, useState } from 'react';
import { decodeToken } from '../../utils/jwtUtils';
import { Box, Typography, CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SubmissionsList from '../ContestDetail/SubmissionsList';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;


export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const decoded = decodeToken(token);

                if (decoded) {
                    const response = await fetch(`${BACKEND_BASE_URL}api/user/${decoded.userId}`, {
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

    return (
        <>
        <Box display={"flex"} marginTop={"10rem"} sx={{ backgroundColor: '#393E46' }} height={"15rem"} flexDirection={'column'} alignItems={"center"}>
            <Avatar sx={{ width: '10rem', height: '10rem', marginTop: '-5rem' }} />
            <Box display={"flex"} flexDirection={"column"}>
                <Typography marginTop={"0.2rem"} variant='p'>{userData?.rank || 'N/A'}</Typography>
            </Box>
        </Box>
        <SubmissionsList/>
        </>
    );
}

