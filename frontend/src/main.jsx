import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import ContestDetail from './components/ContestDetail/ContestDetail.jsx';

import Navbar from "./components/Navbar/Navbar.jsx";  
import Footer from './components/Footer.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
            <Navbar/>
            <ContestDetail/>
            <Footer/>
    </>
);
