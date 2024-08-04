import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ChapterResult } from "./chapterApi.js";
import "./heading";

@customElement("docs-document")
export class DocsDocument extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false })
  accessor document: ChapterResult | undefined = undefined;

  protected override render(): TemplateResult {
    if (this.document === undefined) return html``;
    return this.document.renderWithSubChapters();
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "docs-document": DocsDocument;
  }
}