import { mkdir, readdir, writeFile } from "fs/promises";
import getPostList from "../store/getPostList";
import { renderHtmlFormTemplate } from "./renderHtmlFormTemplate";
import config from "../config";

const { DOCS, SRC, CONTENTS, POSTS } = config.build;

export async function buildFromTemplate(path: string) {
  const files = await readdir(path);
  for (const file of files) {
    switch (file) {
      case "index.pug": {
        const html = await renderHtmlFormTemplate(`${path}/index.pug`, {
          site: {
            title: "Ben의 기술 블로그",
            title_for_sharing: "Ben의 기술 블로그",
            description: "JavaScript, Frontend 개발",
            url: `https://benkim077.github.io/`,
          },
        });
        await writeFile(`${DOCS}/index.html`, html);
        break;
      }
      case "posts.pug": {
        const dirName = file.split(".pug")[0];
        await mkdir(`${DOCS}/${dirName}`);
        const html = await renderHtmlFormTemplate(`${path}/${file}`, {
          site: {
            title: "포스트 목록 - Ben의 기술 블로그",
            title_for_sharing: "포스트 목록",
            description:
              "JavaScript, React, Bundler 등 프론트엔드 개발에 대한 내용을 공유합니다.",
            url: `https://benkim077.github.io/${POSTS}`,
          },
          posts: (await getPostList(`${SRC}/${CONTENTS}`)).posts,
        });
        await writeFile(`${DOCS}/${dirName}/index.html`, html);
        break;
      }
    }
  }
}
