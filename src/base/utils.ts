import type { ComplexAttributeConverter } from "lit";
import type { UrlParams } from "./types.js";

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

export function getUrlParams(): Partial<UrlParams> {
  const result: { [key: string]: string; } = {};
  (new URL(location.href)).searchParams.forEach((v, k) => result[k] = v);
  return result;
}

export function setUrlParams(params: UrlParams, init: boolean = false): void {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (init) {
    window.history.replaceState(params, "", url);
    return;
  }
  window.history.pushState({}, "", url);
};

export const passThroughAttributeConverter: ComplexAttributeConverter<string | null> = {
  fromAttribute: (value) => value,
  toAttribute: (value) => value,
}; 