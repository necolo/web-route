
# Web Route

![License](https://img.shields.io/badge/License-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Package Version](https://img.shields.io/badge/react--router--setup-1.0.2-brightgreen)

A monorepo project providing type-safe, powerful routing solutions for modern web frameworks. Currently featuring react-router-setup, with plans to support Vue, SolidJS, and vanilla JavaScript in the future.

## 📦 Available Packages

| Package | Version | Description |
|---------|---------|-------------|
| [react-router-setup](./packages/react-router-setup/) | 1.0.2 | Enhanced React Router with type-safe routes and navigation utilities |

## 🚀 Featured Package: react-router-setup

react-router-setup is a powerful, type-safe routing solution for React applications that enhances React Router DOM with structured route definitions and convenient navigation utilities.

### Key Features

- Type-safe route definitions for better development experience
- Easy path generation for navigation with full TypeScript support
- Enhanced navigation through the custom `useNav` hook
- Support for dynamic routes with parameters and path generators
- Structured routing approach with proper nested routes
- Clean API to generate React Router objects
- Silent navigation option to avoid triggering React Router renders
- Search parameter management with options to preserve existing parameters

### Quick Installation

```bash
# npm
npm install react-router-setup

# yarn
yarn add react-router-setup

# pnpm
pnpm add react-router-setup
```

### Basic Usage

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

For more detailed documentation, please visit the [react-router-setup README](./packages/react-router-setup/README.md).

## 🛣️ Project Roadmap

This project aims to provide consistent routing solutions across multiple frameworks:

- ✅ React: Implemented through react-router-setup
- 🔄 Vue Router: Planned
- 🔄 SolidJS Router: Planned
- 🔄 Vanilla JS: Planned

## 🧰 Monorepo Structure

```
web-route/
├── packages/
│   ├── react-router-setup/  # Current implementation for React
│   └── ... (future packages)
├── package