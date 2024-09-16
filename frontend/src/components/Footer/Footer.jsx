import React from 'react';
import classes from './Footer.module.css';

const Footer = () => {
    return (
        <>
            <div className={classes.footerSpacer}></div>
            <footer className={classes.footer}>
                <div className={classes.container}>
                    <div className={classes.copyright}>
                        <p>© 2024 D&S CodeForge. All rights reserved.</p>
                    </div>
                    <div className={classes.navLinks}>
                        <a href="/faq-info#rules" className={classes.link}>Contest Rules</a>
                        <a href="/faq-info#privacy" className={classes.link}>Privacy Policy</a>
                        <a href="/faq-info#terms" className={classes.link}>Terms of Service</a>
                        <a href="/faq-info#faq" className={classes.link}>FAQs</a>
                    </div>

                    <div className={classes.contact}>
                        <a href="https://github.com/DNS-CodeForge" className={classes.link} target="_blank">Contact Us</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

