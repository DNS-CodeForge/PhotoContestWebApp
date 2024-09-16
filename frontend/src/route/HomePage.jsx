import React, { useEffect, useState } from 'react';
import WelcomeHeader from '../components/Headers/WelcomeHeader';
import ContestList from '../components/ContestList/ContestList';
import Box from "@mui/material/Box";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getHardcodedHalfSize = () => {
    if (window.matchMedia("(min-width: 2540px)").matches) {
        return 8;
    } else if (window.matchMedia("(min-width: 1920px)").matches) {
        return 6;
    } else {
        return 4;
    }
};

const HomePage = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [size, setSize] = useState(getHardcodedHalfSize());

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const fetchContests = async () => {
        try {
            const queryParams = new URLSearchParams({ size });

            const response = await fetch(`${BACKEND_BASE_URL}api/contest/sample-contest?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseJson = await response.json();

            if (responseJson.status === 'success') {
                const contestData = responseJson.data.contests || [];
                setContests(contestData);
            } else {
                throw new Error('Failed to fetch contests');
            }
        } catch (error) {
            console.error('Error fetching contests:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, [size]);

    useEffect(() => {
        const handleResize = debounce(() => {
            const newSize = getHardcodedHalfSize();
            if (newSize !== size) {
                setSize(newSize);
            }
        }, 300);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [size]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (contests.length === 0) {
        return <div>No contests available at the moment.</div>;
    }

    return (
        <div>
            <Box
                sx={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    marginBottom: '5vh',
                    marginTop: '5vh',
                }}
            >
                <WelcomeHeader />
                <ContestList contests={contests} heading="Latest Contests" />
            </Box>
        </div>
    );
};

export default HomePage;
