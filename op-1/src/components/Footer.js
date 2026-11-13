import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.copyright}>
          &copy; {currentYear} InterviewPrep. All rights reserved.
        </p>
        <div style={styles.links}>
          <Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link>
          <Link to="/terms" style={{...styles.link, marginLeft: '20px'}}>Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#ffffff',
    padding: '10px 0',
    borderTop: '1px solid #eaeaea',
    width: '100%',
    height: '70px',
    marginTop: 'auto',
    
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  copyright: {
    margin: 0,
    color: '#666666',
    fontSize: '0.9rem',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#666666',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  'link:hover': {
    color: '#2563eb',
    textDecoration: 'underline',
  },
};

export default Footer;
