import type { EntrypointResults } from "./entrypointApi.js";
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
   * Id of this chapter used for linking
   */
  id: string;
  /**
   * full id of the chapter.
   * this is a list of all ids down to this id joined by "*". 
   */
  fullId: string;
  /**
   * Title of this chapter.
   */
  title: string;
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
export type RenderChapter = (locale: string, version: string) => ChapterResults;

/**
 * Api Definition for the ChapterFunction.
 * Can be accessed with the this keyword.
 */
export type ChapterApi = LocaleAndVersionInApi & {
  /**
   * Set the Id and Title of the chapter.
   * @param id - the id of the chapter used to link to this chapter.
   * @param title - name of the chapter.
   */
  title(id: string, title: string): void;
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
export function renderChapter(configFunction: ChapterFunction, locale: string | undefined, version: string | undefined, parent: ChapterResults | EntrypointResults): ChapterResults {
  // Define variables for the result
  let id: string | undefined = undefined;
  let title: string | undefined = undefined;
  const chapterFunctions: ChapterFunction[] = [];
  const chapterArray: ChapterResults[] = [];
  const chapterMap: Map<string, ChapterResults> = new Map();
  // Define the Api functions
  const api: ChapterApi = {
    locale,
    version,
    title(i, t) {
      if (title !== undefined || id !== undefined) throw new Error("title was already defined previously");
      id = i;
      title = t;
    },
    addChapter(chapter) {
      chapterFunctions.push(chapter);
    },
  };
  // Call the Config Function with the Api
  configFunction.call(api);
  // Validate Config
  if (title === undefined || id === undefined) throw new Error("You need to set a Id and Title using this.title in the chapter function");
  // Return value
  const result: ChapterResults = {
    id,
    fullId: "fullId" in parent ? `${parent.fullId}*${id}` : id,
    title,
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
};