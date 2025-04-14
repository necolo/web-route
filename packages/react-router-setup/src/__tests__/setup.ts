// src/test/setup.ts
import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';

// Mock React Router DOM
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => vi.fn(),
  useNavigationType: () => 'PUSH',
  createPath: (to: any) => {
    if (typeof to === 'string') return to;
    return `${to.pathname || ''}${to.search ? '?' + to.search : ''}${to.hash || ''}`;
  },
  parsePath: (path: string) => ({ pathname: path, search: '', hash: '' }),
  createSearchParams: (init: any) => new URLSearchParams(init),
}));

// Set up location and history mocks
beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost/',
      origin: 'http://localhost',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      ancestorOrigins: {},
      assign: vi.fn(),
      reload: vi.fn(),
      replace: vi.fn(),
      toString: () => 'http://localhost/',
    },
    writable: true,
  });
  
  // Mock history API
  global.history.pushState = vi.fn();
  global.history.replaceState = vi.fn();
  global.history.go = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});
