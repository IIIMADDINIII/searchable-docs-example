import type { LocaleModule } from "@lit/localize";

export type TranslationTemplates = (str: typeof import("@lit/localize").str, html: typeof import("lit").html) => LocaleModule;
export type Translation = "source" | TranslationTemplates;

export type LocaleTemplates<LocaleId extends string> = { [key in LocaleId]: Translation; };

export type OrderedDisplayNamesElement = string | [order: number, displayName: string];
export type OrderedDisplayNames<Id extends string> = () => { [K in Id]: OrderedDisplayNamesElement; };
export type DisplayNamesArray<Id extends string> = { id: Id, order: number, displayName: string; }[];
export type DisplayNamesMap<Id extends string> = { [K in Id]: { id: Id, order: number, displayName: string; } };

export type DocsDescription = {
  title: string;
  description: string;
};
export type VersionTemplates<VersionId extends string> = { [key in VersionId]: () => DocsDescription };

export type DocsConfig<LocaleId extends string = string, VersionId extends string = string> = {

  defaultLocale: NoInfer<LocaleId>;
  localeDisplayNames: OrderedDisplayNames<LocaleId>;
  localeTemplates: LocaleTemplates<LocaleId>;

  defaultVersion: NoInfer<VersionId>;
  versionDisplayNames: OrderedDisplayNames<VersionId>;
  versionTemplates: VersionTemplates<VersionId>;

  disableAnchorInterception?: boolean | undefined;
};

export type GetLocale = () => string;
export type SetLocale = (newLocale: string) => Promise<void>;
export type GetSetLocale = { getLocale: GetLocale; setLocale: SetLocale; };

export type UrlParams = {
  locale: string;
  version: string;
};
