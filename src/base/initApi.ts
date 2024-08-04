import { type LocaleModule } from "@lit/localize";
import { css } from "lit";
import { ApiBase } from "./apiBase.js";
import { type MainChapterFunction } from "./chapterApi.js";
import { InitResult } from "./initResult.js";
import { DocsMain } from "./main.js";
import { displayError, type RenderDisplayName } from "./utils.js";

/**
 * Function to configure the application with its options.
 */
export type InitFunction = (this: InitApi, init: InitApi) => void;

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
   * @param mainChapter - the entrypoint of the Documentation.
   */
  mainChapter(mainChapter: MainChapterFunction): void;
  /**
   * Disable Anchor tag interception.
   * Will do a page load on every navigation.
   */
  debugDisableAnchorInterception(): void;
};

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
export type VersionItem = {
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
 * Class to run the InitFunction.
 */
export class Init extends ApiBase<InitApi> {
  // Singleton
  static #instance: Init | undefined = undefined;
  static get instance(): Init {
    if (this.#instance === undefined) throw new Error("Accessed Init Instance before creation");
    return this.#instance;
  }

  locales: LocalesItem[] = [];
  defaultLocale: string | undefined = undefined;
  sourceLocale: string | undefined = undefined;
  versions: VersionItem[] = [];
  defaultVersion: string | undefined = undefined;
  mainChapter: MainChapterFunction | undefined = undefined;
  disableAnchorInterception: boolean = false;

  constructor(initFunction: InitFunction) {
    try {
      if (Init.#instance !== undefined) throw new Error("init can only be called once in the application");
      super(initFunction);
      Init.#instance = this;
      this.addDocumentStyles();
      this.runConfigFunction();
      new InitResult(this);
      new DocsMain();
    } catch (error) {
      displayError(error);
    }
  }

  addDocumentStyles() {
    const styleSheet = css`
      html, body {
        height: 100%;
        width: 100%;
        margin: 0px;
      }
    `.styleSheet;
    if (styleSheet === undefined) throw new Error("Error while creating Document Styles");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  }

  override getApi(): InitApi {
    return {
      addLocale: this.apiAddLocale.bind(this),
      addVersion: this.apiAddVersion.bind(this),
      mainChapter: this.apiMainChapter.bind(this),
      debugDisableAnchorInterception: this.apiDebugDisableAnchorInterception.bind(this),
    };
  }

  apiAddLocale(options: LocalesApiAddOptions) {
    const item: LocalesItem = {
      id: options.id,
      displayName: options.displayName,
      translation: options.translation,
      default: options.default ?? false,
    };
    if (this.locales.some((i) => item.id === i.id)) throw new Error("There can not be two locales with the same id");
    if (item.default) {
      if (this.defaultLocale !== undefined) throw new Error("There can only be one default locale");
      this.defaultLocale = item.id;
    }
    if (item.translation === "source") {
      if (this.sourceLocale !== undefined) throw new Error("There can only be one locale with source translations");
      this.sourceLocale = item.id;
    }
    this.locales.push(item);
  }

  apiAddVersion(options: VersionApiAddOptions) {
    const item: VersionItem = {
      id: options.id,
      displayName: options.displayName ?? (() => options.id),
      default: options.default ?? false,
    };
    if (this.versions.some((i) => item.id === i.id)) throw new Error("There can not be two versions with the same id");
    if (item.default === true) {
      if (this.defaultVersion !== undefined) throw new Error("There can only be one default version");
      this.defaultVersion = item.id;
    }
    this.versions.push(item);
  }

  apiMainChapter(mainChapter: MainChapterFunction) {
    if (this.mainChapter !== undefined) throw new Error("mainChapter was already defined previously");
    this.mainChapter = mainChapter;
  }

  apiDebugDisableAnchorInterception() {
    this.disableAnchorInterception = true;
  }
}
