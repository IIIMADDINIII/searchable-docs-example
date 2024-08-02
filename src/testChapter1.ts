import { msg } from "@lit/localize";
import { html } from "lit";
import { chapter } from "./base/api.js";

export const testChapter1 = chapter((chapter) => {
  chapter.id("testChapter1");
  chapter.title(msg("Test Chapter 1"));
  chapter.content(msg(html`Some content including <b>styling</b>.`));
});