import { msg } from "@lit/localize";
import { chapter } from "./base/api.js";

export const testChapter2 = chapter(function () {
  this.title("testChapter2", msg("Test Chapter 2"));
  if (this.version === "v2") this.addChapter(function () {
    this.title("testChapter1", msg("Test SubChapter 1"));
  });
});