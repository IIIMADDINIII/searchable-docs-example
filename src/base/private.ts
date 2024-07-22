import { str, type LocaleModule, type StrResult } from "@lit/localize";
import { html } from "lit";
import { cachedPrivateApi } from "./utils.js";

/**
 * Function to configure the available locales.
 * Will use source locale when not defined.
 */
export type LocalesFunction = ((this: LocalesApi) => void) | undefined;

type TranslationTemplates = (str: typeof import("@lit/localize").str, html: typeof import("lit").html) => LocaleModule;
type Translation = "source" | { templates: TranslationTemplates; };
type LocalesResultItem = { id: string, displayName: string | StrResult; };
type LocalesResultsArray = LocalesResultItem[];
export type LocalesResults = {
  array: LocalesResultsArray;
  getValidated(locale: string | undefined | null): string | undefined;
  getTemplate(locale: string | undefined | null): LocaleModule;
  getDisplayName(locale: string | undefined | null): string | StrResult;
  source: string;
  targets: string[];
};

type LocalesApiAddOptions = {
  /**
   * id used in the Url.
   */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName: string | StrResult;
  /**
   * Export of the Translation file for the language.
   * Can also be "source" when the texts form the source code should be displayed.
   */
  translation: Translation;
  /**
   * Is this the default locale which is selected, when the url does not specify anything.
   * @default false;
   */
  default?: boolean | undefined;
};

type LocalesApi = {
  /**
   * Add a locale to the Documentation.
   * @param options - options about the locale to add.
   */
  add(options: LocalesApiAddOptions): void;
};

export const locales = cachedPrivateApi((configFunction: LocalesFunction): LocalesResults => {
  if (configFunction === undefined) return {
    array: [],
    getValidated: () => undefined,
    getTemplate: () => { throw new Error("can not load translation"); },
    getDisplayName: () => { throw new Error("No matching locale found"); },
    source: "en-x-dev",
    targets: [],
  };
  const array: LocalesResultsArray = [];
  const targets: Map<string, Translation> = new Map();
  let def: string | undefined = undefined;
  let source: string = "en-x-dev";
  const api = {
    add(options: LocalesApiAddOptions) {
      const item: LocalesResultItem = {
        id: options.id,
        displayName: options.displayName,
      };
      if (targets.has(item.id)) throw new Error("There can not be two locales with the same id");
      if (options.default === true) {
        if (def !== undefined) throw new Error("There can only be one default locale");
        def = item.id;
      }
      if (options.translation === "source") {
        if (source !== "en-x-dev") throw new Error("There can only be one locale with source translations");
        source = item.id;
      }
      array.push(item);
      targets.set(item.id, options.translation);
    }
  };
  configFunction.call(api);
  if (array.length === 0) throw new Error("There must be at least one locale be defined");
  const d = def as string | undefined;
  if (d === undefined) throw new Error("There must be at least one default locale");
  const getValidated = (locale: string | undefined | null) => locale !== undefined && locale !== null && targets.has(locale) ? locale : d;
  return {
    array,
    getValidated,
    getTemplate(locale) {
      const template = targets.get(getValidated(locale));
      if (template === undefined || template === "source") throw new Error("Unable to load translation");
      return template.templates(str, html);
    },
    getDisplayName(locale) {
      const target = getValidated(locale);
      const ret = array.find((v) => v.id === target);
      if (ret === undefined) throw new Error("No matching locale found");
      return ret.displayName;
    },
    source,
    targets: [...targets.keys()],
  };
});

/**
 * Function to configure the available versions of this Documentation.
 * Only a single unnamed version is used when not defined.
 */
export type VersionsFunction = ((this: VersionApi) => void) | undefined;

type VersionsResultItem = { id: string, displayName: string | StrResult; };
type VersionsResultsArray = VersionsResultItem[];
export type VersionsResults = {
  array: VersionsResultsArray;
  getValidated(version: string | undefined | null): string | undefined;
  getDisplayName(version: string | undefined | null): string | StrResult;
};

type VersionApiAddOptions = {
  /**
 * id used in the Url.
 */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName?: string | StrResult | undefined;
  /**
   * Is this the default Version which is selected, when the url does not specify anything.
   * @default false;
   */
  default?: boolean | undefined;
};
type VersionApi = {
  /**
   * Add a version to the Documentation.
   * @param options - options about the version to add.
   */
  add(options: VersionApiAddOptions): void;
};

export const version = cachedPrivateApi((configFunction: VersionsFunction): VersionsResults => {
  if (configFunction === undefined) return {
    array: [],
    getValidated: () => undefined,
    getDisplayName: () => { throw new Error("No matching version found"); }
  };
  const array: VersionsResultsArray = [];
  const ids: Set<string> = new Set();
  let def: string | undefined = undefined;
  const api = {
    add(options: VersionApiAddOptions) {
      const item: VersionsResultItem = {
        id: options.id,
        displayName: options.displayName ?? options.id,
      };
      if (ids.has(item.id)) throw new Error("There can not be two versions with the same id");
      if (options.default === true) {
        if (def !== undefined) throw new Error("There can only be one default version");
        def = item.id;
      }
      array.push(item);
      ids.add(item.id);
    }
  };
  configFunction.call(api);
  if (array.length === 0) throw new Error("There must be at least one Version be defined");
  const d = def as string | undefined;
  if (d === undefined) throw new Error("There must be at least one default version");
  const getValidated = (version: string | undefined | null) => version !== undefined && version !== null && ids.has(version) ? version : d;
  return {
    array,
    getValidated,
    getDisplayName: (locale) => {
      const target = getValidated(locale);
      const ret = array.find((v) => v.id === target);
      if (ret === undefined) throw new Error("No matching version found");
      return ret.displayName;
    },
  };
});