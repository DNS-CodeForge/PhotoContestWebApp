
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContestList from '../components/ContestList/ContestList.jsx';
import Pagination from '../components/ContestList/Pagination.jsx';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { refreshTokenIfNecessary } from '../utils/authUtils';
import { Typography } from '@mui/material';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getSizeBasedOnScreenWidth = () => {
    if (window.matchMedia("(min-width: 2540px)").matches) {
        return 16;
    } else if (window.matchMedia("(min-width: 1920px)").matches) {
        return 12;
    } else if (window.matchMedia("(min-width: 1440px)").matches) {
        return 8;
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
        return 6;
    } else if (window.matchMedia("(min-width: 430px)").matches) {
        return 4;
    } else {
        return 2;
    }
};

function ContestPage() {
    const { page } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(Number(page) || 1);
    const [totalPages, setTotalPages] = useState(null);
    const [currentBreakpoint, setCurrentBreakpoint] = useState(getSizeBasedOnScreenWidth());

    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).toString());

    const fetchContests = async (page = 1, size = 12, query = '') => {
        try {
            const tokenRefreshSuccess = await refreshTokenIfNecessary(navigate);
            if (!tokenRefreshSuccess) {
                return;
            }

            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_BASE_URL}api/contest?page=${page - 1}&size=${size}&${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch contests');
            }

            const responseJson = await response.json();
            setContests(Array.isArray(responseJson.data.contests) ? responseJson.data.contests : []);
            setTotalPages(responseJson.data.pagination.totalPages);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const size = getSizeBasedOnScreenWidth();
        fetchContests(currentPage, size, searchQuery);
    }, [currentPage, searchQuery]);

    useEffect(() => {
        const newPage = Number(page);
        if (newPage !== currentPage) {
            setCurrentPage(newPage || 1);
        }
    }, [page]);

    useEffect(() => {
        const handleResize = () => {
            const newSize = getSizeBasedOnScreenWidth();
            if (newSize !== currentBreakpoint) {
                setCurrentBreakpoint(newSize);
                fetchContests(currentPage, newSize, searchQuery);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentPage, currentBreakpoint, searchQuery]);

    useEffect(() => {
        const query = new URLSearchParams(location.search).toString();
        if (query !== searchQuery) {
            setSearchQuery(query);
            setCurrentPage(1); // Reset to page 1 on new search
        }
    }, [location.search]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        navigate(`/contest/page/${value}?${searchQuery}`);
    };

    if (loading) {
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
                <CircularProgress color="gray" />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (contests.length === 0) {
      return  <Box width={'100%'} height={'61vh'} alignItems={'center'} justifyContent={'center'} display={'flex'}>
        <Typography variant='h3'>No contests available at the moment</Typography>
        </Box>
    }

    return (
        <>
        <Box minHeight={'60vh'}>
            <ContestList contests={contests} heading={"Contests"} />
           <Pagination 
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
            />
        </Box>
         </>
    );
}

export default ContestPage;

