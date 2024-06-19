import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SinfgIn from './pages/backoffice/SingIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SinfgIn />
  }
]); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
