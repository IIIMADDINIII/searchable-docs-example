import type { LocaleModule } from "@lit/localize";

export type TranslationTemplates = (str: typeof import("@lit/localize").str, html: typeof import("lit").html) => LocaleModule;
export type Translation = "source" | TranslationTemplates;

export type LocaleTemplates<LocaleId extends string> = { [key in LocaleId]: Translation; };
export type OrderedDisplayNamesElement = string | [order: number, displayName: string];
export type OrderedDisplayNames<LocaleId extends string> = () => { [K in LocaleId]: OrderedDisplayNamesElement; };

export type DocsDescription = { displayName: string; };
export type VersionTemplates<VersionId extends string> = { [key in VersionId]: () => DocsDescription };

export type DocsConfig<LocaleId extends string = string, VersionId extends string = string> = {
  title: string;
  description: string;

  defaultLocale: NoInfer<LocaleId>;
  localeDisplayNames: OrderedDisplayNames<LocaleId>;
  localeTemplates: LocaleTemplates<LocaleId>;

  defaultVersion: NoInfer<VersionId>;
  versionDisplayNames: OrderedDisplayNames<VersionId>;
  versionTemplates: VersionTemplates<VersionId>;
};

export type GetLocale = () => string;
export type SetLocale = (newLocale: string) => Promise<void>;
export type GetSetLocale = { getLocale: GetLocale; setLocale: SetLocale; };

export type UrlParams = {
  locale: string;
  version: string;
};
