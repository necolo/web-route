import { RouteObject } from 'react-router-dom';
import { mapValues, resolvePaths } from './utils';
import { RouteChildren, RouteConfig, RouteToNav } from './types';

const createPaths = (path: string, children?: Record<string, RouteSchema>) => ({
  ...(
    children
      ? mapValues(children, route => route.getPaths(path))
      : {}
  ),
  toString() {
    return path;
  },
});

export class RouteSchema<
  T extends RouteConfig = RouteConfig,
  ConfigChildren = T['children'],
  Children = ConfigChildren extends RouteChildren
    ? { [K in keyof ConfigChildren]: RouteSchema<ConfigChildren[K]> }
    : Record<string, never>,
> {
  public children = {} as Children;

  constructor(public config: T) {
    if (config.children) {
      for (const [k, v] of Object.entries(config.children)) {
        // @ts-ignore
        this.children[k] = new RouteSchema(v);
      }
    }
  }

  getPaths(parentPath?: string): RouteToNav<T>;
  getPaths(parentPath = '') {
    const { path, getPath } = this.config;
    const { children } = this;
    if (getPath) {
      return (...params: unknown[]) => {
        const resultPath = resolvePaths(parentPath, getPath(...params));
        return createPaths(resultPath, children || {});
      };
    }
    const resultPath = resolvePaths(parentPath, path || '');
    return createPaths(resultPath, children || {});
  }

  getReactRouteObject(): RouteObject {
    const {
      children: configChildren,
      index,
      ignoreChildrenInReactRouter: ignore,
      ...rest
    } = this.config;

    const childrenKeys = Object.keys(configChildren || {});
    if ((!childrenKeys.length || ignore === true) && !index) {
      return rest as RouteObject;
    }

    const copy = Object.assign({}, this.children) as Record<string, RouteSchema>;
    Array.isArray(ignore) && ignore.forEach(key => (delete copy[key]));

    const childrenRoutes = Object.values(copy);

    const result = {
      ...rest,
      children: childrenRoutes
        .map(c => c.getReactRouteObject())
        .filter(v => v.element || v.children),
    } as RouteObject;

    if (index) {
      result.children?.push({
        index: true,
        element: index,
      });
    }

    return result;
  }
}