import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Typography } from '@mui/material';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import SubmissionsList from './SubmissionsList';
import ContestRules from './ContestRules.jsx';
import JoinContestModalForm from '../Forms/SubmissionForm.jsx';
import EditSubmissionModalForm from '../Forms/UpdateSubmissionForm';
import classes from './Details.module.css';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {
    const [contest, setContest] = useState([]);
    const [rankedUsers, setRankedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [selectedTab, setSelectedTab] = useState('submissions');
    const navigate = useNavigate();


    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const categoryToImageMap = {
        'PORTRAIT': portraitImage,
        'LANDSCAPE': landscapeImage,
        'STREET': streetImage,
        'WILDLIFE': wildlifeImage,
        'ABSTRACT': abstractImage,
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${BACKEND_BASE_URL}api/contest/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                    }
                    throw new Error('Failed to fetch contest');
                }

                const usersResponse = await fetch(`${BACKEND_BASE_URL}api/contest/${id}/ranking?limit=5`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!usersResponse.ok) {
                    if (usersResponse.status === 401) {
                        navigate('/login');
                    }
                    throw new Error('Failed to fetch rankings');
                }

                const responseJsonContest = await response.json();
                const responseJsonUsers = await usersResponse.json();

                setContest(responseJsonContest);
                setRankedUsers(responseJsonUsers);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                <CircularProgress color="gray" />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const image = categoryToImageMap[contest.category?.toUpperCase()] || abstractImage;

    const buttonStyle = (tab) => ({
        fontSize: '1.2rem',
        backgroundColor: selectedTab === tab ? '#393E46' : 'rgba(12,12,12,0.38)',
        border: 'none',
        borderRadius: '12px 12px 0 0',
        padding: '1rem 3vw',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
    });

    return (
        <>
            <div className={classes.detailContainer}>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    sx={{
                        position: 'relative',
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: '50vh',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '16px',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(2px)',
                            padding: '2rem',
                            borderRadius: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="body1"
                            component="div"
                            sx={{
                                fontSize: '1.2rem',
                            }}
                        >
                            <ContestInfo
                                contest={contest}
                                setShowJoinModal={setShowJoinModal}
                                setShowEditModal={setShowEditModal}
                            />
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: 'transparent',
                        width: '100%',
                        padding: '1rem 0',
                        marginTop: '1rem',
                        boxShadow: 'none',
                    }}
                >
                    <Box display={'flex'} justifyContent="flex-start" width="100%" overflow="hidden">
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('submissions'),
                                marginRight: '2px',
                                marginLeft: 0,
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('submissions')}
                        >
                            Entries
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('ranking'),
                                marginRight: '2px',
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('ranking')}
                        >
                            Ranking
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('details'),
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('details')}
                        >
                            Details
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            marginTop: '0',
                            padding: '1rem',
                            backgroundColor: '#393E46',
                            borderRadius: '0 0 12px 12px',
                            boxShadow: '0px 4px 8px -2px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {selectedTab === 'details' && <ContestRules contest={contest} />}
                        {selectedTab === 'submissions' && <SubmissionsList itemData={contest.photoSubmissions} />}
                        {selectedTab === 'ranking' && <Ranking rankedUsers={rankedUsers} />}
                    </Box>
                </Box>
            </div>


            {showJoinModal && <JoinContestModalForm onClose={() => setShowJoinModal(false)} contestId={contest.id} />}
            {showEditModal && <EditSubmissionModalForm onClose={() => setShowEditModal(false)} contestId={contest.id} />}
        </>
    );
}
