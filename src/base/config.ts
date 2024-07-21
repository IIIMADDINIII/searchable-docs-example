import type { LocaleModule } from "@lit/localize";

export type TranslationTemplates = (str: typeof import("@lit/localize").str, html: typeof import("lit").html) => LocaleModule;
export type Translation = "source" | TranslationTemplates;

export type LocaleTemplates<LanguageId extends string> = { [key in LanguageId]: Translation; };
export type OrderedDisplayNames<LanguageId extends string> = () => { [K in LanguageId]: string | [order: number, displayName: string]; };

export type DocsDescription = {};
export type VersionTemplates<VersionId extends string> = { [key in VersionId]: () => DocsDescription };

export type DocsConfig<LanguageId extends string = string, VersionId extends string = string> = {
  title: string;
  description: string;

  defaultLocale: NoInfer<LanguageId>;
  localeDisplayNames: OrderedDisplayNames<LanguageId>;
  localeTemplates: LocaleTemplates<LanguageId>;

  defaultVersion: NoInfer<VersionId>;
  versionDisplayNames: OrderedDisplayNames<VersionId>;
  versionTemplates: VersionTemplates<VersionId>;
};