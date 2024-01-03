import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import pug from "pug";
import config from "../config";

const { DOCS, VIEWS, SRC } = config.build;

async function renderFile(source: string, dest: string) {
  const file = await readFile(source);
  const createIndexTemplate = pug.compile(file.toString(), {
    filename: source,
  });
  const html = createIndexTemplate({ ...config }); // TODO: 동적/정적 값 구분
  writeFile(dest, html);
}

async function build() {
  await mkdir(DOCS);
  const files = await readdir(`${SRC}/${VIEWS}`);
  for (const file of files) {
    switch (file) {
      case "index.pug":
        await renderFile(`${SRC}/${VIEWS}/index.pug`, `${DOCS}/index.html`);
        break;
      case "posts.pug":
        const dirName = file.split(".pug")[0];
        await mkdir(`${DOCS}/${dirName}`);
        await renderFile(
          `${SRC}/${VIEWS}/${file}`,
          `${DOCS}/${dirName}/index.html`
        );
        break;
    }
  }
}

build();
