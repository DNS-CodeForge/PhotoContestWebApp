import { decodeToken } from './jwtUtils.jsx';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Checks if the access token is expired or about to expire (within 60 seconds).
 * @param {string} token - JWT access token
 * @returns {boolean} - Returns true if the token is expired or about to expire
 */
export const isTokenExpiredOrAboutToExpire = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;

    const expiryTime = decoded.exp * 1000; // Convert expiry time to milliseconds
    const currentTime = Date.now();

    // Token is expired or will expire in the next 60 seconds
    return currentTime > expiryTime || (expiryTime - currentTime) < 60000;
};

/**
 * Refreshes the token if it's expired or about to expire.
 * @param {function} navigate - React router's navigate function
 * @param {boolean} isOnHomePage - Whether the user is on the homepage (no redirect if true)
 * @returns {boolean} - Returns true if token was successfully refreshed, false if not
 */
export const refreshTokenIfNecessary = async (navigate, isOnHomePage = false) => {
    const accessToken = localStorage.getItem('accessToken');

    // If there's no token or the token is expired/about to expire, refresh it
    if (!accessToken || isTokenExpiredOrAboutToExpire(accessToken)) {
        const success = await refreshToken(navigate, isOnHomePage);
        return success;
    }

    return true; // No need to refresh, token is valid
};

/**
 * Attempts to refresh the access token using the refresh token.
 * @param {function} navigate - React router's navigate function
 * @param {boolean} isOnHomePage - Whether the user is on the homepage (no redirect if true)
 * @returns {boolean} - Returns true if the refresh was successful, false if it failed
 */
export const refreshToken = async (navigate, isOnHomePage = false) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        if (!isOnHomePage) {
            navigate('/login'); // Redirect to login if not on the homepage
        }
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
                return true; // Token was successfully refreshed
            }
        } else {
            if (!isOnHomePage) {
                navigate('/login'); // Redirect to login if not on the homepage
            }
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        if (!isOnHomePage) {
            navigate('/login'); // Redirect to login if not on the homepage
        }
    }

    return false; // Failed to refresh token
};

/**
 * Checks if the user is authenticated based on the validity of the access token.
 * @returns {boolean} - Returns true if the user is authenticated (valid token), false otherwise
 */
export const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return false;
    }

    const decoded = decodeToken(accessToken);

    if (!decoded) {
        return false;
    }

    const expiryTime = decoded.exp * 1000; // Convert expiry time to milliseconds
    const currentTime = Date.now();

    return currentTime < expiryTime; // Return true if the token is still valid
};
