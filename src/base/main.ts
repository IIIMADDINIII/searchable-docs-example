import { configureLocalization, localized, str, type LocaleModule } from "@lit/localize";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DirectiveResult } from "lit/directive.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import "./document";
import type { InitResult } from "./initApi.js";
import "./nav";
import "./select";
import { getUrlParams, getUrlWithParams, isElement, renderError, searchParamsToObject, setUrlParams, type UrlParams } from "./utils.js";

export type GetLocale = () => string;
export type SetLocale = (newLocale: string) => Promise<void>;
export type GetSetLocale = { getLocale: GetLocale; setLocale: SetLocale; };

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
        docs-document {
          flex: 0 1 1000px;
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

  #config: InitResult;
  #setLocale: SetLocale;
  #getLocale: GetLocale;
  #locale: string | undefined = undefined;
  #version: string | undefined = undefined;
  #enableUpdateState: boolean = false;
  #titleElement: HTMLTitleElement = document.createElement("title");
  #descriptionElement: HTMLMetaElement = document.createElement("meta");

  constructor(options: InitResult) {
    super();
    this.#config = options;
    this.#initDocument();
    ({ setLocale: this.#setLocale, getLocale: this.#getLocale } = this.#initLocale());
    this.#initState();
  }

  #initLocale(): GetSetLocale {
    if (!this.#config.localesDefined) return {
      setLocale: () => Promise.resolve(),
      getLocale: () => "",
    };
    let sourceLocale = this.#config.sourceLocale ?? "en-x-dev";
    const targetLocales = [...this.#config.localesMap.keys()];
    return configureLocalization({ sourceLocale, targetLocales, loadLocale: this.#loadLocale.bind(this) });
  }

  async #loadLocale(locale: string): Promise<LocaleModule> {
    const validated = this.#getValidatedLocale(locale);
    if (validated === undefined) throw new Error("Should never happen");
    const item = this.#config.localesMap.get(validated);
    if (item === undefined) throw new Error("Should never happen");
    const translation = item.translation;
    if (translation === "source") throw new Error("Should never happen");
    return translation.templates(str, html);
  }

  #initDocument() {
    document.head.appendChild(this.#titleElement);
    this.#descriptionElement.name = "description";
    document.head.appendChild(this.#descriptionElement);
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(metaViewport);
    document.addEventListener("click", this.#interceptAnchorNavigation.bind(this));
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
    const validated = this.#getValidatedLocale(value);
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

  #getValidatedLocale(locale: string | undefined | null): string | undefined {
    if (!this.#config.localesDefined) return undefined;
    if (locale === undefined || locale === null) return this.#config.defaultLocale;
    return locale;
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === "locale") {
      this.locale = value;
      return;
    }
    super.attributeChangedCallback(name, _old, value);
  }

  @property({ reflect: true })
  set version(value: string | undefined | null) {
    const validated = this.#getValidatedVersion(value);
    if (this.#version === validated) return;
    if (validated === undefined) throw new Error("Should never happen");
    this.#version = validated;
    this.#updateState();
  }
  get version(): string | undefined {
    return this.#version;
  }

  #getValidatedVersion(version: string | undefined | null): string | undefined {
    if (!this.#config.versionsDefined) return undefined;
    if (version === undefined || version === null) return this.#config.defaultVersion;
    return version;
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
    if (this.#config.disableAnchorInterception) return;
    const target = e.composedPath()[0];
    if (!isElement(target, "a")) return;
    const url = new URL(target.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    e.preventDefault();
    this.#setState(searchParamsToObject(url));
    this.#updateState();
  }

  override render(): TemplateResult {
    try {
      return html`
        <header>
          <div class="fill"></div>
          ${this.#renderVersionSelector()}
          ${this.#renderLocaleSelector()}
        </header>
        ${this.#rerenderDocument()}
      `;
    } catch (error) {
      console.error(error);
      return renderError(error);
    }
  }

  #rerenderDocument(): TemplateResult {
    const entrypoint = this.#config.entrypoint(this.#getLocale(), this.version);
    this.#titleElement.innerText = entrypoint.title;
    this.#descriptionElement.content = entrypoint.description;
    return html`
      <main>
        <div class="fill"></div>
        <docs-document .document=${entrypoint}></docs-document>
        <div class="fill"></div>
      </main>
    `;
  }

  #renderLocaleSelector(): TemplateResult {
    if (!this.#config.localesDefined || this.locale === undefined) return html``;
    const selectedItem = this.#config.localesMap.get(this.locale);
    if (selectedItem === undefined) return html``;
    return html`
      <docs-select>
        <span slot="selected">${selectedItem.displayName()}</span>
        ${repeat(this.#config.localesArray, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selectedItem.id })} href=${getUrlWithParams({ locale: id }).href}>${displayName()}</a>`)}
      </docs-select>
    `;
  }

  #renderVersionSelector(): DirectiveResult {
    if (!this.#config.versionsDefined || this.version === undefined) return html``;
    const selectedItem = this.#config.versionsMap.get(this.version);
    if (selectedItem === undefined) return html``;
    return html`
      <docs-select>
        <span slot="selected">${selectedItem.displayName()}</span>
        ${repeat(this.#config.versionsArray, ({ id, displayName }) => html`<a class=${classMap({ selected: id === selectedItem.id })} href=${getUrlWithParams({ version: id }).href}>${displayName()}</a>`)}
      </docs-select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-main": DocsMain;
  }
};