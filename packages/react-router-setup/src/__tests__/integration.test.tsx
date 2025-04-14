import React from 'react';
import { createBrowserRouter, createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteSchema } from '../app-route';

// Mock components
const Home = () => <div>Home Page</div>;
const User = () => <div>User Page</div>;
const Layout = () => (
  <div>
    <header>Layout Header</header>
    <Outlet />
  </div>
);

describe('Integration Tests', () => {
  it('should create proper routes that work with React Router', () => {
    // Create route schema
    const routes = new RouteSchema({
      path: '/',
      element: <Layout />,
      index: <Home />,
      children: {
        user: {
          path: 'user',
          element: <User />,
        },
      },
    });
    
    // Get React Router object
    const routeObject = routes.getReactRouteObject();
    const router =  createMemoryRouter([routeObject], {
      initialEntries: ['/user'],
    });
    
    // Render with React Router
    render(
      <RouterProvider router={router} />
    );
    
    // Check that components render as expected
    expect(screen.getByText('Layout Header')).toBeInTheDocument();
    expect(screen.getByText('User Page')).toBeInTheDocument();
  });
});
