import { copyFile, mkdir, readdir } from "fs/promises";
import config from "./config";
import { buildHtmlFiles } from "./scripts/buildHtmlFiles";

const { DOCS, VIEWS, SRC, CONTENTS } = config.build;
const SEARCH_FOLDERS = [`${SRC}/${VIEWS}`, `${SRC}/${CONTENTS}`];

async function buildAssetFiles() {
  await mkdir("docs/assets");
  await mkdir("docs/assets/images");
  const images = await readdir("src/assets/images");
  for (const image of images) {
    await copyFile(`src/assets/images/${image}`, `docs/assets/images/${image}`);
  }
}

async function build() {
  await mkdir(DOCS);
  for (const folder of SEARCH_FOLDERS) {
    await buildHtmlFiles(folder);
  }
  await buildAssetFiles();
}

build();
