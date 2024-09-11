import {useState, useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {Box, Button, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import SubmissionsList from './SubmissionsList';
import classes from './Details.module.css';
import ContestRules from "./ContestRules.jsx";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {

    const [contest, setContest] = useState([]);
    const [rankedUsers, setRankedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {id} = useParams();
    const [selectedTab, setSelectedTab] = useState('submissions');

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
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const usersResponse = await fetch(`${BACKEND_BASE_URL}api/contest/${id}/ranking?limit=5`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contests');
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
    }, [id]);


    if (loading) {
        return <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}> <CircularProgress
            color='gray'/> </Box>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const image = categoryToImageMap[contest.category.toUpperCase()] || abstractImage;

    const buttonStyle = (tab) => ({
        fontSize: "1.2rem",
        backgroundColor: selectedTab === tab ? '#222831' : '#393E46',
        border: selectedTab === tab ?  '1px inset rgba(154, 149, 149, 0.3)' :'1px groove rgba(154, 149, 149, 0.3)' ,
        borderBottom: selectedTab === tab ?  'none' :'0.5px groove rgba(154, 149, 149, 0.02)' ,
        boxShadow: "none !important",
        borderRadius: "12px 12px 0 0",
        overflow: "hidden",

    });

    return (
        <>
            <div className={classes.detailContainer}>
                <Box display={"flex"} alignItems={"center"} flexDirection={"column"} sx={{
                    position: 'relative',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '50vh',
                    width: '100%',
                    overflow: 'hidden',
                    borderTopLeftRadius: '1rem',
                    borderTopRightRadius: '1rem',

                }}>
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
                            variant='body1'
                            sx={{
                                marginBottom: "1rem",
                                fontSize: '1.2rem'
                            }}
                        >
                            <ContestInfo contest={contest} />

                        </Typography>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#ffffff',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                padding: '0.8rem 2rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                textTransform: 'uppercase',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                },
                                '&:active': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                },
                            }}
                        >
                            Join Contest
                        </Button>


                    </Box>


                    <Box display={"flex"} marginTop={"auto"} width={"100%"} justifyContent="space-between"
                         sx={{
                             padding: "0 10px",
                         }}>
                        <Button
                            variant="contained"
                            sx={{...buttonStyle('submissions'), flexGrow: 1, margin: "0 5px", maxWidth: '20rem'}}
                            onClick={() => handleTabChange('submissions')}
                        >
                            Entries
                        </Button>
                        <Button
                            variant="contained"
                            sx={{...buttonStyle('ranking'), flexGrow: 1, margin: "0 5px", maxWidth: '20rem'}}
                            onClick={() => handleTabChange('ranking')}
                        >
                            Ranking
                        </Button>
                        <Button
                            variant="contained"
                            sx={{...buttonStyle('details'), flexGrow: 1, margin: "0 5px", maxWidth: '20rem'}}
                            onClick={() => handleTabChange('details')}
                        >
                            Details
                        </Button>
                    </Box>
                </Box>


                <Box>
                    {selectedTab === 'details' && <ContestRules contest={contest}/>}
                    {selectedTab === 'submissions' && <SubmissionsList contest={contest}/>}
                    {selectedTab === 'ranking' && <Ranking rankedUsers={rankedUsers}/>}
                </Box>

            </div>
        </>
    );
}
