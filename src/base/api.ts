import { DocsMain } from "./main.js";
import { locales, version as versions, type LocalesFunction, type VersionsFunction } from "./private.js";

export type FolderOptions = {
  id: string;
  folder(): void;
  document?(): void;
};

export type DocumentOptions = {
  id: string;
  document(): void;
};

export type InitFolderDocumentOptions = Omit<FolderOptions, "id"> | Omit<DocumentOptions, "id">;

export type InitOptions = InitFolderDocumentOptions & {
  /**
   * Function to configure the available locales.
   * Will use source locale when not defined.
   */
  locales?: LocalesFunction;
  /**
   * Function to configure the available versions of this Documentation.
   * Only a single unnamed version is used when not defined.
   */
  versions?: VersionsFunction;
  /**
   * Disable Anchor tag interception.
   * Will do a page load on every navigation if true.
   * @default false;
   */
  disableAnchorInterception?: boolean | undefined;
};

export function init(options: InitOptions) {
  try {
    new DocsMain({
      disableAnchorInterception: options.disableAnchorInterception === true,
      locales: locales(options.locales),
      versions: versions(options.versions),
    });
  } catch (e) {
    console.error();
  }
}