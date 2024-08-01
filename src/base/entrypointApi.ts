import { renderChapter, type ChapterFunction, type ChapterResults } from "./capterApi.js";
import type { LocaleAndVersionInApi } from "./utils.js";


/**
 * Function to configure a chapter with its options.
 */
export type EntrypointFunction = (this: EntrypointApi, entrypoint: EntrypointApi) => void;

/**
 * List of types wich can be targeted with an id
 */
export type IdTargets = ChapterResults;

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
  /**
   * An array of all chapters in the entrypoint in the order in wich there where defined.
   */
  chapterArray: ChapterResults[];
  /**
   * A Map from Chapter ID to Chapter.
   */
  chapterMap: Map<string, ChapterResults>;
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
  /**
   * Add a chapter to the entrypoint.
   * @param chapter - function describing the chapter.
   */
  addChapter(chapter: ChapterFunction): void;
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
    const chapterFunctions: ChapterFunction[] = [];
    const chapterArray: ChapterResults[] = [];
    const chapterMap: Map<string, ChapterResults> = new Map();
    // Define the Api functions
    const api: EntrypointApi = {
      locale,
      version,
      title(t, d) {
        if (title !== undefined || description !== undefined) throw new Error("title and description was already defined previously");
        title = t;
        description = d;
      },
      addChapter(chapter) {
        chapterFunctions.push(chapter);
      }
    };
    // Call the Config Function with the Api
    configFunction.call(api, api);
    // Validate Config
    if (title === undefined || description === undefined) throw new Error("You need to set a Title and description using this.title in the init function");
    if (chapterFunctions.length === 0) throw new Error("You need to add at least one chapter to the entrypoint using this.addChapter in the init function");
    // Return Value
    const result: EntrypointResults = {
      title,
      description,
      chapterArray,
      chapterMap,
    };
    // render Chapters
    for (const chapterFunction of chapterFunctions) {
      const chapter = renderChapter(chapterFunction, locale, version, result);
      if (chapterMap.has(chapter.id)) throw new Error(`Chapter with id ${chapter.id} already exists (${chapter.fullId})`);
      chapterArray.push(chapter);
      chapterMap.set(chapter.id, chapter);
    }
    return result;
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