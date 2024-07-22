import type { ComplexAttributeConverter } from "lit";

/**
 * Checking if Element is of a specific Type.
 * @param elem - Element to check.
 * @param tag - the Expected Tag Name the Element should have.
 * @returns boolean indicating if element has the tag.
 */
export function isElement<T extends keyof HTMLElementTagNameMap>(elem: EventTarget | null | undefined, tag: T): elem is HTMLElementTagNameMap[T] {
  if (elem === null || elem === undefined) return false;
  if (!(elem instanceof Element)) return false;
  if (elem.tagName.toLocaleUpperCase() !== tag.toLocaleUpperCase()) return false;
  return true;
}

export type UrlParams = {
  locale?: string | undefined;
  version?: string | undefined;
};
export function searchParamsToObject(url: URL): UrlParams {
  const result: { [key: string]: string; } = {};
  (url).searchParams.forEach((v, k) => result[k] = v);
  return result;
}
export function getUrlParams(): UrlParams {
  return searchParamsToObject(new URL(location.href));
}
export function setUrlParams(params: UrlParams, init: boolean = false): void {
  if (init) {
    window.history.replaceState(params, "", getUrlWithParams(params));
    return;
  }
  const keys = new Set(Object.keys(params));
  for (const [key, value] of Object.entries(getUrlParams()) as [keyof UrlParams, string][]) {
    keys.delete(key);
    if (params[key] !== value) {
      window.history.pushState({}, "", getUrlWithParams(params));
      return;
    }
  }
  if (keys.size === 0) return;
  window.history.pushState({}, "", getUrlWithParams(params));
};
export function getUrlWithParams(params: UrlParams): URL {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => v !== undefined ? url.searchParams.set(k, v) : undefined);
  return url;
}

export const passThroughAttributeConverter: ComplexAttributeConverter<string | null> = {
  fromAttribute: (value) => value,
  toAttribute: (value) => value,
};

export function createCacheFunction(): <T>(cacheKey: unknown[], fn: () => T) => T {
  let cache: any;
  let keys: unknown[] = [];
  return function cacheFunction<T>(cacheKeys: unknown[], fn: () => T): T {
    if (cacheKeys.length !== keys.length || cacheKeys.some((v, i) => v !== keys[i])) {
      cache = fn();
      keys = [...cacheKeys];
    }
    return cache;
  };
}

export type Api<Results> = (locale: string | undefined) => Results;
type ConfigFunction<This> = ((this: This) => void) | undefined;
export function cachedPrivateApi<CF extends ConfigFunction<any>, Results>(fn: (fn: CF, locale: string | undefined) => Results): (configFunction: CF) => Api<Results> {
  return function caching(configFunction: CF): Api<Results> {
    let lastLocale: string | undefined = undefined;
    let last: Results | undefined = undefined;
    return function cached(locale: string | undefined): Results {
      if (last === undefined || lastLocale !== locale || locale === undefined) {
        last = fn(configFunction, locale);
        lastLocale = locale;
      }
      return last;
    };
  };
}