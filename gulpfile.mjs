import { tools, tasks } from "@iiimaddiniii/js-build-tool";

async function writeHtmlFile() {
  await tools.fs.mkdir(tools.file("dist"), { recursive: true });
  await tools.fs.writeFile(tools.file("dist/index.html"), `<!DOCTYPE html><html><head><meta charset="UTF-8"><script src="./index.js" defer></script></head></html>`);
}

async function copyToDocs() {
  await tools.fs.cp(tools.file("dist"), tools.file("docs"), { recursive: true });
}

/**
 * @type import("@iiimaddiniii/js-build-tool").ConfigOpts
 */
const rollupConfig = { type: "app", environment: "browser", sourceMapType: "inline" };

export const build = tools.exitAfter(
  tasks.installDependencies(),
  tasks.buildTranslationSource(),
  tools.parallel(
    tasks.rollup.build(rollupConfig),
    writeHtmlFile));

export const buildCi = tools.exitAfter(
  tasks.cleanWithGit(),
  tasks.prodInstallDependencies(),
  tasks.buildTranslationSource(),
  tools.parallel(
    tasks.rollup.build(rollupConfig),
    writeHtmlFile),
  copyToDocs);

export const extractTranslations = tools.exitAfter(
  tasks.litLocalizeExtractSource({ targetLocales: ["de", "en"] }));