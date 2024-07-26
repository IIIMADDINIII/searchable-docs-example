import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";



@customElement("docs-heading")
export class DocsHeading extends LitElement {
  @property({ type: Number, reflect: true })
  accessor level: number = 1;

  protected override render(): TemplateResult {
    switch (this.level) {
      case 1: return html`<h1><slot></slot></h1>`;
      case 2: return html`<h2><slot></slot></h2>`;
      case 3: return html`<h3><slot></slot></h3>`;
      case 4: return html`<h4><slot></slot></h4>`;
      case 5: return html`<h5><slot></slot></h5>`;
      default: return html`<h6><slot></slot></h6>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-heading": DocsHeading;
  }
}