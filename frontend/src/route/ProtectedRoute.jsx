import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshTokenIfNecessary } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const isValid = await refreshTokenIfNecessary(navigate);
            setIsAuthenticated(isValid);
        };

        validateToken();
    }, [navigate]);

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
