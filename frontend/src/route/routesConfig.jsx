import ContestPage from './ContestPage.jsx';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile/UserProfile';
import CreateContest from '../components/Forms/CreateContest';
import ProtectedRoute from './ProtectedRoute';
import ContestDetailPage from './ContestDetailPage.jsx';
import HomePage from './HomePage';
import { isAuthenticated } from '../utils/authUtils';
import AboutPage from '../components/AboutPage.jsx';

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {

                path: '/',
                element: <HomePage />,
            },
            {

                path: '/about',
                element: <AboutPage />,
            },
            {

                path: 'contest',
                element: <Navigate to="/contest/page/1" replace />,
            },
            {

                path: 'contest/page/:page',
                element: (
                    <ProtectedRoute>
                        <ContestPage />
                    </ProtectedRoute>
                ),
            },
            {

                path: 'login',
                element: isAuthenticated() ? <Navigate to="/" replace /> : <HomePage />,
                state: { modalType: 'login' },
            },
            {

                path: 'register',
                element: isAuthenticated() ? <Navigate to="/" replace /> : <HomePage />,
                state: { modalType: 'register' },
            },
            {

                path: 'contest/:id',
                element: (
                    <ProtectedRoute>
                        <ContestDetailPage />
                    </ProtectedRoute>
                ),
            },
            {

                path: 'create-contest',
                element: (
                    <ProtectedRoute>
                        <CreateContest />
                    </ProtectedRoute>
                ),
            },
            {

                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
];

export default routes;
