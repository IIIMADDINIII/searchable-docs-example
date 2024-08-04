import { Chapter, type ChapterFunction, type MainChapterFunction } from "./chapterApi.js";
import { Paragraph, type ParagraphFunction } from "./contentApi.js";
import { Init, type InitFunction } from "./initApi.js";

/**
 * Call this once in your main file to set all Settings, Configurations and Content for the Documentation.
 * @param options - An object containing all Settings, Configurations and Content.
 */
export function init(initFunction: InitFunction): void {
  new Init(initFunction);
}

/**
 * Call this to define a chapter.
 * @param chapterFunction - function to define the Chapter.
 * @returns the definition of the Chapter in form of a function.
 */
export function subChapter(chapterFunction: ChapterFunction): ChapterFunction;
/**
 * Call this to define a chapter.
 * @param id - Id of the Chapter to define.
 * @param chapterFunction - function to define the Chapter.
 * @returns the definition of the Chapter in form of a function.
 */
export function subChapter(id: string, chapterFunction: ChapterFunction): ChapterFunction;
export function subChapter(...args: [chapterFunction: ChapterFunction] | [id: string, chapterFunction: ChapterFunction]): ChapterFunction {
  return Chapter.labelId(...args);
}

/**
 * Call this to define the main chapter.
 * @param chapterFunction - function to define the Chapter.
 * @returns the definition of the Chapter in form of a function.
 */
export function mainChapter(chapterFunction: MainChapterFunction): MainChapterFunction {
  return chapterFunction;
}

/**
 * Call this to define a Paragraph.
 * @param paragraphFunction - function to define the Paragraph.
 * @returns the definition of the Paragraph in form of a function.
 */
export function paragraph(paragraphFunction: ParagraphFunction): ParagraphFunction;
/**
 * Call this to define a Paragraph.
 * @param id - Id of the Chapter to define.
 * @param paragraphFunction - function to define the Paragraph.
 * @returns the definition of the Paragraph in form of a function.
 */
export function paragraph(id: string, paragraphFunction: ParagraphFunction): ParagraphFunction;
export function paragraph(...args: [paragraphFunction: ParagraphFunction] | [id: string, paragraphFunction: ParagraphFunction]): ParagraphFunction {
  return Paragraph.labelId(...args);
}