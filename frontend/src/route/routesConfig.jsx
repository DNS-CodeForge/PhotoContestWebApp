import Home from './Home';
import ContestDetail from '../components/ContestDetail/ContestDetail';

import { Navigate } from 'react-router-dom';

const routes = [
    {
        path: '/',
        element: <Navigate to="/home" />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/contest/:id',
        element: <ContestDetail />,
    },
    {
        path: '*',
        element: <Navigate to="/home" />,
    },
];

export default routes;
