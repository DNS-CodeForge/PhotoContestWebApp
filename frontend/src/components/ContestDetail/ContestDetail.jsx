import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, radioClasses, Typography} from '@mui/material';
import { useParams } from 'react-router-dom';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import SubmissionsList from './SubmissionsList';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {

   const [contest, setContest] = useState([]);
   const [rankedUsers, setRankedUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { id } = useParams();
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
       return <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}> <CircularProgress color='gray'/> </Box>;
    }

    if (error) {
       return <div>Error: {error}</div>;
    }

    const image = categoryToImageMap[contest.category.toUpperCase()] || abstractImage;

    const buttonStyle = (tab) => ({
        width: "230px",
        fontSize: "1.2rem",
        backgroundColor: selectedTab === tab ? '#222831' : '#393E46', 
        boxShadow: "none !important",
        borderRadius: "12px 12px 0 0",
    });

    return (
        <>
        <Box display={"flex"} alignItems={"center"} flexDirection={"column"} sx={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',         
              backgroundRepeat: 'no-repeat',    
              backgroundPosition: 'center',      
              height: '50vh'
        }}>
                  <Typography variant='h2' marginTop={"5rem"} fontWeight={"bold"} sx={{ textShadow:"2px 2px 4px black"}}> {contest.title} </Typography>
                  <Button variant="contained" color='success' sx={{paddingLeft: "1.5rem",paddingRight: "1.5rem", marginTop: "1rem", fontSize: "1.5rem"}}>Join Contest</Button>
                  <Box display={"flex"} marginTop={"auto"} width={"70%"} justifyContent="space-evenly"> 
                     
               <Button
                    variant="contained"
                    sx={buttonStyle('details')}
                    onClick={() => handleTabChange('details')}
                >
                    Details
                </Button>
                <Button
                    variant="contained"
                    sx={buttonStyle('ranking')}
                    onClick={() => handleTabChange('ranking')}
                >
                    Current Ranking
                </Button>
                <Button
                    variant="contained"
                    sx={buttonStyle('submissions')}
                    onClick={() => handleTabChange('submissions')}
                >
                    Submissions
                </Button>
                </Box>
            </Box>
            <Box>
                {selectedTab === 'details' && (
                    <ContestInfo contest={contest} />
                                    )}
                {selectedTab === 'submissions' && (
                    <SubmissionsList contest={contest}/>
                )}
                {selectedTab === 'ranking' && (
                    <Ranking rankedUsers={rankedUsers}/>
                )}


            </Box>
        </>
    );
}
