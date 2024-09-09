import Home from './Home';
import ContestDetail from '../components/ContestDetail/ContestDetail';
import LoginForm from '../components/Forms/LoginForm';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/Forms/RegisterForm';

const routes = [
    {
        path: '/',  // Root path
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
                path: '*',
                element: <Navigate to="/home" />,
            },
        ],
    },
];

export default routes;
