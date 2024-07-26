
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

/**
 * Definition of the used URL Parameters as an object.
 */
export type UrlParams = {
  locale?: string | undefined;
  version?: string | undefined;
};

/**
 * Convert the Search params of an URL to the Object representation.
 * @param url - the URL to convert.
 * @returns the Object with all the Search params.
 */
export function searchParamsToObject(url: URL): UrlParams {
  const result: { [key: string]: string; } = {};
  (url).searchParams.forEach((v, k) => result[k] = v);
  return result;
}

/**
 * Get the Search params as an object of the current URL.
 * @returns the Object with all the Search params of the current url.
 */
export function getUrlParams(): UrlParams {
  return searchParamsToObject(new URL(location.href));
}

/**
 * Set the Search params in the current url.
 * @param params - an object with all the params to set.
 * @param replace - should it replace the current location in the history.
 */
export function setUrlParams(params: UrlParams, replace: boolean = false): void {
  if (replace) {
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

/**
 * Calculates a url based on the current url with all the params applied.
 * @param params - the params to apply to the current URL.
 * @returns the URL including the new state provided py params.
 */
export function getUrlWithParams(params: UrlParams): URL {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => v !== undefined ? url.searchParams.set(k, v) : undefined);
  return url;
}

/**
 * Function is called whenever the locale changes to update the text.
 * Code in the form of the following should be enough for most cases.
 * ```() => msg("Hello World")```
 */
export type RenderDisplayName = () => string;
