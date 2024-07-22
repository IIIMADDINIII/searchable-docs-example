import { css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("docs-document")
export class DocsDocument extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false })
  accessor docsDescription: {} | undefined = undefined;

}

declare global {
  interface HTMLElementTagNameMap {
    "docs-document": DocsDocument;
  }
}