import { msg } from "@lit/localize";
import { mainChapter } from "./base/api.js";
import { testChapter1 } from "./testChapter1.js";
import { testChapter2 } from "./testChapter2.js";




export const main = mainChapter((chapter) => {
  chapter.title(msg("Searchable Docs Example"));
  chapter.description(msg("An Example of a searchable Documentation"));
  chapter.addChapter(testChapter1);
  chapter.addChapter(testChapter2);
});