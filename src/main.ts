import { msg } from "@lit/localize";
import { entrypoint } from "./base/api.js";
import { testChapter1 } from "./testChapter1.js";
import { testChapter2 } from "./testChapter2.js";




export const main = entrypoint(function () {
  this.title(msg("Searchable Docs Example"), msg("An Example of a searchable Documentation"));
  this.addChapter(testChapter1);
  this.addChapter(testChapter2);
});