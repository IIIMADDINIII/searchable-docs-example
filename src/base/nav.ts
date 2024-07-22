import { css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
@customElement("docs-nav")
export class DocsNav extends LitElement {
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
    "docs-nav": DocsNav;
  }
}