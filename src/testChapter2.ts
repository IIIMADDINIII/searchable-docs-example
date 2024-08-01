import { msg } from "@lit/localize";
import { html } from "lit";
import { chapter } from "./base/api.js";
import testImage from "./testImage.jpg";

export const testChapter2 = chapter((chapter) => {
  chapter.title("testChapter2", msg("Test Chapter 2"));
  chapter.content(msg(html`This includes the a image <img src=${testImage}>`));
  if (chapter.version === "v2") chapter.addChapter((chapter) => {
    chapter.title("testChapter1", msg("Test SubChapter 1"));
  });
});