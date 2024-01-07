import { mkdir } from "fs/promises";
import config from "./config";
import { buildHtmlFiles } from "./scripts/buildHtmlFiles";

const { DOCS, VIEWS, SRC, CONTENTS } = config.build;
const SEARCH_FOLDERS = [`${SRC}/${VIEWS}`, `${SRC}/${CONTENTS}`];

async function build() {
  await mkdir(DOCS);
  for (const folder of SEARCH_FOLDERS) {
    await buildHtmlFiles(folder);
  }
}

build();
