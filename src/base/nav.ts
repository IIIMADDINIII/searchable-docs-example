import { css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DocsDescription } from "./types.js";

@customElement("docs-nav")
export class DocsNav extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;


  @property({ attribute: false })
  accessor docsDescription: DocsDescription | undefined = undefined;

}

declare global {
  interface HTMLElementTagNameMap {
    "docs-nav": DocsNav;
  }
}