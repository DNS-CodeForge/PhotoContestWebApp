import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import classes from './Layout.module.css';

const Layout = () => {
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
