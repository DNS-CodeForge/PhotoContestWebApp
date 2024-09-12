import Home from './Home';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';
import ContestDetail from '../components/ContestDetail/ContestDetail';
import UserProfile from '../components/UserProfile/UserProfile';
import CreateContest from '../components/Forms/CreateContest';

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Navigate to="/home" />,
            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'login',
                element: <Home />,
                state: { modalType: 'login' },
            },
            {
                path: 'register',
                element: <Home />,
                state: { modalType: 'register' },
            },
            {
                path: 'contest/:id',
                element: <ContestDetail />,
            },
            {
                path: 'create-contest',
                element: <CreateContest />,
            },
            {
                path: 'profile',
                element: <UserProfile />,
            },
            {
                path: '*',
                element: <Navigate to="/home" />,
            },
        ],
    },
];

export default routes;
