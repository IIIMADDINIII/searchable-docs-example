import { msg } from "@lit/localize";
import { html } from "lit";
import { subChapter } from "./base/api.js";
import testImage from "./testImage.jpg";

export const testChapter2 = subChapter("testChapter2", (chapter) => {
  chapter.title(msg("Test Chapter 2"));
  chapter.addParagraph(() => msg(html`This includes the a image <img src=${testImage}>`));
  if (chapter.version === "v2") chapter.addChapter("testChapter1", (chapter) => {
    chapter.title(msg("Test SubChapter 1"));
  });
});