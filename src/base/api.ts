import { getRenderInit, type InitFunction } from "./initApi.js";
import { DocsMain } from "./main.js";

/**
 * Call this once in your main file to set all Settings, Configurations and Content for the Documentation.
 * @param options - An object containing all Settings, Configurations and Content.
 */
export function init(InitFunction: InitFunction): void {
  try {
    new DocsMain(getRenderInit(InitFunction)());
  } catch (e) {
    console.error(e);
  }
}