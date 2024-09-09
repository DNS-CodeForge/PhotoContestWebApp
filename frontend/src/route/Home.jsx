import { useState, useEffect } from 'react';
import ContestList from '../components/ContestList/ContestList.jsx';
import Pagination from '../components/ContestList/Pagination.jsx';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function HomePage() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchContests = async (page = 1) => {
            try {
                const response = await fetch(`${BACKEND_BASE_URL}api/contest?page=${page - 1}&size=12`);
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

        fetchContests(currentPage);
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}> <CircularProgress color='gray'/> </Box>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (contests.length === 0) {
        return <div>No contests available at the moment.</div>;
    }

    return (
        <>
            <div>
                <ContestList contests={contests} />
            </div>
            <Pagination
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default HomePage;
