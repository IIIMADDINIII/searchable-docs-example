import type { ComplexAttributeConverter } from "lit";
import type { DisplayNamesArray, DisplayNamesMap, OrderedDisplayNames, OrderedDisplayNamesElement, UrlParams } from "./types.js";

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

export function searchParamsToObject(url: URL): Partial<UrlParams> {
  const result: { [key: string]: string; } = {};
  (url).searchParams.forEach((v, k) => result[k] = v);
  return result;
}

export function getUrlParams(): Partial<UrlParams> {
  return searchParamsToObject(new URL(location.href));
}

export function setUrlParams(params: Partial<UrlParams>, init: boolean = false): void {
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

export function getUrlWithParams(params: Partial<UrlParams>): URL {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url;
}

export const passThroughAttributeConverter: ComplexAttributeConverter<string | null> = {
  fromAttribute: (value) => value,
  toAttribute: (value) => value,
};

export type DisplayNamesArrayAndMap<T extends string> = {
  array: DisplayNamesArray<T>;
  map: DisplayNamesMap<T>;
};
export function sortDisplayNames<T extends string>(names: OrderedDisplayNames<T>): DisplayNamesArrayAndMap<T> {
  const array = (Object.entries(names()) as [T, OrderedDisplayNamesElement][])
    .map((v) => typeof v[1] === "string" ? { id: v[0], order: Number.MAX_SAFE_INTEGER, displayName: v[1] } : { id: v[0], order: v[1][0], displayName: v[1][1] })
    .sort((a, b) => a.order - b.order);
  const map = Object.fromEntries(array.map((v) => [v.id, v])) as DisplayNamesMap<T>;
  return { array, map };
}

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