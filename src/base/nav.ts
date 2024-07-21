import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DocsDescription } from "./types.js";

@customElement("docs-nav")
export class DocsNav extends LitElement {

  @property({ attribute: false })
  accessor docsDescription: DocsDescription = { displayName: "" };



}

declare global {
  interface HTMLElementTagNameMap {
    "docs-nav": DocsNav;
  }
}