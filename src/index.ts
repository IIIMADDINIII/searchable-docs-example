
import { msg } from "@lit/localize";
import { init } from "./base/api.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";
import { main } from "./main.js";



init(function () {
  this.addLocale({ id: "en", displayName: () => msg("English"), translation: en });
  this.addLocale({ id: "de", displayName: () => msg("German"), translation: de, default: true });
  this.addLocale({ id: "src", displayName: () => msg("Source"), translation: "source" });

  this.addVersion({ id: "v1", displayName: () => msg("v1"), default: true });
  this.addVersion({ id: "v2", displayName: () => msg("v2") });

  this.docs(main);
});