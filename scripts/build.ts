import Showdown from "showdown";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import pug from "pug";
import config from "../config";
import matter from "gray-matter";
import getPostList from "../src/store/getPostList";
import { PostMetadata } from "../src/interfaces";

const { DOCS, VIEWS, SRC, CONTENTS, POSTS } = config.build;

async function renderFile(
  source: string,
  dest: string,
  templateVariables?: Object
) {
  const templateFile = await readFile(source);
  const createIndexTemplate = pug.compile(templateFile.toString(), {
    filename: source,
  });

  const html = createIndexTemplate({ ...config, ...templateVariables }); // TODO: 동적/정적 값 구분

  await writeFile(dest, html);
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
          `${DOCS}/${dirName}/index.html`,
          await getPostList(`${SRC}/${CONTENTS}`)
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
    // TODO: data의 Type 설정은 어떻게 해야 하는가?
    const { data, content } = matter(postFile.toString());
    const converter = new Showdown.Converter();
    const post = {
      ...data,
      content: converter.makeHtml(content),
    };
    const templateFilePath = `${SRC}/${VIEWS}/post.pug`;
    const templateFile = await readFile(templateFilePath);
    const createPostTemplate = pug.compile(templateFile.toString(), {
      filename: templateFilePath,
    });
    const html = createPostTemplate({ ...config, post });
    await writeFile(`${DOCS}/${POSTS}/${dirName}/index.html`, html);
  }
}

// async function buildAssetFiles() {}

async function build() {
  await mkdir(DOCS);
  // await buildAssetFiles();
  await buildHtmlFiles();
  await buildMarkdownFiles();
}

build();
