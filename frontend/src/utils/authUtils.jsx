
import { decodeToken } from './jwtUtils.jsx';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const isTokenExpiredOrAboutToExpire = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();


    return currentTime > expiryTime || (expiryTime - currentTime) < 60000;
};


export const refreshTokenIfNecessary = async (navigate) => {
    const accessToken = localStorage.getItem('accessToken');


    if (!accessToken || isTokenExpiredOrAboutToExpire(accessToken)) {
        const success = await refreshToken(navigate);
        if (!success) {
            return false;
        }
    }

    return true;
};

export const refreshToken = async (navigate) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        navigate('/login');
        return false;
    }

    try {
        const response = await fetch(`${BACKEND_BASE_URL}api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                return true;
            }
        } else {
            navigate('/login');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        navigate('/login');
    }
    return false;
};



export const isAuthenticated = () => {

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return false;
    }

    const decoded = decodeToken(accessToken);

    if (!decoded) {
        return false;
    }

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();

    return currentTime < expiryTime;
};

