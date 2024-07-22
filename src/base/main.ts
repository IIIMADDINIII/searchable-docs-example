import { configureLocalization, localized } from "@lit/localize";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DirectiveResult } from "lit/directive.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import "./document";
import "./nav";
import type { LocalesResults, VersionsResults } from "./private.js";
import "./select";
import { getUrlParams, getUrlWithParams, isElement, passThroughAttributeConverter, searchParamsToObject, setUrlParams, type Api, type UrlParams } from "./utils.js";

export type GetLocale = () => string;
export type SetLocale = (newLocale: string) => Promise<void>;
export type GetSetLocale = { getLocale: GetLocale; setLocale: SetLocale; };

type DocsMainOptions = {
  locales: Api<LocalesResults>;
  versions: Api<VersionsResults>;
  disableAnchorInterception: boolean;
};

@customElement("docs-main")
@localized()
export class DocsMain extends LitElement {
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
          min-width: 80px;
        }
      }
      main {
        display: flex;
        flex-grow: 1;
        docs-nav {
          flex: 0 1 400px;
          min-width: 200px;
          display: none;
          overflow-y: auto;
          border-right: 1px solid black;
        }
        &>div {
          display: flex;
          flex: 1 1 1000px;
          overflow-y: auto;
          docs-document {
            flex: 0 1 1000px;
          }
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

  #options: DocsMainOptions;
  #setLocale: SetLocale;
  #getLocale: GetLocale;
  #locale: string | undefined = undefined;
  #version: string | undefined = undefined;
  #enableUpdateState: boolean = false;
  #titleElement: HTMLTitleElement = document.createElement("title");
  #descriptionElement: HTMLMetaElement = document.createElement("meta");

  constructor(options: DocsMainOptions) {
    super();
    this.#options = options;
    this.#initDocument();
    ({ setLocale: this.#setLocale, getLocale: this.#getLocale } = this.#initLocale());
    this.#initState();
  }

  #initLocale(): GetSetLocale {
    const config = this.#options.locales(undefined);
    if (config.array.length === 0) return {
      setLocale: () => Promise.resolve(),
      getLocale: () => "",
    };
    this.#locale = config.source;
    return configureLocalization({ sourceLocale: this.#locale, targetLocales: config.targets, loadLocale: async (locale) => this.#localeConfig.getTemplate(locale) });
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
    if (this.locale !== undefined) this.#setLocale(this.locale).catch(console.error);
    setUrlParams(this.#getState(), true);
    window.addEventListener("popstate", this.#onPopState.bind(this));
    this.#enableUpdateState = true;
  }

  set locale(value: string | undefined | null) {
    const validated = this.#localeConfig.getValidated(value);
    if (this.#locale === validated) return;
    if (validated === undefined) throw new Error("Should never happen");
    this.#locale = validated;
    if (this.getAttribute("locale") !== this.#locale) this.setAttribute("locale", this.#locale);
    this.#setLocale(this.#locale).catch(console.error);
    document.documentElement.setAttribute("lang", this.#locale);
    this.#updateState();
  }
  get locale(): string | undefined {
    return this.#locale;
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === "locale") {
      this.locale = value;
      return;
    }
    super.attributeChangedCallback(name, _old, value);
  }

  get #localeConfig(): LocalesResults {
    return this.#options.locales(this.#getLocale());
  }

  @property({ reflect: true, converter: passThroughAttributeConverter })
  set version(value: string | undefined | null) {
    const validated = this.#versionConfig.getValidated(value);
    if (this.#version === validated) return;
    if (validated === undefined) throw new Error("Should never happen");
    this.#version = validated;
    this.#updateState();
  }
  get version(): string | undefined {
    return this.#version;
  }

  get #versionConfig(): VersionsResults {
    return this.#options.versions(this.#getLocale());
  }

  #updateState() {
    if (!this.#enableUpdateState) return;
    setUrlParams(this.#getState());
  }

  #onPopState(): void {
    this.#setState(getUrlParams());
  }

  #setState(state: UrlParams): void {
    this.#enableUpdateState = false;
    try {
      this.locale = state.locale;
      this.version = state.version;
    } finally {
      this.#enableUpdateState = true;
    }
  }

  #getState(): UrlParams {
    const ret: UrlParams = {};
    if (this.locale !== undefined) ret.locale = this.locale;
    if (this.version !== undefined) ret.version = this.version;
    return ret;
  }

  #interceptAnchorNavigation(e: Event) {
    if (this.#options.disableAnchorInterception) return;
    const target = e.composedPath()[0];
    if (!isElement(target, "a")) return;
    const url = new URL(target.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    e.preventDefault();
    this.#setState(searchParamsToObject(url));
    this.#updateState();
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

  #rerenderDocument(): TemplateResult {
    const template = { title: "test", description: "test" };
    this.#titleElement.innerText = template.title;
    this.#descriptionElement.content = template.description;
    return html`
      <main>
        <docs-nav .docsDescription=${template}></docs-nav>
        <div>
          <div class="fill"></div>
          <docs-document .docsDescription=${template}></docs-document>
          <div class="fill"></div>
        </div>
      </main>
    `;
  }

  #renderLocaleSelector(): TemplateResult {
    const config = this.#localeConfig;
    const selected = this.locale;
    return html`
      <docs-select>
        <span slot="selected">${config.getDisplayName(selected)}</span>
        ${repeat(config.array, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selected })} href=${getUrlWithParams({ locale: id }).href}>${displayName}</a>`)}
      </docs-select>
    `;
  }

  #renderVersionSelector(): DirectiveResult {
    const config = this.#versionConfig;
    const selected = this.version;
    return html`
      <docs-select>
        <span slot="selected">${config.getDisplayName(selected)}</span>
        ${repeat(config.array, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selected })} href=${getUrlWithParams({ version: id }).href}>${displayName}</a>`)}
      </docs-select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-main": DocsMain;
  }
};