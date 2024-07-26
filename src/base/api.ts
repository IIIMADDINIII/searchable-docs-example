import { css, render } from "lit";
import type { ChapterFunction } from "./capterApi.js";
import type { EntrypointFunction } from "./entrypointApi.js";
import { getRenderInit, type InitFunction } from "./initApi.js";
import { DocsMain } from "./main.js";
import { renderError } from "./utils.js";

let mainElement: DocsMain | undefined = undefined;

/**
 * Call this once in your main file to set all Settings, Configurations and Content for the Documentation.
 * @param options - An object containing all Settings, Configurations and Content.
 */
export function init(initFunction: InitFunction): void {
  try {
    if (mainElement !== undefined) throw new Error("init function can only be called once");
    // set Document Styles
    const styleSheet = css`
      html, body {
        height: 100%;
        width: 100%;
        margin: 0px;
      }
    `.styleSheet;
    if (styleSheet === undefined) throw new Error("Error while creating Document Styles");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
    mainElement = new DocsMain(getRenderInit(initFunction)());
    document.body.appendChild(mainElement);
  } catch (error) {
    document.body.replaceChildren();
    render(renderError(error), document.body);
    console.error(error);
  }
}

/**
 * Call this to define a chapter.
 * @param chapterFunction - function to define the Chapter.
 * @returns the definition of the Chapter in form of a function.
 */
export function chapter(chapterFunction: ChapterFunction): ChapterFunction {
  return chapterFunction;
}

/**
 * Call this to define an entrypoint.
 * @param entrypointFunction - function to define the Entrypoint.
 * @returns the definition of the Entrypoint in form of a function.
 */
export function entrypoint(entrypointFunction: EntrypointFunction): EntrypointFunction {
  return entrypointFunction;
}