import { configureLocalization, localized, str, type LocaleModule } from "@lit/localize";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DirectiveResult } from "lit/directive.js";
import { guard } from "lit/directives/guard.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import "./nav";
import type { DocsConfig, GetSetLocale, OrderedDisplayNamesElement, SetLocale, UrlParams } from "./types.js";
import { getUrlParams, isElement, passThroughAttributeConverter, setUrlParams } from "./utils.js";

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

  static override get observedAttributes(): string[] {
    return ["locale", ...super.observedAttributes];
  }

  #config: DocsConfig<LocaleId, VersionId>;
  #setLocale: SetLocale;
  #locale: LocaleId = <LocaleId>"en-x-dev";
  #version: VersionId = <VersionId>"";
  #enableUpdateState: boolean = false;

  constructor(config: DocsConfig<LocaleId, VersionId>) {
    super();
    this.#config = config;
    ({ setLocale: this.#setLocale } = this.#initLocale());
    this.#initDocument();
    this.#initState();
  }

  #initLocale(): GetSetLocale {
    const sourceTranslations = Object.entries(this.#config.localeTemplates).filter(([_, value]) => value === "source");
    if (sourceTranslations.length >= 2) throw new Error(`only one language can have the translation set to "source"`);
    const sourceLanguage = sourceTranslations[0]?.[0];
    if (this.#isValidLocale(sourceLanguage)) this.#locale = sourceLanguage;
    return { ...configureLocalization({ sourceLocale: this.#locale, targetLocales: ["de", "en"], loadLocale: this.#loadLocale.bind(this) }) };
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

  #initState() {
    this.#onPopState();
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
    this.#locale = this.#getValidatedLocale(value);
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
    this.#version = this.#getValidatedVersion(value);
    this.#updateState();
  }
  get version(): VersionId {
    return this.#version;
  }

  #getState(): UrlParams {
    return {
      locale: this.locale,
      version: this.version,
    };
  }

  #updateState() {
    if (!this.#enableUpdateState) return;
    setUrlParams(this.#getState());
  }

  #onPopState(): void {
    this.#enableUpdateState = false;
    try {
      const state = getUrlParams();
      this.locale = state.locale;
      this.version = state.version;
    } finally {
      this.#enableUpdateState = true;
    }
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
        ${this.#renderVersionSelector()}
        ${this.#renderLocaleSelector()}
      </header>
      ${guard([this.locale, this.version], () => html`<docs-nav .docsDescription=${this.#config.versionTemplates[this.version]()}></docs-nav>`)}
    `;
  }

  #renderLocaleSelector(): DirectiveResult {
    return guard([this.locale, this.#config.localeDisplayNames], () => {
      const rendered = Object.entries<OrderedDisplayNamesElement>(this.#config.localeDisplayNames());
      const sorted = rendered
        .map((v) => typeof v[1] === "string" ? [v[0], [Number.MAX_SAFE_INTEGER, v[1]]] as const : [v[0], v[1]] as const)
        .sort((a, b) => a[1][0] - b[1][0]);
      const selected = this.locale;
      return html`
        <select @change=${this.#onChangeLocale}>
          ${repeat(sorted, (i) => i[0], (i) => html`<option value=${i[0]} .selected=${live(i[0] === selected)}>${i[1][1]}</option>`)}
        </select>
      `;
    });
  }

  #onChangeLocale(e: Event): void {
    if (!isElement(e.currentTarget, "select")) return;
    this.locale = e.currentTarget.value;
  }

  #renderVersionSelector(): DirectiveResult {
    return guard([this.version, this.#config.versionDisplayNames], () => {
      const rendered = Object.entries<OrderedDisplayNamesElement>(this.#config.versionDisplayNames());
      const sorted = rendered
        .map((v) => typeof v[1] === "string" ? [v[0], [Number.MAX_SAFE_INTEGER, v[1]]] as const : [v[0], v[1]] as const)
        .sort((a, b) => a[1][0] - b[1][0]);
      const selected = this.version;
      return html`
        <select @change=${this.#onChangeVersion}>
          ${repeat(sorted, (i) => i[0], (i) => html`<option value=${i[0]} .selected=${live(i[0] === selected)}>${i[1][1]}</option>`)}
        </select>
      `;
    });
  }

  #onChangeVersion(e: Event): void {
    if (!isElement(e.currentTarget, "select")) return;
    this.version = e.currentTarget.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-main": DocsMain;
  }
};