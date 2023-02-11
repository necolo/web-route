import { createSearchParams, To, URLSearchParamsInit } from 'react-router-dom';
import { Paths, RouteChildren, RouteConfig } from './types';

interface ObjectTo {
  pathname: string | Paths;
  search: URLSearchParamsInit;
  hash: string;
}

export type CompatiblePath = string | Paths | Partial<ObjectTo>;

function isAdvancedTo(to: any): to is Partial<ObjectTo> {
  return typeof to === 'object' && (
    to.pathname ||
    to.search ||
    to.hash
  );
}

export function formatTo(to: string | Paths): string;
export function formatTo(to: Partial<ObjectTo>): To;
export function formatTo(to: CompatiblePath) {
  if (isAdvancedTo(to)) {
    return {
      pathname: String(to.pathname),
      search: `?${createSearchParams(to.search).toString()}`,
      hash: to.hash,
    } as To;
  }
  return String(to);
}

export function resolvePaths(...paths: string[]) {
  return paths.reduce((res, curr) => {
    if (!curr) {
      return res;
    }
    if (curr.startsWith('/')) {
      return curr;
    }
    return `${res}/${curr}`.replace(/\/+/g, '/');
  });
}

export function mapValues<T, U>(
  obj: Record<string, T>,
  func: (v: T, key: string) => U,
) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key] = func(obj[key], key);
      return acc;
    },
    {} as Record<string, U>
  )
}

export function createRoute<T extends RouteConfig>(route: T): T {
  return route;
}

export function createRoutes<T extends RouteChildren>(routes: T): T {
  return routes;
}