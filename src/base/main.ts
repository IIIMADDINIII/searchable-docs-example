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
    this.#initDocument();
    this.#initState();
  }

  #initDocument() {
    const title = document.createElement("title");
    title.innerText = this.#config.title;
    document.head.appendChild(title);
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(metaViewport);
    const metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = this.#config.description;
    document.head.appendChild(metaDescription);
    this.#setDocumentStyles();
    document.body.appendChild(this);
  }

  #setDocumentStyles() {
    const styleSheet = css`
    `.styleSheet;
    if (styleSheet === undefined) throw new Error("Error while creating Document Styles");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  }

  #configureLocalization(): GetSetLocale {
    let sourceLocale = "en-x-dev";
    const sourceTranslations = Object.entries(this.#config.localeTemplates).filter(([_, value]) => value === "source");
    if (sourceTranslations.length >= 2) throw new Error(`only one language can have the translation set to "source"`);
    const sourceLanguage = sourceTranslations[0]?.[0];
    if (sourceLanguage !== undefined) sourceLocale = sourceLanguage;
    return { sourceLocale, ...configureLocalization({ sourceLocale, targetLocales: ["de", "en"], loadLocale: this.#loadLocale.bind(this) }) };
  }

  async #loadLocale(locale: string): Promise<LocaleModule> {
    const translation = this.#config.localeTemplates[locale];
    if (typeof translation !== "function") throw new Error(`Invalid locale id: ${locale}`);
    return translation(str, html);
  }

  get #locale(): string {
    return this.#lastLocale;
  }
  set #locale(value: string) {
    this.#lastLocale = value;
    this.#setLocale(value).catch(console.error);
    document.documentElement.setAttribute("lang", value);
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
    if (locale !== undefined && Object.hasOwn(this.#config.localeTemplates, locale)) return locale;
    return this.#config.defaultLocale;
  }



  override render(): TemplateResult {
    return html`
      ${this.#renderLocaleSelector()}
    `;
  }

  #renderLocaleSelector(): DirectiveResult {
    return guard([this.#locale, this.#config.localeDisplayNames], () => {
      const renderedLocales = Object.entries(this.#config.localeDisplayNames());
      const sortedLocales = renderedLocales
        .map((v) => typeof v[1] === "string" ? [v[0], [Number.MAX_SAFE_INTEGER, v[1]]] as const : [v[0], v[1]] as const)
        .sort((a, b) => a[1][0] - b[1][0]);
      const locale = this.#locale;
      return html`
        <select @change=${this.#onChangeLocale}>
          ${repeat(sortedLocales, (i) => i[0], (i) => html`<option value=${i[0]} .selected=${live(i[0] === locale)}>${i[1][1]}</option>`)}
        </select>
      `;
    });
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