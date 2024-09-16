import ContestPage from './ContestPage.jsx';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';

import UserProfile from '../components/UserProfile/UserProfile';
import CreateContest from '../components/Forms/CreateContest';
import ProtectedRoute from './ProtectedRoute';
import ContestDetailPage from "./ContestDetailPage.jsx";

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {

                path: 'home',
                element: <Navigate to="/contest/page/1" replace />,
            },
            {
                path: '',
                element: <Navigate to="/contest/page/1" replace />,
            },

            {
                path: 'contest/page/:page',
                element: <ContestPage />,
            },
            {
                path: 'login',
                element: <ContestPage />,
                state: { modalType: 'login' },
            },
            {
                path: 'register',
                element: <ContestPage />,
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
                element: <Navigate to="/contest/page/1" replace />,
            },
        ],
    },
];

export default routes;
