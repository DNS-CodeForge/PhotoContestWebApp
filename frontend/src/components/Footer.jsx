import React from 'react';
import classes from './Footer.module.css'; // Importing the CSS module

const Footer = () => {
    return (
        <>
            <div className={classes.footerSpacer}></div>
            <footer className={classes.footer}>
                <div className={classes.container}>
                    <div className={classes.copyright}>
                        <p>© 2024 Photo Contest. All rights reserved.</p>
                    </div>
                    <div className={classes.navLinks}>
                        <a href="/rules" className={classes.link}>Contest Rules</a>
                        <a href="/privacy" className={classes.link}>Privacy Policy</a>
                        <a href="/terms" className={classes.link}>Terms of Service</a>
                        <a href="/faq" className={classes.link}>FAQs</a>
                    </div>
                    <div className={classes.contact}>
                        <a href="mailto:info@photocontest.com" className={classes.link}>Contact Us</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

