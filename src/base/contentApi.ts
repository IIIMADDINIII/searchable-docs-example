import { html, type TemplateResult } from "lit";
import { ApiBase } from "./apiBase.js";
import { asserValidId } from "./utils.js";


type ContentApi = {
};

type ParagraphApi = {
  /**
   * Set the Content of this Paragraph.
   * @param content - content of this Paragraph.
   */
  setContent(content: TemplateResult | string): void;
};

type ContentFunction<T extends {}, U = void> = {
  id?: string | undefined;
  (this: T & ContentApi, api: T & ContentApi): U;
};

function labelId<T extends {}, U = void>(...[id, contentFunction]: [contentFunction: ContentFunction<T, U>] | [id: string, contentFunction: ContentFunction<T, U>]): ContentFunction<T, U> {
  if (typeof id !== "string") {
    return id;
  }
  if (contentFunction === undefined) throw new Error("you need to provide a chapter function");
  if (contentFunction.id !== undefined && contentFunction.id !== id) throw new Error("a different id was already defined previously");
  asserValidId(id);
  contentFunction.id = id;
  return contentFunction;
}

abstract class ContentBase<T extends {} = {}, U = void> extends ApiBase<T & ContentApi, U> {

  id: string | undefined = undefined;

  constructor(contentFunction: ContentFunction<T, U>) {
    super(contentFunction);
    if (contentFunction.id !== undefined) {
      asserValidId(contentFunction.id);
      this.id = contentFunction.id;
    }
  }

  runContentFunction() {
    this.runConfigFunction();
    this.getContent();
  }

  #contentCache: TemplateResult | undefined = undefined;
  getContent(): TemplateResult {
    if (this.#contentCache === undefined) {
      this.#contentCache = this.render();
    }
    return this.#contentCache;
  }

  abstract render(): TemplateResult;

  override getApi(): T & ContentApi {
    return {
      ...this.getContentApi(),
    };
  }

  abstract getContentApi(): T & Partial<ContentApi>;

}

export type ParagraphFunction = ContentFunction<ParagraphApi, TemplateResult | string | void>;

export class Paragraph extends ContentBase<ParagraphApi, TemplateResult | string | void> {
  content: TemplateResult | string | undefined = undefined;

  static labelId(...args: [contentFunction: ParagraphFunction] | [id: string, contentFunction: ParagraphFunction]): ParagraphFunction {
    return labelId(...args);
  }

  override render(): TemplateResult {
    if (this.content === undefined) throw new Error("A paragraph Function needs to define some content (return value or setContent).");
    return html`<p>${this.content}</p>`;
  }

  override getContentApi(): ParagraphApi & Partial<ContentApi> {
    return {
      setContent: this.apiSetContent.bind(this),
    };
  }

  override runConfigFunction(): void {
    const content = super.runConfigFunction();
    if (content !== undefined) this.apiSetContent(content);
  }

  apiSetContent(content: TemplateResult | string): void {
    if (this.content !== undefined) throw new Error("content was already defined previously");
    this.content = content;
  }
}

export type Content = Paragraph;