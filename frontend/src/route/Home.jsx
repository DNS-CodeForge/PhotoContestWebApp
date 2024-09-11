import { useState, useEffect } from 'react';
import ContestList from '../components/ContestList/ContestList.jsx';
import Pagination from '../components/ContestList/Pagination.jsx';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const getSizeBasedOnScreenWidth = () => {
    if (window.matchMedia("(min-width: 2560px)").matches) {
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

function HomePage() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentBreakpoint, setCurrentBreakpoint] = useState(getSizeBasedOnScreenWidth());

    const fetchContests = async (page = 1, size = 12) => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}api/contest?page=${page - 1}&size=${size}`);
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
        fetchContests(currentPage, size);

        const handleResize = () => {
            const newSize = getSizeBasedOnScreenWidth();
            if (newSize !== currentBreakpoint) {
                setCurrentBreakpoint(newSize);
                fetchContests(currentPage, newSize);
            }
        };

        const debouncedResize = debounce(handleResize, 300);

        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    }, [currentPage, currentBreakpoint]);

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

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
                <CircularProgress color='gray' />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (contests.length === 0) {
        return <div>No contests available at the moment.</div>;
    }

    return (
        <>
            <ContestList contests={contests} />

            <Pagination
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default HomePage;