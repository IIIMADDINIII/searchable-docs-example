import { msg } from "@lit/localize";
import { chapter } from "./base/api.js";
import { testChapter1 } from "./testChapter1.js";
import { testChapter2 } from "./testChapter2.js";




export const main = chapter((chapter) => {
  chapter.title(msg("Searchable Docs Example"), msg("An Example of a searchable Documentation"));
  chapter.addChapter(testChapter1);
  chapter.addChapter(testChapter2);
});