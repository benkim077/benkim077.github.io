import Showdown from "showdown";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import pug from "pug";
import config from "../config";
import matter from "gray-matter";
import getPostList from "../src/store/getPostList";
import { HtmlTemplateVariables, Post, PostMetadata } from "../src/interfaces";

const { DOCS, VIEWS, SRC, CONTENTS, POSTS } = config.build;

/** Pug 파일을 읽고 HTML 파일을 렌더링하는 함수 */
async function renderHtmlFormTemplate( // TODO : 이 함수가 pug, md 모두 받아서 처리할 수 있을까?
  source: string,
  dest: string,
  templateArguments: HtmlTemplateVariables
) {
  const templateFile = await readFile(source);
  const createTemplate = pug.compile(templateFile.toString(), {
    filename: source,
  });

  const html = createTemplate({ ...templateArguments }); // TODO: 동적/정적 값 구분

  await writeFile(dest, html);
}

async function renderHtmlFromMarkdown(
  source: string,
  dest: string,
  templateArguments?: HtmlTemplateVariables
) {
  const postFile = await readFile(source);
  // TODO: data의 Type 설정은 어떻게 해야 하는가?
  const { data, content } = matter(postFile.toString());
  const converter = new Showdown.Converter({ headerLevelStart: 3 });
  const post: Post = {
    ...(data as PostMetadata),
    content: converter.makeHtml(content),
  };
  const templateFilePath = `${SRC}/${VIEWS}/post.pug`;
  const templateFile = await readFile(templateFilePath);
  const createPostTemplate = pug.compile(templateFile.toString(), {
    filename: templateFilePath,
  });
  const html = createPostTemplate({
    post,
    site: {
      title: `${post.title} - Ben의 기술 블로그`,
      title_for_sharing: `${post.title}`,
      description: post.summary,
      url: `https://benkim077.github.io/${post.slug}`,
    },
  });
  await writeFile(dest, html);
}

async function buildFromTemplate(path: string) {
  const files = await readdir(path);
  for (const file of files) {
    switch (file) {
      case "index.pug":
        await renderHtmlFormTemplate(
          `${path}/index.pug`,
          `${DOCS}/index.html`,
          {
            site: {
              title: "Ben의 기술 블로그",
              title_for_sharing: "Ben의 기술 블로그",
              description: "JavaScript, Frontend 개발",
              url: `https://benkim077.github.io/`,
            },
          }
        );
        break;
      case "posts.pug":
        const dirName = file.split(".pug")[0];
        await mkdir(`${DOCS}/${dirName}`);
        await renderHtmlFormTemplate(
          `${path}/${file}`,
          `${DOCS}/${dirName}/index.html`,
          {
            site: {
              title: "포스트 목록 - Ben의 기술 블로그",
              title_for_sharing: "포스트 목록",
              description:
                "JavaScript, React, Bundler 등 프론트엔드 개발에 대한 내용을 공유합니다.",
              url: `https://benkim077.github.io/${POSTS}`,
            },
            posts: (await getPostList(`${SRC}/${CONTENTS}`)).posts,
          }
        );
        break;
    }
  }
}

async function buildFromMarkdown(path: string) {
  const files = await readdir(path);
  for (const file of files) {
    const dirName = file.split(".md")[0];
    await mkdir(`${DOCS}/${POSTS}/${dirName}`);
    await renderHtmlFromMarkdown(
      `${path}/${file}`,
      `${DOCS}/${POSTS}/${dirName}/index.html`
    );
  }
}

async function buildHtmlFiles(path: string) {
  switch (path) {
    case `${SRC}/${VIEWS}`:
      await buildFromTemplate(path);
      break;
    case `${SRC}/${CONTENTS}`:
      await buildFromMarkdown(path);
      break;
  }
}

const SEARCH_FOLDERS = [`${SRC}/${VIEWS}`, `${SRC}/${CONTENTS}`];

async function build() {
  await mkdir(DOCS);

  for (const folder of SEARCH_FOLDERS) {
    await buildHtmlFiles(folder);
  }
}

build();
