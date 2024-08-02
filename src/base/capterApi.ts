import { nothing, type TemplateResult } from "lit";
import { asserValidId, ID_SEP, type LocaleAndVersionInApi } from "./utils.js";

/**
 * Function to configure a chapter with its options.
 */
export type ChapterFunction = (this: ChapterApi, chapter: ChapterApi) => void;

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
   * Description of this Chapter.
   */
  description: string;
  /**
   * full id of the chapter.
   * this is a list of all ids down to this id joined by ID_SEP. 
   */
  fullId: string;
  /**
   * Title of this chapter.
   */
  title: string;
  /**
   * Content of the Chapter
   */
  content: TemplateResult | string | typeof nothing;
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
 * Result of the Main Chapter Render function.
 */
export type MainChapterResult = Omit<ChapterResults, "id" | "fullId"> & {
  /**
   * Id of this chapter used for linking
   */
  id: undefined;
  /**
   * full id of the chapter.
   * this is a list of all ids down to this id joined by ID_SEP. 
   */
  fullId: undefined;
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
   * Set the ID of this Chapter.
   * @param id - id of this chapter needs to be unique in this chapter.
   */
  id(id: string): void;
  /**
   * Set the Id and Title of the chapter.
   * @param title - name of the chapter.
   */
  title(title: string): void;
  /**
   * Add a description to this Chapter.
   * @param description - description for this chapter.
   */
  description(description: string): void;
  /**
   * Set the content of the Chapter.
   * This is always displayed before sub chapters.
   * @param content - the content to render.
   */
  content(content: TemplateResult | string): void;
  /**
   * Add a chapter to the entrypoint.
   * @param chapter - function describing the chapter.
   */
  addChapter(chapter: ChapterFunction): void;
};

/**
 * This is generating the RenderChapter function for a given configFunction.
 * @param chapterFunction - the ConfigFunction to create a Render Function for.
 * @returns the Render Function.
 */
export function renderChapter(chapterFunction: ChapterFunction, locale: string | undefined, version: string | undefined, parent: undefined): MainChapterResult;
export function renderChapter(chapterFunction: ChapterFunction, locale: string | undefined, version: string | undefined, parent: ChapterResults | MainChapterResult): ChapterResults;
export function renderChapter(chapterFunction: ChapterFunction, locale: string | undefined, version: string | undefined, parent: ChapterResults | MainChapterResult | undefined): ChapterResults | MainChapterResult {
  // Define variables for the result
  let id: string | undefined = undefined;
  let fullId: string | undefined = undefined;
  let title: string | undefined = undefined;
  let description: string | undefined = undefined;
  let content: TemplateResult | string | typeof nothing = nothing;
  const chapterFunctions: ChapterFunction[] = [];
  const chapterArray: ChapterResults[] = [];
  const chapterMap: Map<string, ChapterResults> = new Map();
  // Define the Api functions
  const api: ChapterApi = {
    locale,
    version,
    id(i) {
      if (id !== undefined) throw new Error("id was already defined previously");
      if (parent === undefined) throw new Error("Main Chapter is not allowed to have an id");
      asserValidId(i);
      id = i;
      fullId = parent.fullId !== undefined ? parent.fullId + ID_SEP + id : id;
    },
    title(t) {
      if (title !== undefined) throw new Error("title was already defined previously");
      title = t;
    },
    description(d) {
      if (description !== undefined) throw new Error("description was already defined previously");
      description = d;
    },
    content(c) {
      if (content !== nothing) throw new Error("content was already defined previously");
      content = c;
    },
    addChapter(chapter) {
      chapterFunctions.push(chapter);
    },
  };
  // Call the Config Function with the Api
  chapterFunction.call(api, api);
  // Validate Config
  if ((id === undefined || fullId === undefined) && parent !== undefined) throw new Error("You need to specify a id for a chapter");
  if (title === undefined) throw new Error("You need to set a Title using this.title in the chapter function");
  // Return value
  const result: MainChapterResult = {
    id,
    fullId,
    title,
    description: description ?? "",
    content,
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


export type CachedRenderChapter = (locale: string | undefined, version: string | undefined) => MainChapterResult;

export function createCachedRenderChapter(chapterFunction: ChapterFunction): CachedRenderChapter {
  let lastLocale: string | undefined = undefined;
  let lastVersion: string | undefined = undefined;
  let last: MainChapterResult | undefined = undefined;
  return function cachedRenderChapter(locale: string | undefined, version: string | undefined): MainChapterResult {
    if (last === undefined || locale !== lastLocale || version !== lastVersion) {
      last = renderChapter(chapterFunction, locale, version, undefined);
      lastLocale = locale;
      lastVersion = version;
    }
    return last;
  };
}