import React from 'react';
import styles from './Footer.module.css'; // Importing the CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Copyright Information */}
        <div className={styles.copyright}>
          <p>© 2024 Photo Contest. All rights reserved.</p>
        </div>

        <div className={styles.navLinks}>
          <a href="/rules" className={styles.link}>Contest Rules</a>
          <a href="/privacy" className={styles.link}>Privacy Policy</a>
          <a href="/terms" className={styles.link}>Terms of Service</a>
          <a href="/faq" className={styles.link}>FAQs</a>
        </div>


        {/* Contact Information */}
        <div className={styles.contact}>
          <a href="mailto:info@photocontest.com" className={styles.link}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

