import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import ContestDetail from '../components/ContestDetail/ContestDetail.jsx';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContestDetailPage() {
    const [contest, setContest] = useState(null);
    const [rankedUsers, setRankedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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

    return (
        <ContestDetail
            contest={contest}
            rankedUsers={rankedUsers}
        />
    );
}
