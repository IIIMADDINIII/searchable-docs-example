import { msg } from "@lit/localize";
import { html } from "lit";
import { chapter } from "./base/api.js";
import testImage from "./testImage.jpg";

export const testChapter2 = chapter((chapter) => {
  chapter.id("testChapter2");
  chapter.title(msg("Test Chapter 2"));
  chapter.content(msg(html`This includes the a image <img src=${testImage}>`));
  if (chapter.version === "v2") chapter.addChapter((chapter) => {
    chapter.id("testChapter1");
    chapter.title(msg("Test SubChapter 1"));
  });
});