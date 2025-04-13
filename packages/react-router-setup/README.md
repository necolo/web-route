# react-router-setup

Streamline your React routing with a powerful, type-safe solution

Introducing react-router-setup - the comprehensive solution for managing routes in your React applications. This elegant library transforms how developers organize and structure routing, eliminating the common pain points of traditional routing configuration.

## Why Choose react-router-setup?

react-router-setup provides a structured, object-oriented approach to defining your application's routing. Instead of dealing with sprawling route definitions, you can create a clean, hierarchical route schema that mirrors your application's navigation flow.

Key benefits include:

- Type-safe navigation with full TypeScript support
- Automatic path generation that eliminates hard-coding URLs
- Intuitive nested routing that mirrors your component hierarchy
- Seamless compatibility with react-router-dom v6
- Simplified navigation with the convenient useNav hook

Stop wrestling with complex routing configuration and embrace a more structured, maintainable approach. react-router-setup doesn't just make routing easier - it makes your entire application architecture cleaner.

Whether you're building a simple website or a complex web application, react-router-setup gives you the tools to create intuitive, type-safe navigation that scales with your project.

## Requirements
- react^16
- react-router-dom^6

## How to use

Create your routes:

```typescript
import { RouteSchema } from 'react-router-setup';
import React from 'react';
import ReactDOM from 'react-dom';
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

const paths = root.getPaths();

// If you are using react-router-dom^6.4
const router = createBrowserRouter([
  root.getReactRouteObject(),
  {
    path: '*',
    element: <Page404 />,
  },
]);

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <RouterProvider router={router} />
  );
```

*If you are using react-router-dom version under than 6.4, you should generate `<Routes>` component from `root.getReactRouteObject()`.*  

Using `paths` to generate the pathname is more convenient than hardcoding it.  
If you are using TypeScript, you'll also get types hint.

```typescript
assert(String(paths.user), '/user');
assert(String(paths.user.newUser), '/user/new');
assert(String(paths.user.name('jony')), '/user/jony');
```

We also provide `useNav` hook to handle `paths` so you don't need to always wrap it with `String()`.  

This hook if fully compatible to react-router's `useNavigate`;

```typescript
function Page() {
  const navigate = useNav();
  const handleJump = () => {
    navigate(paths.user.name('jony')); // don't need to wrap with `String()`
  };
  return <button onClick={handleJump}>jump to user</button>
}
```
