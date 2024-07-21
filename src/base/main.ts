import { configureLocalization, localized, str, type LocaleModule } from "@lit/localize";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DirectiveResult } from "lit/directive.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import "./document";
import "./nav";
import "./select";
import type { DocsConfig, GetLocale, GetSetLocale, SetLocale, UrlParams } from "./types.js";
import { createCacheFunction, getUrlParams, getUrlWithParams, isElement, passThroughAttributeConverter, searchParamsToObject, setUrlParams, sortDisplayNames } from "./utils.js";

export function docs<LocaleId extends string, VersionId extends string>(config: DocsConfig<LocaleId, VersionId>) {
  try {
    new DocsMain(config);
  } catch (e) {
    console.error(e);
  }
}

@customElement("docs-main")
@localized()
class DocsMain<LocaleId extends string = string, VersionId extends string = string> extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      header {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid black;
        gap: 8px;
        docs-select {
          min-width: 104px;
        }
      }
      main {
        display: flex;
        flex-grow: 1;
        docs-nav {
          flex: 0 1 400px;
          min-width: 200px;
          display: none;
          overflow-y: scroll;
        }
        docs-document {
          flex: 0 1 1000px;
          min-width: 600px;
          overflow-y: scroll;
        }
      }
      .fill {
        flex-grow: 1;
      }
    }
    @media (min-width: 801px) {
      :host {
        main {
          docs-nav {
            display: block
          }
        }
      }
    }
  `;
  static override get observedAttributes(): string[] {
    return ["locale", ...super.observedAttributes];
  }

  #config: DocsConfig<LocaleId, VersionId>;
  #setLocale: SetLocale;
  #getLocale: GetLocale;
  #locale: LocaleId;
  #version: VersionId;
  #enableUpdateState: boolean = false;
  #titleElement: HTMLTitleElement = document.createElement("title");
  #descriptionElement: HTMLMetaElement = document.createElement("meta");

  constructor(config: DocsConfig<LocaleId, VersionId>) {
    super();
    this.#config = config;
    this.#locale = this.#config.defaultLocale;
    this.#version = this.#config.defaultVersion;
    this.#initDocument();
    ({ setLocale: this.#setLocale, getLocale: this.#getLocale } = this.#initLocale());
    this.#initState();
  }

  #initLocale(): GetSetLocale {
    const sourceTranslations = Object.entries(this.#config.localeTemplates).filter(([_, value]) => value === "source");
    if (sourceTranslations.length >= 2) throw new Error(`only one language can have the translation set to "source"`);
    const sourceLanguage = sourceTranslations[0]?.[0];
    let sourceLocale = "en-x-dev";
    if (this.#isValidLocale(sourceLanguage)) sourceLocale = sourceLanguage;
    const ret = configureLocalization({ sourceLocale, targetLocales: ["de", "en"], loadLocale: this.#loadLocale.bind(this) });
    return ret;
  }

  #initDocument() {
    document.head.appendChild(this.#titleElement);
    this.#descriptionElement.name = "description";
    document.head.appendChild(this.#descriptionElement);
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(metaViewport);
    this.#setDocumentStyles();
    document.body.appendChild(this);
    document.addEventListener("click", this.#interceptAnchorNavigation.bind(this));
  }

  #setDocumentStyles() {
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

  #initState() {
    // Get values from URL for initial state
    this.#onPopState();
    // Needs to be set again if language was not changed from default language
    // It is a noop if the locale was set by onPopState()
    this.#setLocale(this.#locale).catch(console.error);
    setUrlParams(this.#getState(), true);
    window.addEventListener("popstate", this.#onPopState.bind(this));
    this.#enableUpdateState = true;
  }

  async #loadLocale(locale: string): Promise<LocaleModule> {
    const template = this.#config.localeTemplates[this.#getValidatedLocale(locale)];
    if (template === "source") throw new Error("the source locale has no translation file wich could be loaded");
    return template(str, html);
  }

  set locale(value: LocaleId | string | undefined | null) {
    const validated = this.#getValidatedLocale(value);
    if (this.#locale === validated) return;
    this.#locale = validated;
    if (this.getAttribute("locale") !== this.#locale) this.setAttribute("locale", this.#locale);
    this.#setLocale(this.#locale).catch(console.error);
    document.documentElement.setAttribute("lang", this.#locale);
    this.#updateState();
  }
  get locale(): LocaleId {
    return this.#locale;
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === "locale") {
      this.locale = value;
      return;
    }
    super.attributeChangedCallback(name, _old, value);
  }

  @property({ reflect: true, converter: passThroughAttributeConverter })
  set version(value: VersionId | string | undefined | null) {
    const validated = this.#getValidatedVersion(value);
    if (this.#version === validated) return;
    this.#version = validated;
    this.#updateState();
  }
  get version(): VersionId {
    return this.#version;
  }

  #updateState() {
    if (!this.#enableUpdateState) return;
    setUrlParams(this.#getState());
  }

  #onPopState(): void {
    this.#setState(getUrlParams());
  }

  #setState(state: Partial<UrlParams>): void {
    this.#enableUpdateState = false;
    try {
      if ("locale" in state) this.locale = state.locale;
      if ("version" in state) this.version = state.version;
    } finally {
      this.#enableUpdateState = true;
    }
  }

  #getState(): UrlParams {
    return {
      locale: this.locale,
      version: this.version,
    };
  }

  #interceptAnchorNavigation(e: Event) {
    if (this.#config.disableAnchorInterception) return;
    const target = e.composedPath()[0];
    if (!isElement(target, "a")) return;
    const url = new URL(target.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    e.preventDefault();
    this.#setState(searchParamsToObject(url));
    this.#updateState();
  }

  #getValidatedLocale(locale: string | undefined | null): LocaleId {
    if (this.#isValidLocale(locale)) return locale;
    return this.#config.defaultLocale;
  }

  #isValidLocale(locale: string | undefined | null): locale is LocaleId {
    return typeof locale === "string" && Object.hasOwn(this.#config.localeTemplates, locale);
  }

  #getValidatedVersion(version: string | undefined | null): VersionId {
    if (this.#isValidVersion(version)) return version;
    return this.#config.defaultVersion;
  }

  #isValidVersion(version: string | undefined | null): version is VersionId {
    return typeof version === "string" && Object.hasOwn(this.#config.versionTemplates, version);
  }

  override render(): TemplateResult {
    return html`
      <header>
        <div class="fill"></div>
        ${this.#renderVersionSelector()}
        ${this.#renderLocaleSelector()}
      </header>
      ${this.#rerenderDocument()}
    `;
  }

  #rerenderDocumentCache = createCacheFunction();
  #rerenderDocument(): TemplateResult {
    const template = this.#rerenderDocumentCache([this.#getLocale(), this.version], () => this.#config.versionTemplates[this.version]());
    this.#titleElement.innerText = template.title;
    this.#descriptionElement.content = template.description;
    return html`
      <main>
        <docs-nav .docsDescription=${template}></docs-nav>
        <div class="fill"></div>
        <docs-document .docsDescription=${template}></docs-document>
        <div class="fill"></div>
      </main>
    `;
  }

  #renderLocaleSelectorCache = createCacheFunction();
  #renderLocaleSelector(): TemplateResult {
    const { array, map } = this.#renderLocaleSelectorCache([this.#getLocale()], () => sortDisplayNames(this.#config.localeDisplayNames));
    const selected = this.locale;
    return html`
      <docs-select>
        <span slot="selected">${map[selected].displayName}</span>
        ${repeat(array, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selected })} href=${getUrlWithParams({ locale: id }).href}>${displayName}</a>`)}
      </docs-select>
    `;
  }

  #renderVersionSelectorCache = createCacheFunction();
  #renderVersionSelector(): DirectiveResult {
    const { array, map } = this.#renderVersionSelectorCache([this.#getLocale(), this.version], () => sortDisplayNames(this.#config.versionDisplayNames));
    const selected = this.version;
    return html`
      <docs-select>
        <span slot="selected">${map[selected].displayName}</span>
        ${repeat(array, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selected })} href=${getUrlWithParams({ version: id }).href}>${displayName}</a>`)}
      </docs-select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-main": DocsMain;
  }
};