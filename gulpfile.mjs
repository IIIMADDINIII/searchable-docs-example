import { tools, tasks } from "@iiimaddiniii/js-build-tool";

async function writeHtmlFile() {
  await tools.fs.mkdir(tools.file("dist"), { recursive: true });
  await tools.fs.writeFile(tools.file("dist/index.html"), `<!DOCTYPE html><html><head><script src="./index.js" defer></script></head></html>`);
}

export const build = tools.exitAfter(
  tasks.installDependencies(),
  tasks.buildTranslationSource(),
  tools.parallel(
    tasks.rollup.build({ type: "app", environment: "browser" }),
    writeHtmlFile));

export const buildCi = tools.exitAfter(
  tasks.cleanWithGit(),
  tasks.prodInstallDependencies(),
  tasks.buildTranslationSource(),
  tools.parallel(
    tasks.rollup.build({ type: "app", environment: "browser" }),
    writeHtmlFile));

export const extractTranslations = tools.exitAfter(
  tasks.litLocalizeExtractSource({ targetLocales: ["de", "en"] }));