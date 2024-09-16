import React, { useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import classes from './Layout.module.css';
import { refreshTokenIfNecessary } from '../utils/authUtils';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const attemptTokenRefresh = async () => {

            const isOnHomePage = location.pathname === '/';
            const isOnLoginPage = location.pathname === '/login';
            const isOnRegisterPage = location.pathname === '/register';


            if (!isOnLoginPage && !isOnRegisterPage) {
                // Attempt to refresh the token, pass whether it's the homepage
                await refreshTokenIfNecessary(navigate, isOnHomePage);
            }
        };


        attemptTokenRefresh();

        const interval = setInterval(() => {
            attemptTokenRefresh();
        }, 840000);

        return () => clearInterval(interval);
    }, [navigate, location.pathname]);

    return (
        <>
            <Navbar />
            <main className={classes.main}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
