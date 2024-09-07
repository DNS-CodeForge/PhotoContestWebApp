import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {

   const [contest, setContest] = useState([]);
   const [rankedUsers, setRankedUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}api/contest/1`);

        const usersResponse = await fetch(`${BACKEND_BASE_URL}api/contest/1/ranking?limit=1`);

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
