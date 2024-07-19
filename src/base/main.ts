import { configureLocalization, localized, str, type LocaleModule } from "@lit/localize";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { DirectiveResult } from "lit/directive.js";
import { guard } from "lit/directives/guard.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import type { DocsConfig } from "./config.js";
import { isElement } from "./utils.js";

export function docs<T extends string>(config: DocsConfig<T>) {
  try {
    new DocsMain(config);
  } catch (e) {
    console.error(e);
  }
}

type GetLocale = () => string;
type SetLocale = (newLocale: string) => Promise<void>;
type GetSetLocale = { sourceLocale: string, getLocale: GetLocale; setLocale: SetLocale; };

type UrlParams = {
  locale: string;
};

function getUrlParams(): Partial<UrlParams> {
  const result: { [key: string]: string; } = {};
  (new URL(location.href)).searchParams.forEach((v, k) => result[k] = v);
  return result;
}

function setUrlParams(params: UrlParams, init: boolean = false): void {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (init) {
    window.history.replaceState(params, "", url);
    return;
  }
  window.history.pushState({}, "", url);
};

@customElement("docs-main")
@localized()
class DocsMain extends LitElement {

  #config: DocsConfig;
  #setLocale: SetLocale;
  #lastLocale: string;
  #enableUpdateState: boolean = false;

  constructor(config: DocsConfig) {
    super();
    this.#config = config;
    ({ setLocale: this.#setLocale, sourceLocale: this.#lastLocale } = this.#configureLocalization());
    this.#setDocumentStyles();
    document.body.appendChild(this);
    this.#initState();
  }

  #configureLocalization(): GetSetLocale {
    let sourceLocale = "en-x-dev";
    const sourceTranslations = Object.entries(this.#config.translations).filter(([_, value]) => value === "source");
    if (sourceTranslations.length >= 2) throw new Error(`only one language can have the translation set to "source"`);
    const sourceLanguage = sourceTranslations[0]?.[0];
    if (sourceLanguage !== undefined) sourceLocale = sourceLanguage;
    return { sourceLocale, ...configureLocalization({ sourceLocale, targetLocales: ["de", "en"], loadLocale: this.#loadLocale.bind(this) }) };
  }

  async #loadLocale(locale: string): Promise<LocaleModule> {
    const translation = this.#config.translations[locale];
    if (typeof translation !== "function") throw new Error(`Invalid locale id: ${locale}`);
    return translation(str, html);
  }

  get #locale(): string {
    return this.#lastLocale;
  }
  set #locale(value: string) {
    this.#lastLocale = value;
    this.#setLocale(value).catch(console.error);
    this.#updateState();
  }

  #getState(): UrlParams {
    return {
      locale: this.#locale,
    };
  }

  #initState() {
    this.#onPopState();
    setUrlParams(this.#getState(), true);
    window.addEventListener("popstate", this.#onPopState.bind(this));
    this.#enableUpdateState = true;
  }

  #updateState() {
    if (!this.#enableUpdateState) return;
    setUrlParams(this.#getState());
  }

  #onPopState(): void {
    this.#enableUpdateState = false;
    try {
      const state = getUrlParams();
      this.#locale = this.#getLocaleState(state.locale);
    } finally {
      this.#enableUpdateState = true;
    }
  }

  #getLocaleState(locale: string | undefined): string {
    if (locale !== undefined && Object.hasOwn(this.#config.translations, locale)) return locale;
    return this.#config.defaultLanguage;
  }

  #setDocumentStyles() {
    const styleSheet = css`
    `.styleSheet;
    if (styleSheet === undefined) throw new Error("Error while creating Document Styles");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  }

  override render(): TemplateResult {
    return html`
      ${this.#renderLocaleSelector()}
    `;
  }

  #renderLocaleSelector(): DirectiveResult {
    return guard([this.#locale, this.#config.languageDisplayNames], () => html`
      <select .value=${live(this.#locale)} @change=${this.#onChangeLocale}>
        ${repeat(Object.entries(this.#config.languageDisplayNames()), (i) => i[0], (i) => html`<option value=${i[0]}>${i[1]}</option>`)}
      </select>
    `);
  }

  #onChangeLocale(e: Event): void {
    if (!isElement(e.currentTarget, "select")) return;
    this.#locale = e.currentTarget.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-main": DocsMain;
  }
}