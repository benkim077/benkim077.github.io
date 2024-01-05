import Showdown from "showdown";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import pug from "pug";
import config from "../config";
import matter from "gray-matter";
import getPostList from "../src/store/getPostList";
import { PostMetadata, SiteMetadata } from "../src/interfaces";

const { DOCS, VIEWS, SRC, CONTENTS, POSTS } = config.build;

async function renderFile(
  source: string,
  dest: string,
  templateVariables: {
    site?: SiteMetadata;
    posts?: PostMetadata[];
  }
) {
  const templateFile = await readFile(source);
  const createIndexTemplate = pug.compile(templateFile.toString(), {
    filename: source,
  });

  const html = createIndexTemplate({ ...templateVariables }); // TODO: 동적/정적 값 구분

  await writeFile(dest, html);
}

async function buildHtmlFiles() {
  const files = await readdir(`${SRC}/${VIEWS}`);
  for (const file of files) {
    switch (file) {
      case "index.pug":
        await renderFile(`${SRC}/${VIEWS}/index.pug`, `${DOCS}/index.html`, {
          site: {
            title: "Ben의 기술 블로그",
            title_for_sharing: "Ben의 기술 블로그",
            description: "JavaScript, Frontend 개발",
            url: `https://benkim077.github.io/`,
          },
        });
        break;
      case "posts.pug":
        const dirName = file.split(".pug")[0];
        await mkdir(`${DOCS}/${dirName}`);
        await renderFile(
          `${SRC}/${VIEWS}/${file}`,
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

          // await getPostList(`${SRC}/${CONTENTS}`)
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
    const converter = new Showdown.Converter({ headerLevelStart: 3 });
    const post = {
      ...(data as PostMetadata),
      content: converter.makeHtml(content),
    };
    const templateFilePath = `${SRC}/${VIEWS}/post.pug`;
    const templateFile = await readFile(templateFilePath);
    const createPostTemplate = pug.compile(templateFile.toString(), {
      filename: templateFilePath,
    });
    const html = createPostTemplate({
      ...config,
      post,
      site: {
        title: `${post.title} - Ben의 기술 블로그`,
        title_for_sharing: `${post.title}`,
        description: post.summary,
        url: `https://benkim077.github.io/${post.slug}`,
      },
    });
    await writeFile(`${DOCS}/${POSTS}/${dirName}/index.html`, html);
  }
}

async function build() {
  await mkdir(DOCS);
  await buildHtmlFiles();
  await buildMarkdownFiles();
}

build();
