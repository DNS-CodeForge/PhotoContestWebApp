import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshTokenIfNecessary } from '../utils/authUtils';

export const useTokenValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            await refreshTokenIfNecessary(navigate);
        };

        validateToken();
    }, [navigate]);
};
