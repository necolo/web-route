import { describe, it, expect } from 'vitest';
import { RouteSchema } from '../app-route';

const TestComponent = () => <div>Test</div>;
const IndexComponent = () => <div>Index</div>;

describe('RouteSchema', () => {
  it('should create a route schema with correct structure', () => {
    const route = new RouteSchema({
      path: '/test',
      element: <TestComponent />,
      index: <IndexComponent />,
    });
    
    expect(route.config.path).toBe('/test');
    expect(route.config.element).toBeDefined();
    expect(route.config.index).toBeDefined();
  });
  
  it('should handle nested routes correctly', () => {
    const route = new RouteSchema({
      path: '/parent',
      element: <div>Parent</div>,
      children: {
        child: {
          path: 'child',
          element: <div>Child</div>,
        },
      },
    });
    
    expect(route.children.child).toBeDefined();
    expect(route.children.child.config.path).toBe('child');
  });
  
  it('should generate paths correctly', () => {
    const route = new RouteSchema({
      path: '/parent',
      children: {
        child: {
          path: 'child',
        },
      },
    });
    
    const paths = route.getPaths();
    expect(String(paths)).toBe('/parent');
    expect(String(paths.child)).toBe('/parent/child');
  });
  
  it('should handle dynamic paths with getPath correctly', () => {
    const route = new RouteSchema({
      path: '/users',
      children: {
        user: {
          path: ':id',
          getPath: (id: string) => id,
        },
      },
    });
    
    const paths = route.getPaths();
    expect(String(paths.user('123'))).toBe('/users/123');
  });
});
