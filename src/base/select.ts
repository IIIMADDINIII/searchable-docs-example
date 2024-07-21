import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-select")
export class DocsSelect extends LitElement {
  static override styles = css`
    @position-try --span-left {
      inset-area: bottom span-left;
      margin-right: 0px;
    }
    button {
      display: flex;
      padding: 8px;
      background-color: white; 
      border-radius: 8px; 
      box-shadow: 0px 0px 20px #0003;
      anchor-name: --menu;
      border: none;
      height: 100%;
      width: 100%;
      span {
        margin-left: 8px;
      }
      slot {
        flex-grow: 1;
      }
    }
    dialog {
      position: absolute;
      position-anchor: --menu;
      inset-area: bottom;
      margin: 8px;
      border-radius: 8px;
      border: none;
      box-shadow: 0px 0px 20px #0003;
      min-width: anchor-size(width);
      box-sizing: border-box;
      position-try-options: --span-left; // soon legacy
      position-try-fallbacks: --span-left;
    }
    ::slotted([slot="selected"]) {
      flex-grow: 1;
    }
    ::slotted(:not([slot="selected"])) {
      display: block;
      padding: 8px;
      background-color: white; 
      border-radius: 4px;
      text-decoration: none;
      color: inherit;
    }
    ::slotted(:not([slot="selected"]).selected) {
      background-color: #EEE;
    }
    ::slotted(:not([slot="selected"]):hover) {
      background-color: #DDD;
    }
  `;

  protected override render(): TemplateResult {
    return html`
      <button popovertarget="menu"><slot name="selected"></slot><span>▼</span></button>
      <dialog popover id="menu">
        <slot></slot>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-select": DocsSelect;
  }
}