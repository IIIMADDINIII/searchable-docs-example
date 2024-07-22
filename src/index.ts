
import { msg } from "@lit/localize";
import { init } from "./base/api.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";

init({
  disableAnchorInterception: false,
  locales() {
    this.add({ id: "en", displayName: msg("English"), translation: en });
    this.add({ id: "de", displayName: msg("German"), translation: de, default: true });
    this.add({ id: "src", displayName: msg("Source"), translation: "source" });
  },
  versions() {
    this.add({ id: "v1", displayName: msg("v1"), default: true });
    this.add({ id: "v2", displayName: msg("v2") });
  },
  folder() {

  },
});


