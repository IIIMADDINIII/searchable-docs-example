import { msg } from "@lit/localize";
import { html } from "lit";
import { subChapter } from "./base/api.js";

export const testChapter1 = subChapter("testChapter1", (chapter) => {
  chapter.title(msg("Test Chapter 1"));
  chapter.addParagraph(() => msg(html`Some content including <b>styling</b>.`));
});