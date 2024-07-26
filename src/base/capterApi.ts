import type { LocaleAndVersionInApi } from "./utils.js";


/**
 * Function to configure a chapter with its options.
 */
export type ChapterFunction = (this: ChapterApi) => void;

/**
 * Result of calling the chapter Render Method.
 * Contains all the Information of a chapter.
 */
export type ChapterResults = {
  /**
   * Title of this chapter.
   */
  title: string;
};

/**
 * The function to get the Result of the Init config.
 */
export type RenderChapter = (locale: string, version: string) => ChapterResults;

/**
 * Api Definition for the ChapterFunction.
 * Can be accessed with the this keyword.
 */
export type ChapterApi = LocaleAndVersionInApi & {
  /**
   * Set 
   * @param title 
   */
  title(title: string): void;
};


/**
 * This is generating the RenderChapter function for a given configFunction.
 * @param configFunction - the ConfigFunction to create a Render Function for.
 * @returns the Render Function.
 */
export function getRenderChapter(configFunction: ChapterFunction): RenderChapter {
  return function update(locale: string | undefined, version: string | undefined): ChapterResults {
    // Define variables for the result
    let title: string | undefined = undefined;
    // Define the Api functions
    const api: ChapterApi = {
      locale,
      version,
      title(t) {
        if (title !== undefined) throw new Error("title was already defined previously");
        title = t;
      },
    };
    // Call the Config Function with the Api
    configFunction.call(api);
    // Validate Config
    if (title === undefined) throw new Error("You need to set a Title using this.title in the chapter function");
    // Return result
    return {
      title,
    };
  };
};