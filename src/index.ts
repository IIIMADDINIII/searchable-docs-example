
import { msg } from "@lit/localize";
import { docs } from "./base/main.js";
import * as de from "./locales/de.js";
import * as en from "./locales/en.js";

docs({
  title: "searchable-docs-example example",
  description: "Example implementation of a searchable manual",
  defaultLocale: "de",
  localeTemplates: { de: de.templates, en: en.templates, src: "source" },
  localeDisplayNames: () => ({ de: [2, msg("German")], en: [1, msg("English")], src: msg("Source") }),

});

