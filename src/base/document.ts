import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { ChapterResults } from "./capterApi.js";
import "./heading";

@customElement("docs-document")
export class DocsDocument extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false })
  accessor document: ChapterResults | undefined = undefined;

  protected override render(): TemplateResult {
    if (this.document === undefined) return html``;
    return this.#renderAtLevel(this.document);
  }

  #renderAtLevel(document: ChapterResults, level: number = 1): TemplateResult {
    return html`
    	<docs-heading level=${level}>${document.title}</docs-heading>
      ${"content" in document ? document.content : nothing}
      ${repeat(document.chapterArray, (c) => c.id, (chapter) => this.#renderAtLevel(chapter, level + 1))}
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "docs-document": DocsDocument;
  }
}