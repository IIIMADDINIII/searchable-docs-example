import { html, nothing, render, type TemplateResult } from "lit";
import { join } from "lit/directives/join.js";

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

export type LocaleAndVersionInApi = {
  /**
   * The currently rendered locale.
   * Is undefined when no locales are definit in init.
   */
  readonly locale: string | undefined;
  /**
   *  The currently rendered version.
   * Is undefined when no version are definit in init.
   */
  readonly version: string | undefined;
};

/**
 * cleans and formats the error stack.
 * @param error - error from wich the stack should be processed.
 * @returns the cleaned stack as html.
 */
function processErrorStack(error: Error): TemplateResult | typeof nothing {
  let stack = error.stack;
  if (stack === undefined) return nothing;
  const prefix = `${error.name}: ${error.message}`;
  if (stack.startsWith(prefix)) stack = stack.slice(prefix.length);
  const lines = stack.trim().split(/\r?\n+/);
  return html`${join(lines.map((v) => v.trim()), () => html`<br>`)}`;
}

/**
 * Used to render an error to the Document.
 * @param error - the Error to show.
 */
export function renderError(error: unknown, errorMessagePrefix: string = ""): TemplateResult {
  if (error instanceof Error) {
    return html`
      <div style="height: 100%; width: 100%; background-color: red; color: yellow; padding: 8px; box-sizing: border-box;">
        <h1 style="margin-bottom: 0px;">${errorMessagePrefix}${error.name}: ${error.message}</h1>
        ${error.stack ? html`<div style="padding: 8px; padding-left: 24px;">${processErrorStack(error)}</div>` : nothing}
        ${error.cause ? error.cause instanceof Error ? renderError(error.cause, "Caused by: ") : html`<h1 style="margin-bottom: 0px;">Caused by: ${error.cause}</h1>` : nothing}
      </div>
    `;
  }
  return html`<div style="height: 100%; width: 100%; background-color: red; color: yellow"><h1>Error: ${error}</h1></div>`;
}

/**
 * Display the Error in the Website and on the Console an throw the error after.
 * @param error - error to show.
 */
export function displayError(error: unknown): never {
  document.body.replaceChildren();
  render(renderError(error), document.body);
  console.error(error);
  throw error;
}

/**
 * Throw an Error when given an invalid ID.
 * @param id - Id to validate.
 */
export function asserValidId(id: string): void {
  if (id === "" || id.includes(ID_SEP)) throw new Error(`Id needs to be a non empty string without any ${ID_SEP}`);
}

/**
 * Separator used to serialize a id list to a string.
 */
export const ID_SEP = "*";