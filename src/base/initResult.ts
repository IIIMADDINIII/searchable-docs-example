import { str, type LocaleModule } from "@lit/localize";
import { html } from "lit";
import { MainChapter, type MainChapterFunction, type MainChapterResult } from "./chapterApi.js";
import type { Init, LocalesItem, VersionItem } from "./initApi.js";

/**
 * Class holding the Results of the InitFunction.
 */
export class InitResult {
  // Singleton
  static #instance: InitResult | undefined = undefined;
  static get instance(): InitResult {
    if (this.#instance === undefined) throw new Error("Accessed InitResults before creation");
    return this.#instance;
  }

  /**
   * True if at least one addLocale call was made.
   */
  static get localesDefined(): boolean {
    return this.instance.locales.length !== 0;
  }

  /**
   * A Array with all Locale information in the order it was provided.
   */
  static get locales(): LocalesItem[] {
    return this.instance.locales;
  }

  /**
   * The locale wich is associated with the source.
   */
  static get sourceLocale(): string {
    return this.instance.sourceLocale ?? "en-x-dev";
  }

  /**
   * Calculate the Target Locales to be send to Lit localize.
   */
  static get targetLocales(): string[] {
    return this.instance.locales.map((i) => i.id);
  }

  /**
   * Creates an function lo load a locale with Lit Localize.
   * @returns the function to load a locale.
   */
  static get loadLocale(): (locale: string) => Promise<LocaleModule> {
    return async (locale: string): Promise<LocaleModule> => {
      const item = this.getLocaleById(locale);
      if (item === undefined) throw new Error("Should never happen");
      const translation = item.translation;
      if (translation === "source") throw new Error("Should never happen");
      return translation.templates(str, html);
    };
  }

  /**
   * Get the Validated version of a locale string.
   * @param locale - the locale to validate.
   * @returns the validated locale.
   */
  static getValidatedLocale(locale: string | undefined | null): string | undefined {
    if (!this.localesDefined) return undefined;
    if (locale === undefined || locale === null || this.locales.every((i) => locale !== i.id)) return this.instance.defaultLocale;
    return locale;
  }

  /**
   * Get a Locales Item by id.
   * @param locale - id of locale.
   * @returns the Locale Item (including all other metadata).
   */
  static getLocaleById(locale: string | undefined): LocalesItem | undefined {
    return this.locales.find((i) => locale === i.id);
  }

  /**
   * True if at least one addVersion call was made.
   */
  static get versionsDefined(): boolean {
    return this.instance.versions.length !== 0;
  }

  /**
   * A Array with all Version information in the order it was provided.
   */
  static get versions(): VersionItem[] {
    return this.instance.versions;
  }

  /**
   * Get the Validated version of a version string.
   * @param version - the version to validate.
   * @returns the validated locale.
   */
  static getValidatedVersion(version: string | undefined | null): string | undefined {
    if (!this.versionsDefined) return undefined;
    if (version === undefined || version === null || this.versions.every((i) => version !== i.id)) return this.instance.defaultVersion;
    return version;
  }

  /**
   * Get a Version Item by id.
   * @param version - id of version.
   * @returns the version Item (including all other metadata).
   */
  static getVersionById(version: string | undefined): VersionItem | undefined {
    return this.versions.find((i) => version === i.id);
  }

  /**
   * Do not intercept Anchor Tag Navigations.
   */
  static get disableAnchorInterception(): boolean {
    return this.instance.disableAnchorInterception;
  }

  /**
   * Returns the created Chapter Tree starting with the MainChapter.
   * Dosen't recreate the Chapters if the locale and version stayed the same.
   * @param locale - the locale to create the Chapters for.
   * @param version - the version to create the Chapters for.
   * @returns the MainChapterResult.
   */
  static getMainChapterCached(locale: string | undefined, version: string | undefined): MainChapterResult {
    return MainChapter.createCached(this.instance.mainChapter, locale, version);
  }

  locales: LocalesItem[];
  sourceLocale: string | undefined;
  defaultLocale: string | undefined;
  versions: VersionItem[];
  defaultVersion: string | undefined;
  disableAnchorInterception: boolean;
  mainChapter: MainChapterFunction;
  constructor(init: Init) {
    if (InitResult.#instance !== undefined) throw new Error("init can only be called once in the application");
    InitResult.#instance = this;
    this.locales = init.locales;
    if (init.defaultLocale === undefined && this.locales.length !== 0) throw new Error("There must be at least one default locale");
    this.sourceLocale = init.sourceLocale;
    this.defaultLocale = init.defaultLocale;
    this.versions = init.versions;
    if (init.defaultVersion === undefined && this.versions.length !== 0) throw new Error("There must be at least one default version");
    this.defaultVersion = init.defaultVersion;
    this.disableAnchorInterception = init.disableAnchorInterception;
    if (init.mainChapter === undefined) throw new Error("There needs to be a mainChapter");
    this.mainChapter = init.mainChapter;
  }

}