
import { msg } from "@lit/localize";
import { docs } from "./base/main.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";

docs({

  defaultLocale: "de",
  localeDisplayNames: () => ({ de: [2, msg("German")], en: [1, msg("English")], src: msg("Source") }),
  localeTemplates: { de: de.templates, en: en.templates, src: "source" },

  defaultVersion: "v1",
  versionDisplayNames: () => ({ v1: [1, msg("v1")], v2: [1, msg("v2")] }),
  versionTemplates: {
    v1: () => ({
      title: msg("searchable docs example v1"),
      description: msg("Example implementation of a searchable manual")
    }),
    v2: () => ({
      title: msg("searchable docs example v2"),
      description: msg("Example implementation of a searchable manual")
    }),
  }
});

