import { msg } from "@lit/localize";
import { chapter } from "./base/api.js";

export const testChapter1 = chapter(function () {
  this.title("testChapter1", msg("Test Chapter 1"));
});