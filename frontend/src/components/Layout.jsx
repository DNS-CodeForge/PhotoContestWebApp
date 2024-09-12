import React, { useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import classes from './Layout.module.css';
import { refreshToken } from '../utils/authUtils';

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const attemptTokenRefresh = async () => {
            await refreshToken(navigate);
        };

        attemptTokenRefresh();

        const interval = setInterval(() => {
            attemptTokenRefresh();
        }, 840000);

        return () => clearInterval(interval);
    }, [navigate]);

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
