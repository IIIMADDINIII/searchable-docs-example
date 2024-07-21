
import { msg } from "@lit/localize";
import { docs } from "./base/main.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";

docs({
  title: "searchable-docs-example example",
  description: "Example implementation of a searchable manual",

  defaultLocale: "de",
  localeDisplayNames: () => ({ de: [2, msg("German")], en: [1, msg("English")], src: msg("Source") }),
  localeTemplates: { de: de.templates, en: en.templates, src: "source" },

  defaultVersion: "v1",
  versionDisplayNames: () => ({ v1: [1, msg("v1")], v2: [1, msg("v2")] }),
  versionTemplates: {
    v1: () => ({ displayName: msg("test") }),
    v2: () => ({ displayName: msg("test2") }),
  }
});

