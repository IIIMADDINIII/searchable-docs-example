import type { LocaleModule } from "@lit/localize";

export type TranslationTemplates = (str: typeof import("@lit/localize").str, html: typeof import("lit").html) => LocaleModule;
export type Translation = "source" | TranslationTemplates;

export type Translations<T extends string> = { [key in T]: Translation; };
export type LanguageDisplayNames<T extends string> = () => { [K in T]: string | [order: number, displayName: string]; };

export type DocsConfig<T extends string = string> = {
  defaultLocale: NoInfer<T>;
  localeDisplayNames: LanguageDisplayNames<T>;
  localeTemplates: Translations<T>;

  title: string;
  description: string;
};