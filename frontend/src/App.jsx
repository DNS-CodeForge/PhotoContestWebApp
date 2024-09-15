import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './route/routesConfig';


const router = createBrowserRouter(routes);

function App() {
    return (
        <RouterProvider router={router}>

        </RouterProvider>
    );
}

export default App;
