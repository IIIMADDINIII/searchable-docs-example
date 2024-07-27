import { msg } from "@lit/localize";
import { html } from "lit";
import { chapter } from "./base/api.js";

export const testChapter1 = chapter(function () {
  this.title("testChapter1", msg("Test Chapter 1"));
  this.content(msg(html`Some content including <b>styling</b>.`));
});