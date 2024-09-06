import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

import Navbar from "./components/Navbar/Navbar.jsx";  // Import your custom theme

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>


            <Navbar/>

            <App />

    </React.StrictMode>
);
