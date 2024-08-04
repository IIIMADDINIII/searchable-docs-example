
import { msg } from "@lit/localize";
import { init } from "./base/api.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";
import { main } from "./main.js";



init((init) => {
  init.addLocale({ id: "en", displayName: () => msg("English"), translation: en });
  init.addLocale({ id: "de", displayName: () => msg("German"), translation: de, default: true });
  init.addLocale({ id: "src", displayName: () => msg("Source"), translation: "source" });

  init.addVersion({ id: "v1", displayName: () => msg("v1"), default: true });
  init.addVersion({ id: "v2", displayName: () => msg("v2") });

  init.mainChapter(main);
});