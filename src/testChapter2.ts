import { msg } from "@lit/localize";
import { html } from "lit";
import { chapter } from "./base/api.js";
import testImage from "./testImage.jpg";

export const testChapter2 = chapter(function () {
  this.title("testChapter2", msg("Test Chapter 2"));
  this.content(msg(html`This includes the a image <img src=${testImage}>`));
  if (this.version === "v2") this.addChapter(function () {
    this.title("testChapter1", msg("Test SubChapter 1"));
  });
});