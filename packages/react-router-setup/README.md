
# react-router-setup

A powerful, type-safe routing solution for React applications that enhances React Router DOM with structured route definitions and convenient navigation utilities.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-16+-61DAFB)
![React Router](https://img.shields.io/badge/React_Router-6+-CA4245)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- Type-safe route definitions for better development experience
- Easy path generation for navigation with full TypeScript support
- Enhanced navigation through the custom `useNav` hook
- Support for dynamic routes with parameters and path generators
- Structured routing approach with proper nested routes
- Clean API to generate React Router objects
- Silent navigation option to avoid triggering React Router renders
- Search parameter management with options to preserve existing parameters

## Installation

```bash
# npm
npm install react-router-setup

# yarn
yarn add react-router-setup

# pnpm
pnpm add react-router-setup
```

## Requirements

- React ^16
- React Router DOM ^6

## Basic Usage

### Creating Routes

```tsx
import { RouteSchema } from 'react-router-setup';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = new RouteSchema({
  path: '/',
  element: <Menu />,
  index: <HomePage />,
  children: {
    user: {
      path: 'user',
      index: <Users />,
      children: {
        newUser: {
          path: 'new',
          element: <NewUser />,
        },
        name: {
          path: ':name',
          getPath: (name: string) => name,
          element: <User />,
        },
      }
    },
  },
}); 

// If you are using react-router-dom >= 6.4
const router = createBrowserRouter([
  root.getReactRouteObject(),
  {
    path: '*',
    element: <Page404 />,
  },
]);

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(
    <RouterProvider router={router} />
  );
```

> Note: If you're using React Router DOM version < 6.4, you should generate `<Routes>` component from `root.getReactRouteObject()`.

### Generating Paths

Once you've defined your routes, you can generate type-safe paths:

```tsx
const paths = root.getPaths();

// Type-safe path generation
console.log(String(paths.user)); // '/user'
console.log(String(paths.user.newUser)); // '/user/new'
console.log(String(paths.user.name('john'))); // '/user/john'
```

### Enhanced Navigation with useNav

The `useNav` hook simplifies navigation and is fully compatible with React Router's `useNavigate`:

```tsx
import { useNav } from 'react-router-setup';

function UserProfile() {
  const navigate = useNav();
  
  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={() => navigate(paths.user.newUser)}>
        Create New User
      </button>
      <button onClick={() => navigate(paths.user.name('john'))}>
        Go to John's Profile
      </button>
    </div>
  );
}
```

## Advanced Usage

### Dynamic Routes with Parameters

```tsx
const routes = new RouteSchema({
  path: '/',
  element: <Layout />,
  children: {
    products: {
      path: 'products',
      element: <Products />,
      children: {
        details: {
          path: ':id',
          getPath: (id: string | number) => String(id),
          element: <ProductDetails />,
        }
      }
    }
  }
});

const paths = routes.getPaths();

// You can now navigate to a specific product:
navigate(paths.products.details(123)); // '/products/123'
```

### Navigation with Search Parameters

```tsx
import { useNav } from 'react-router-setup';

function SearchPage() {
  const navigate = useNav();
  
  const handleSearch = (query: string) => {
    navigate(paths.products, {
      search: { query, page: '1' }
    });
  };
  
  const keepCurrentFilters = () => {
    navigate(paths.products.details(123), {
      keepSearch: true // Keep all current search parameters
    });
  };
  
  const keepSelectedFilters = () => {
    navigate(paths.products, {
      keepSearch: ['category', 'sort'] // Keep only specific search parameters
    });
  };
  
  return <div>Search UI</div>;
}
```

### Silent Navigation

Navigate without triggering React Router renders:

```tsx
import { useNav } from 'react-router-setup';

function AnalyticsTracker() {
  const navigate = useNav();
  
  const trackPageView = (page: string) => {
    // Track the page view without actually navigating
    navigate(page, { silent: true });
  };
  
  return null;
}
```

Alternatively, use the dedicated `useSilentNav` hook:

```tsx
import { useSilentNav } from 'react-router-setup';

function Component() {
  const silentNav = useSilentNav();
  
  const handleClick = () => {
    silentNav(paths.user);
  };
  
  return <button onClick={handleClick}>Track Click</button>;
}
```

### Excluding Routes from React Router

Sometimes you may want to define routes for navigation purposes but exclude them from the React Router definition:

```tsx
const routes = new RouteSchema({
  path: '/',
  element: <Layout />,
  children: {
    api: {
      path: 'api',
      ignoreChildrenInReactRouter: true, // Ignore all children
      children: {
        docs: { path: 'docs' },
        playground: { path: 'playground' }
      }
    },
    admin: {
      path: 'admin',
      element: <Admin />,
      // Ignore specific child routes
      ignoreChildrenInReactRouter: ['settings', 'debug'],
      children: {
        users: { path: 'users', element: <AdminUsers /> },
        settings: { path: 'settings', element: <AdminSettings /> },
        debug: { path: 'debug', element: <AdminDebug /> }
      }
    }
  }
});
```

## API Reference

### RouteSchema

The `RouteSchema` class is the core of the library, used to define routes and generate paths.

```tsx
const route = new RouteSchema({
  path: string;            // The route path
  element?: React.ReactNode; // Component to render at this route
  index?: React.ReactNode;   // Index route component
  getPath?: (...params: any[]) => string; // Function to generate dynamic paths
  children?: Record<string, RouteConfig>; // Nested routes
  ignoreChildrenInReactRouter?: boolean | string[]; // Routes to exclude
  // ... any other properties from react-router-dom's RouteObject
});
```

Methods:
- `getPaths(parentPath?: string)`: Generates a path object for navigation
- `getReactRouteObject()`: Converts the route schema into a React Router object

### useNav

An enhanced version of React Router's `useNavigate` hook.

```tsx
const navigate = useNav();

// Basic usage (fully compatible with useNavigate)
navigate('/some-path');
navigate(-1); // Go back

// Enhanced usage with Paths objects
navigate(paths.user.profile);

// With options
navigate(paths.products, {
  replace: true,              // Replace current history entry
  state: { from: 'search' },  // History state
  hash: 'section2',           // URL hash
  search: { query: 'shoes' }, // Search parameters
  keepSearch: true,           // Keep current search parameters
  silent: false               // Whether to trigger React Router renders
});
```

### useSilentNav

A hook specifically for silent navigation (won't trigger React Router renders).

```tsx
const silentNav = useSilentNav();

// Usage
silentNav(paths.products);
silentNav('/products', { 
  state: { tracked: true },
  replace: true 
});
```

### Utility Functions

```tsx
// Create a single route configuration with type checking
import { createRoute } from 'react-router-setup';

const userRoute = createRoute({
  path: 'user',
  element: <UserLayout />
});

// Create a collection of routes with type checking
import { createRoutes } from 'react-router-setup';

const adminRoutes = createRoutes({
  users: { path: 'users', element: <AdminUsers /> },
  settings: { path: 'settings', element: <AdminSettings /> }
});

// Format a path object into a string or router object
import { formatTo } from 'react-router-setup';

formatTo(paths.user.profile); // '/user/profile'
formatTo({
  pathname: paths.products,
  search: { query: 'shoes' },
  hash: 'results'
}); // { pathname: '/products', search: '?query=shoes', hash: 'results' }
```

## TypeScript Support

This library is built with TypeScript and provides full type safety:

```tsx
// Routes will have proper typing based on their definition
const routes = new RouteSchema({
  path: '/',
  children: {
    user: {
      path: 'user',
      children: {
        profile: {
          path: ':id',
          getPath: (id: number) => String(id),
        }
      }
    }
  }
});

const paths = routes.getPaths();

paths.user.profile(123); // Correctly typed, expects a number
paths.user.profile('123'); // TypeScript error: Argument of type 'string' is not 
                          // assignable to parameter of type 'number'
```

## Project Structure

```
react-router-setup/
├── app-route.tsx    # Core RouteSchema implementation
├── index.ts         # Main exports
├── types.ts         # TypeScript type definitions
├── useNav.tsx       # Navigation hooks
└── utils.ts         # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgements

- Built on top of [React Router](https://reactrouter.com/)
- Inspired by the need for type-safe routing in React applications