import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import SubmissionsList from './SubmissionsList';
import { useParams } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetail() {
    const [contest, setContest] = useState([]);
    const [rankedUsers, setRankedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch contest details
                const response = await fetch(`${BACKEND_BASE_URL}api/contest/${id}`, {
                    method: 'GET',
                    mode: 'no-cors',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // // Fetch ranked users
                // const usersResponse = await fetch(`${BACKEND_BASE_URL}api/contest/${id}/ranking?limit=5`, {
                //     method: 'GET',
                //     mode: 'no-cors',
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json',
                //     },
                // });

                if (!response.ok) {
                    throw new Error(`Failed to fetch contest: ${response.statusText}`);
                }

                if (!usersResponse.ok) {
                    throw new Error(`Failed to fetch rankings: ${usersResponse.statusText}`);
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
    }, [id, token]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress color='gray' />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <Box marginTop="1rem" display="flex" justifyContent="center" alignItems="center">
                <ContestInfo contest={contest} />
                <Ranking rankedUsers={rankedUsers} />
            </Box>
            <SubmissionsList />
        </Box>
    );
}
