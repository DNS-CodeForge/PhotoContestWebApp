import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import { useParams } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {

   const [contest, setContest] = useState([]);
   const [rankedUsers, setRankedUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { id } = useParams(); 

   useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`${BACKEND_BASE_URL}api/contest/${id}`);

        const usersResponse = await fetch(`${BACKEND_BASE_URL}api/contest/${id}/ranking?limit=5`);

        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        
        const responseJsonContest = await response.json();

        const responseJsonUsers = await usersResponse.json();

        setContest(responseJsonContest);
        console.log(responseJsonUsers)
        setRankedUsers(responseJsonUsers);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();     
    },[]);

    if (loading) {
       return <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}> <CircularProgress color='gray'/> </Box>;
    }

    if (error) {
       return <div>Error: {error}</div>;
    }

    return (
        <Box marginTop={"1rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <ContestInfo contest={contest}/>
        <Ranking rankedUsers={rankedUsers}/>
        </Box>
    );
}
