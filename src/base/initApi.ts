import { type LocaleModule } from "@lit/localize";
import { getRenderEntrypoint, type EntrypointFunction, type RenderEntrypoint } from "./entrypointApi.js";
import type { RenderDisplayName } from "./utils.js";

/**
 * Function to configure the application with its options.
 */
export type InitFunction = (this: InitApi, init: InitApi) => void;

/**
 * Definition of a Locale.
 */
export type LocalesItem = {
  /**
   * id used in the Url.
   */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName: RenderDisplayName;
  /**
   * Export of the Translation file for the language.
   * Can also be "source" when the texts form the source code should be displayed.
   */
  translation: Translation;
  /**
   * Is this the default locale which is selected, when the url does not specify anything.
   */
  default: boolean;
};

/**
 * Definition of a Version.
 */
type VersionItem = {
  /**
 * id used in the Url.
 */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName: RenderDisplayName;
  /**
   * Is this the default Version which is selected, when the url does not specify anything.
   * @default false;
   */
  default: boolean;
};

/**
 * Result of calling the init Render Method.
 * Contains all the Information of a config.
 */
export type InitResult = {
  /**
   * True if at least one addLocale call was made.
   */
  localesDefined: boolean;
  /**
   * A Array with all Locale information in the order it was provided.
   */
  localesArray: LocalesItem[];
  /**
   * A Map with all Locale information keyed by id.
   */
  localesMap: Map<string, LocalesItem>;
  /**
   * The locale wich should be used by default.
   */
  defaultLocale: string | undefined;
  /**
   * The locale wich is associated with the source.
   */
  sourceLocale: string | undefined;
  /**
   * True if at least one addVersion call was made.
   */
  versionsDefined: boolean;
  /**
   * A Array with all Version information in the order it was provided.
   */
  versionsArray: VersionItem[];
  /**
   * A Map with all Locale information keyed by id.
   */
  versionsMap: Map<string, VersionItem>;
  /**
   * The version wich should be used by default. 
   */
  defaultVersion: string | undefined;
  /**
   * Function to render the documentation.
   */
  entrypoint: RenderEntrypoint;
  /**
   * Do not intercept Anchor Tag Navigations.
   */
  disableAnchorInterception: boolean;
};

/**
 * The function to get the Result of the Init config.
 */
export type RenderInit = () => InitResult;

/**
 * This is the Type of the Translation Module when imported like this:
 * ```import * as en from "./locales/en.js";```
 */
type TranslationTemplates = { templates(str: typeof import("@lit/localize").str, html: typeof import("lit").html): LocaleModule; };

/**
 * Definition of a Locale source.
 * If "source" is given, the text is taken from the Sourcecode.
 * If a Translation is givin the Source Texts are translated using the given Translations.
 */
type Translation = "source" | TranslationTemplates;

/**
 * Options for defining a Locale.
 */
type LocalesApiAddOptions = {
  /**
   * id used in the Url.
   */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName: RenderDisplayName;
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

/**
 * Options for defining a Version.
 */
type VersionApiAddOptions = {
  /**
 * id used in the Url.
 */
  id: string;
  /**
   * String to display to the user for selection.
   */
  displayName?: RenderDisplayName | undefined;
  /**
   * Is this the default Version which is selected, when the url does not specify anything.
   * @default false;
   */
  default?: boolean | undefined;
};

/**
 * Api Definition for the InitFunction.
 * Can be accessed with the this keyword.
 */
export type InitApi = {
  /**
   * Add a locale to the Documentation.
   * @param options - options about the locale to add.
   */
  addLocale(options: LocalesApiAddOptions): void;
  /**
   * Add a version to the Documentation.
   * @param options - options about the version to add.
   */
  addVersion(options: VersionApiAddOptions): void;
  /**
   * Sets the entrypoint for the Documentation.
   * @param docs - the entrypoint of the Documentation.
   */
  docs(docs: EntrypointFunction): void;
  /**
   * Disable Anchor tag interception.
   * Will do a page load on every navigation.
   */
  debugDisableAnchorInterception(): void;
};

/**
 * This is generating the RenderInit function for a given configFunction.
 * @param configFunction - the ConfigFunction to create a Render Function for.
 * @returns the Render Function.
 */
export function getRenderInit(configFunction: InitFunction): RenderInit {
  function update(): InitResult {
    // Define variables for the result
    let localesDefined = false;
    const localesArray: LocalesItem[] = [];
    const localesMap: Map<string, LocalesItem> = new Map();
    let defaultLocale: string | undefined = undefined;
    let sourceLocale: string | undefined = undefined;
    let versionsDefined: boolean = false;
    const versionsArray: VersionItem[] = [];
    const versionsMap: Map<string, VersionItem> = new Map();
    let defaultVersion: string | undefined = undefined;
    let entrypoint: RenderEntrypoint | undefined = undefined;
    let disableAnchorInterception = false;
    // Define the Api functions
    const api: InitApi = {
      addLocale(options) {
        const item: LocalesItem = {
          id: options.id,
          displayName: options.displayName,
          translation: options.translation,
          default: options.default ?? false,
        };
        if (localesMap.has(item.id)) throw new Error("There can not be two locales with the same id");
        if (item.default) {
          if (defaultLocale !== undefined) throw new Error("There can only be one default locale");
          defaultLocale = item.id;
        }
        if (options.translation === "source") {
          if (sourceLocale !== undefined) throw new Error("There can only be one locale with source translations");
          sourceLocale = item.id;
        }
        localesArray.push(item);
        localesMap.set(item.id, item);
        localesDefined = true;
      },
      addVersion(options) {
        const item: VersionItem = {
          id: options.id,
          displayName: options.displayName ?? (() => options.id),
          default: options.default ?? false,
        };
        if (versionsMap.has(item.id)) throw new Error("There can not be two versions with the same id");
        if (item.default === true) {
          if (defaultVersion !== undefined) throw new Error("There can only be one default version");
          defaultVersion = item.id;
        }
        versionsArray.push(item);
        versionsMap.set(item.id, item);
        versionsDefined = true;
      },
      docs(d) {
        if (entrypoint !== undefined) throw new Error("docs was already defined previously");
        entrypoint = getRenderEntrypoint(d);
      },
      debugDisableAnchorInterception() {
        disableAnchorInterception = true;
      },
    };
    // Call the Config Function with the Api
    configFunction.call(api, api);
    // Validate Config
    if (defaultLocale === undefined && localesDefined) throw new Error("There must be at least one default locale");
    if (defaultVersion === undefined && versionsDefined) throw new Error("There must be at least one default version");
    if (entrypoint === undefined) throw new Error("You need to set a Documentation entrypoint using this.docs in the init function");
    // Return result
    return {
      localesDefined,
      localesArray,
      localesMap,
      defaultLocale,
      sourceLocale,
      versionsDefined,
      versionsArray,
      versionsMap,
      defaultVersion,
      entrypoint,
      disableAnchorInterception,
    };
  }
  // Caching
  let last: InitResult | undefined = undefined;
  return function renderLocales(): InitResult {
    if (last === undefined) {
      last = update();
    }
    return last;
  };
};