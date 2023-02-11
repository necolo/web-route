import {
  createPath,
  createSearchParams,
  NavigateOptions,
  parsePath,
  To,
  URLSearchParamsInit,
  useNavigate,
  useNavigationType
} from 'react-router-dom';
import { Paths } from './types';

interface Option extends NavigateOptions {
  hash?: string;
  search?: URLSearchParamsInit;

  /**
   * @value true: keep all current url search
   * @value string[]: keep specified search keys
   */
  keepSearch?: boolean | string[];

  /**
   * silent mode will not cause ReactRouter renders
   */
  silent?: boolean;
}

interface DeltaOption {
  fallbackPath?: string | Paths;
  silent?: boolean;
}

/**
 * Fully compatible to `useNavigate()` but more features:
 * - support jump to new pathname with current search params
 * - support use with `AppRouter.getNavigation()`
 *
 * @example
 * import { nav } from '@/router';
 *
 * Before:
 *   const navigate = useNavigate();
 *   navigate(nav.service.path);
 * After:
 *   const navigate = useNav();
 *   navigate(nav.service);
 *
 * @returns
 */
export function useNav(): {
  (pathname: number, options?: DeltaOption): void;
  (pathname: To | Paths, options?: Option): void;
} {
  const navigate = useNavigate();
  const navType = useNavigationType();

  return (pathTarget: Paths | To | number, options: Option | DeltaOption = {}) => {
    if (options.silent) {
      return silentNavigate(pathTarget, options);
    }

    if (typeof pathTarget === 'number') {
      if (pathTarget !== -1) {
        return navigate(pathTarget);
      }

      // fallback solution when go back
      if (navType === 'PUSH') {
        return navigate(-1);
      }
      const { fallbackPath = '/' } = options as DeltaOption;
      return navigate(fallbackPath.toString(), { replace: true });
    }

    const { to, ...originalOptions } = parse(pathTarget, options as Option);
    navigate(to, originalOptions);
  };
}

export function useSilentNav() {
  return silentNavigate;
}

function silentNavigate(pathTarget: Paths | To | number, options: Option = {}) {
  if (typeof pathTarget === 'number') {
    return history.go(pathTarget);
  }

  const { to, state, replace } = parse(pathTarget, options);

  (replace ? history.replaceState : history.pushState)(
    state,
    '',
    typeof to === 'string' ? to : createPath(to),
  );
}

function parse(pathTarget: Paths | To, options: Option = {}) {
  let to = (pathTarget instanceof Object && pathTarget.toString)
    ? pathTarget.toString()
    : pathTarget as To;

  const { hash = '', keepSearch, search, silent, ...originalOptions } = options as Option;

  let resSearch = '';

  if (keepSearch || search) {
    const params = new URLSearchParams();

    if (keepSearch) {
      const currentParams = new URLSearchParams(location.search);

      if (Array.isArray(keepSearch) && keepSearch.length) {
        const newParams = new URLSearchParams();
        for (let key of keepSearch) {
          const value = currentParams.get(key);
          value && newParams.set(key, value);
        }
        mergeSearchParams(params, newParams);
      } else {
        mergeSearchParams(params, currentParams);
      }
    }

    if (search) {
      mergeSearchParams(params, createSearchParams(search));
    }

    resSearch = params.toString();
  }

  if (typeof to === 'string') {
    to = parsePath(to);
    to = createPath({
      pathname: to.pathname,
      search: resSearch || to.search,
      hash: hash || to.hash,
    });
  } else {
    to.hash = hash;
    to.search = resSearch;
  }

  return { to, ...originalOptions };
}

function mergeSearchParams(target: URLSearchParams, source: URLSearchParams) {
  for (let key of source.keys()) {
    target.has(key) && target.delete(key);
    source.getAll(key).forEach(v => target.append(key, v));
  }
  return target;
}