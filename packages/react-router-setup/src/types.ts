import { RouteObject } from 'react-router-dom';

/* ------------------------------- route types ------------------------------ */
type GetPath<P extends any[] = any[]> = (...params: P) => string;
export type RouteChildren = Record<string, RouteConfig>;
export type RouteConfig = Omit<RouteObject, 'children' | 'index'> & {
  /**
   * Sub sub routes
   */
  children?: RouteChildren;

  /**
   * If the path is dynamic, you should define this function
   *
   * @example
   * {
   *   path: ':id',
   *   getPath: (id: number | string) => id,
   * }
   */
  getPath?: GetPath;

  /**
   * The index element, same as `<Route index element={} />`
   * Difference between `element` and `index` is like:
   * ```
   * <Route element={route.element}>
   *   <Route index element={route.index} />
   * </Route>
   * ```
   */
  index?: React.ReactNode;

  /**
   * Define ignored children when creating ReactRouter
   *
   * @example
   * ignoreChildrenInReactRouter: true // Ignore all children
   * ignoreChildrenInReactRouter: ['user', 'report'] // Ignore selected routes
   */
  ignoreChildrenInReactRouter?: boolean | string[];
};

/* -------------------------------- nav types ------------------------------- */
type PathGetter<P extends Array<unknown> = Array<unknown>> = (...params: P) => Paths;
type NavMethod = PathGetter | Paths;
export type Paths<T extends Record<string, NavMethod> = {}> = T & { toString(): string };

export type RouteChildrenToNav<T extends RouteChildren | undefined> =
  T extends RouteChildren
    ? { [K in keyof T]: RouteToNav<T[K]> }
    : Record<string, never>;

export type RouteToNav<T extends RouteConfig> =
  T['getPath'] extends GetPath
    ? ((...params: Parameters<T['getPath']>) => Paths<RouteChildrenToNav<T['children']>>)
    : Paths<RouteChildrenToNav<T['children']>>;