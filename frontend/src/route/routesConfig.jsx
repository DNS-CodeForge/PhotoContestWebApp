import Home from './Home';
import ContestDetail from '../components/ContestDetail/ContestDetail';
import LoginForm from '../components/Forms/LoginForm';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/Forms/RegisterForm';
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
                path: 'contest/:id',
                element: <ContestDetail />,
            },
            {
                path: 'login',
                element: <LoginForm />,
            },
            {
                path: 'register',
                element: <RegisterForm />,
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
