// src/__tests__/types.test-d.ts
import { expectTypeOf } from 'vitest';
import { RouteSchema } from '../app-route';
import { Paths } from '../types';

// Define a test route
const route = new RouteSchema({
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

const paths = route.getPaths();

// Test that paths have correct types
expectTypeOf<Paths<{
  user: Paths<{
    profile: (id: number) => Paths<{}>
  }>
}>>(paths);
