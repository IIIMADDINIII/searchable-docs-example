import { html, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { ApiBase } from "./apiBase.js";
import { Paragraph, type Content, type ParagraphFunction } from "./contentApi.js";
import "./heading";
import { asserValidId, displayError, type LocaleAndVersionInApi } from "./utils.js";

/**
 * Api Definition for the ChapterFunction.
 * Can be accessed with the this keyword or the first parameter.
 */
type ChapterApi = LocaleAndVersionInApi & {
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
   * Add a Paragraph to the Chapters Content.
   * @param paragraph - Function defining the Paragraph.
   */
  addParagraph(paragraph: ParagraphFunction): void;
  /**
   * Add a Paragraph to the Chapters Content.
   * @param id - id for the Paragraph.
   * @param paragraph - Function defining the Paragraph.
   */
  addParagraph(id: string, paragraph: ParagraphFunction): void;
  /**
   * Add a chapter to the entrypoint.
   * @param chapter - function describing the chapter.
   */
  addChapter(chapter: ChapterFunction): void;
  /**
   * Add a chapter to the entrypoint.
   * @param id - id of the Chapter.
   * @param chapter - function describing the chapter.
   */
  addChapter(id: string, chapter: ChapterFunction): void;
};

/**
 * Api Definition for the MainChapterFunction.
 * Can be accessed with the this keyword or the first parameter.
 */
type MainChapterApi = Omit<ChapterApi, "id">;

/**
 * Function to define a Chapter in the Documentation.
 */
export type ChapterFunction = {
  id?: string | undefined;
  (this: ChapterApi, chapter: ChapterApi): void;
};
/**
 * Function to Define the Main Chapter (is missing the ID).
 */
export type MainChapterFunction = {
  (this: MainChapterApi, mainChapter: MainChapterApi): void;
};



/**
 * Functionality to run a Chapter Function.
 */
export class Chapter extends ApiBase<ChapterApi> {
  static labelId(...[id, chapterFunction]: [chapterFunction: ChapterFunction] | [id: string, chapterFunction: ChapterFunction]): ChapterFunction {
    if (typeof id !== "string") {
      return id;
    }
    if (chapterFunction === undefined) throw new Error("you need to provide a chapter function");
    if (chapterFunction.id !== undefined && chapterFunction.id !== id) throw new Error("a different id was already defined previously");
    asserValidId(id);
    chapterFunction.id = id;
    return chapterFunction;
  }

  id: string | undefined = undefined;
  title: string | undefined = undefined;
  description: string | undefined = undefined;
  chapters: Chapter[] = [];
  content: Content[] = [];

  constructor(chapterFunction: ChapterFunction) {
    super(chapterFunction);
    if (chapterFunction.id !== undefined) {
      asserValidId(chapterFunction.id);
      this.id = chapterFunction.id;
    }
  }

  runChapterFunction() {
    this.runConfigFunction();
    for (const chapter of this.chapters) {
      chapter.runChapterFunction();
    }
  }

  runContentFunction() {
    for (const element of this.content) {
      element.runContentFunction();
    }
    for (const chapter of this.chapters) {
      chapter.runContentFunction();
    }
  }

  createResult(): SubChapterResult {
    return new SubChapterResult(this);
  }

  override getApi(): ChapterApi {
    return {
      locale: MainChapter.instance.locale,
      version: MainChapter.instance.version,
      id: this.apiId.bind(this),
      title: this.apiTitle.bind(this),
      description: this.apiDescription.bind(this),
      addParagraph: this.apiAddParagraph.bind(this),
      addChapter: this.apiAddChapter.bind(this),
    };
  }

  apiId(id: string): void {
    if (this.id !== undefined && this.id !== id) throw new Error("a different id was already defined previously");
    asserValidId(id);
    this.id = id;
  };

  apiTitle(title: string): void {
    if (this.title !== undefined) throw new Error("title was already defined previously");
    this.title = title;
  };

  apiDescription(description: string): void {
    if (this.description !== undefined) throw new Error("description was already defined previously");
    this.description = description;
  };

  apiAddParagraph(...args: [contentFunction: ParagraphFunction] | [id: string, contentFunction: ParagraphFunction]): void {
    const fn = Paragraph.labelId(...args);
    this.content.push(new Paragraph(fn));
  };

  apiAddChapter(...args: [chapterFunction: ChapterFunction] | [id: string, chapterFunction: ChapterFunction]): void {
    const fn = Chapter.labelId(...args);
    this.chapters.push(new Chapter(fn));
  }
}

/**
 * Functionality to run a MainChapterFunction.
 */
export class MainChapter extends Chapter {
  // Singleton
  static #instance: MainChapter | undefined = undefined;
  static get instance(): MainChapter {
    if (this.#instance === undefined) throw new Error("Accessed Main Chapter before it was created");
    return this.#instance;
  }

  // Caching
  static #last: MainChapterResult | undefined = undefined;
  static createCached(chapterFunction: MainChapterFunction, locale: string | undefined, version: string | undefined): MainChapterResult {
    if (this.#last === undefined || chapterFunction !== this.#last.chapterFunction || locale !== this.#last.locale || version !== this.#last.version) {
      this.#last = this.#create(chapterFunction, locale, version);
    }
    return this.#last;
  }

  // Create
  static #create(chapterFunction: MainChapterFunction, locale: string | undefined, version: string | undefined): MainChapterResult {
    try {
      this.#instance = new MainChapter(chapterFunction, locale, version);
      this.#instance.runChapterFunction();
      this.#instance.runContentFunction();
      return this.#instance.createMainResult();
    } catch (error) {
      displayError(error);
    }
  }

  locale: string | undefined;
  version: string | undefined;

  constructor(chapterFunction: MainChapterFunction, locale: string | undefined, version: string | undefined) {
    if ("id" in chapterFunction && chapterFunction.id !== undefined) throw new Error("Main Chapter is not allowed to have an id");
    super(chapterFunction);
    this.locale = locale;
    this.version = version;
  }

  runChapterFunctions() {
    this.runConfigFunction();
  }

  createMainResult(): MainChapterResult {
    return new MainChapterResult(this);
  }

  override apiId(_id: string): void {
    throw new Error("Main Chapter is not allowed to have an id");
  }
}

/**
 * Base for all Chapter Results.
 */
class ChapterResultBase {
  chapterFunction: ChapterFunction;
  title: string;
  description: string;
  subChapters: SubChapterResult[];
  content: Content[];
  constructor(chapter: Chapter) {
    this.chapterFunction = chapter.configFunction;
    if (chapter.title === undefined) throw new Error("You need to set a Title using the title function in a chapter");
    this.title = chapter.title;
    this.description = chapter.description ?? "";
    this.subChapters = chapter.chapters.map((chapter) => chapter.createResult());
    this.content = chapter.content;
  }

  render(headingLevel: number = 1): TemplateResult {
    return html`
    	<docs-heading level=${headingLevel}>${this.title}</docs-heading>
      ${repeat(this.content, (i) => i.getContent())}
    `;
  }

  renderWithSubChapters(headingLevel: number = 1): TemplateResult {
    return html`
      ${this.render(headingLevel)}
      ${repeat(this.subChapters, (i) => i.id, (i) => i.renderWithSubChapters(headingLevel + 1))}
    `;
  }
}

/**
 * Result of a Chapter.
 */
export class SubChapterResult extends ChapterResultBase {
  id: string;
  constructor(chapter: Chapter) {
    super(chapter);
    if (chapter.id === undefined) throw new Error("You need to set a Id using the id function in a SubChapter");
    this.id = chapter.id;
  }
}

/**
 * Result of the MainChapter.
 */
export class MainChapterResult extends ChapterResultBase {
  locale: string | undefined;
  version: string | undefined;
  constructor(mainChapter: MainChapter) {
    super(mainChapter);
    this.locale = mainChapter.locale;
    this.version = mainChapter.version;
  }
}

/**
 * This is the General result for a Chapter.
 */
export type ChapterResult = MainChapterResult | SubChapterResult;