import { mkdir, readdir, rmdir, writeFile } from "fs/promises";
import { renderHtmlFromMarkdown } from "./renderHtmlFromMarkdown";
import config from "../config";

const { DOCS, POSTS } = config.build;

export async function buildFromMarkdown(path: string) {
  const files = await readdir(path);
  for (const file of files) {
    const dirName = file.split(".md")[0];
    const dirPath = `${DOCS}/${POSTS}/${dirName}`;
    await mkdir(dirPath);
    const { isPublished, html } = await renderHtmlFromMarkdown(
      `${path}/${file}`
    );
    if (!isPublished) {
      await rmdir(dirPath);
      continue;
    }
    await writeFile(`${DOCS}/${POSTS}/${dirName}/index.html`, html);
  }
}
