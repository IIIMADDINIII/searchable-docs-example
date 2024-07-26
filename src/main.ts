import { msg } from "@lit/localize";
import { entrypoint } from "./base/api.js";

export const main = entrypoint(function () {
  this.title(msg("Searchable Docs Example"), msg("An Example of a searchable Documentation"));

});