import type { LocaleAndVersionInApi } from "./utils.js";


/**
 * Function to configure a chapter with its options.
 */
export type EntrypointFunction = (this: EntrypointApi) => void;

/**
 * Result of calling the chapter Render Method.
 * Contains all the Information of a chapter.
 */
export type EntrypointResults = {
  /**
   * Function to render the general Title.
   */
  title: string;
  /**
   * Function to render the general Description.
   */
  description: string;
};

/**
 * The function to get the Result of the Init config.
 */
export type RenderEntrypoint = (locale: string | undefined, version: string | undefined) => EntrypointResults;

/**
 * Api Definition for the ChapterFunction.
 * Can be accessed with the this keyword.
 */
export type EntrypointApi = LocaleAndVersionInApi & {
  /**
   * Set a General Title and Description for the App.
   * @param title - Title of the App.
   * @param description - Description of the App.
   */
  title(title: string, description: string): void;
};

/**
 * This is generating the RenderChapter function for a given configFunction.
 * @param configFunction - the ConfigFunction to create a Render Function for.
 * @returns the Render Function.
 */
export function getRenderEntrypoint(configFunction: EntrypointFunction): RenderEntrypoint {
  function update(locale: string | undefined, version: string | undefined): EntrypointResults {
    // Define variables for the result
    let title: string | undefined = undefined;
    let description: string | undefined = undefined;

    // Define the Api functions
    const api: EntrypointApi = {
      locale,
      version,
      title(t, d) {
        if (title !== undefined || description !== undefined) throw new Error("title and description was already defined previously");
        title = t;
        description = d;
      },
    };
    // Call the Config Function with the Api
    configFunction.call(api);
    // Validate Config
    if (title === undefined || description === undefined) throw new Error("You need to set a Title and description using this.title in the init function");
    // Return result
    return {
      title,
      description,
    };
  }
  // Caching
  let lastLocale: string | undefined = undefined;
  let lastVersion: string | undefined = undefined;
  let last: EntrypointResults | undefined = undefined;
  return function renderLocales(locale: string | undefined, version: string | undefined): EntrypointResults {
    if (last === undefined || lastLocale !== locale || lastVersion !== version) {
      last = update(locale, version);
      lastLocale = locale;
      lastVersion = version;
    }
    return last;
  };
};