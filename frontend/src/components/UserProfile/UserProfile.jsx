import React, { useEffect, useState } from 'react';
import { decodeToken } from '../../utils/jwtUtils';
import { Box, Typography, CircularProgress, Button, Avatar } from '@mui/material';
import SubmissionsList from '../ContestDetail/SubmissionsList';
import ContestList from '../ContestList/ContestList';
import EditProfileForm from '../Forms/EditProfileForm';
import UserReviewPage from './UserReviewPage';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;
import organizerImage from '../../assets/organizer.png';
import rank1Image from '../../assets/rank1.png';
import rank2Image from '../../assets/rank2.png';
import rank3Image from '../../assets/rank3.png';
import rank4Image from '../../assets/rank4.png';

const ranks = [
    { name: 'Junkie', threshold: 0 },
    { name: 'Enthusiast', threshold: 51 },
    { name: 'Master', threshold: 151 },
    { name: 'Dictator', threshold: 1001 }
];



export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('submissions');
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); 

   const handleUpdateUserData = (updatedProfile) => {
        setUserData(prevData => ({
            ...prevData,
            userProfile: {
                ...prevData.userProfile,
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
            }
        }));
    };

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


    const rankAvatars = {
        junkie: rank1Image,
        enthusiast: rank2Image,
        master: rank3Image,
        dictator: rank4Image,
        organizer: organizerImage
    };

    const userAvatar = userData.userProfile.avatar || rankAvatars[userData.userProfile.rank.toLowerCase()] || rank1Image;

    const handleOpenEditProfileModal = () => {
        setIsEditProfileModalOpen(true);
    };

    const handleCloseEditProfileModal = () => {
        setIsEditProfileModalOpen(false);
    };

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

    function getPointsToNextRank() {
        const currentPoints = userData.userProfile.points;
        const currentRank = ranks.find(r => r.name.toLowerCase() === userData.userProfile.rank.toLowerCase());

        if (!currentRank) {
            return 'Unknown Rank';
        }

        const nextRank = ranks.find(r => r.threshold > currentRank.threshold);

        if (!nextRank) {
            return 'Max Rank';
        }

        return nextRank.threshold - currentPoints;
    }

    function getProgressPercentage() {
        const currentRank = ranks.find(r => r.name.toLowerCase() === userData.userProfile.rank.toLowerCase());

        if (!currentRank) return 100;

        const currentPoints = userData.userProfile.points;
        const nextRank = ranks.find(r => r.threshold > currentRank.threshold);

        if (!nextRank) return 100;

        return ((currentPoints - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100;
    }

    return (
        <>

            {isEditProfileModalOpen && <EditProfileForm email={userData.email} firstName={userData.userProfile.firstName} lastName={userData.userProfile.lastName} handleClose={handleCloseEditProfileModal} handleUpdateUserData={handleUpdateUserData}/>}
            <Box display={"flex"} sx={{ backgroundColor: '#393E46' }} height={"12rem"} marginTop={"10rem"} flexDirection={'row'} justifyContent={"space-around"} alignItems={"center"}>
                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} padding={"5px"} marginLeft={"1rem"} sx={{ borderRadius: '12px', backgroundColor: '#282c34', width: '20rem', height: '10rem' }}>
                    <Typography variant='p'> First name: {userData.userProfile.firstName}</Typography>
                    <Typography variant='p'> Last name: {userData.userProfile.lastName}</Typography>
                    <Typography variant='p'> Email: {userData.email}</Typography>

                    <Button variant='contained' sx={{marginTop: '13px', backgroundColor: 'orange'}} onClick={handleOpenEditProfileModal}>Edit Profile</Button>

                </Box>

                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Avatar src={userAvatar} sx={{ width: '10rem', height: '10rem', marginTop: '-8rem' }} />
                    <Typography marginTop={"0.2rem"} variant='p'>{userData.userProfile.rank || 'N/A'}</Typography>
                    <Typography marginTop={"0.2rem"} variant='h3'>{userData.username}</Typography>
                </Box>

                <Box display={"flex"} flexDirection={"column"} padding={"5px"} marginRight={"1rem"} sx={{ borderRadius: '12px', backgroundColor: '#282c34', width: '20rem', height: '10rem', alignItems: 'center' }}>
                    <Typography variant='p'> Points: {userData.userProfile.points}</Typography>

                    <Box position="relative" display="inline-flex" marginTop="1rem">
                        <CircularProgress variant="determinate" value={getProgressPercentage()} size={80} thickness={4} sx={{ color: 'orange' }} />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="caption" component="div" color="white">
                                {`${Math.round(getProgressPercentage())}%`}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant='p'> {getPointsToNextRank()} points to next rank</Typography>
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
                <Button
                    sx={buttonStyle('reviews')}
                    onClick={() => setSelectedTab('reviews')}
                >
                    Reviews
                </Button>
            </Box>

            <Box sx={{ marginTop: '5px' }}>
                {selectedTab === 'submissions' && <SubmissionsList itemData={userData.submissions} />}
                {selectedTab === 'contests' && <ContestList contests={userData.contests} />}
                {selectedTab === 'reviews' && <UserReviewPage reviews={userData.reviews} />}
            </Box>
        </>
    );
}
