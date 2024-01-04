import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import pug from "pug";
import config from "../config";
import matter from "gray-matter";

const { DOCS, VIEWS, SRC, CONTENTS, POSTS } = config.build;

async function renderFile(source: string, dest: string) {
  const templateFile = await readFile(source);
  const createIndexTemplate = pug.compile(templateFile.toString(), {
    filename: source,
  });
  const html = createIndexTemplate({ ...config }); // TODO: 동적/정적 값 구분
  writeFile(dest, html);
}

async function buildHtmlFiles() {
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

async function buildMarkdownFiles() {
  const files = await readdir(`${SRC}/${CONTENTS}`);
  for (const file of files) {
    const dirName = file.split(".md")[0];
    await mkdir(`${DOCS}/${POSTS}/${dirName}`);
    const postFile = await readFile(`${SRC}/${CONTENTS}/${file}`);
    // TODO content를 HTML로 변환하기
    // TODO: data, content를 createPostTemplate의 인자로 전달하기
    const { data, content } = matter(postFile);
    const templateFilePath = `${SRC}/${VIEWS}/post.pug`;
    const templateFile = await readFile(templateFilePath);
    const createPostTemplate = pug.compile(templateFile.toString(), {
      filename: templateFilePath,
    });
    const html = createPostTemplate({ ...config });
    writeFile(`${DOCS}/${POSTS}/${dirName}/index.html`, html);
  }
}

async function build() {
  await mkdir(DOCS);
  await buildHtmlFiles();
  await buildMarkdownFiles();
}

build();
