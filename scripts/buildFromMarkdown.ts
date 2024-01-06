import { mkdir, readdir, writeFile } from "fs/promises";
import { renderHtmlFromMarkdown } from "./renderHtmlFromMarkdown";
import config from "./config";

const { DOCS, POSTS } = config.build;

export async function buildFromMarkdown(path: string) {
  const files = await readdir(path);
  for (const file of files) {
    const dirName = file.split(".md")[0];
    await mkdir(`${DOCS}/${POSTS}/${dirName}`);
    const html = await renderHtmlFromMarkdown(`${path}/${file}`);
    await writeFile(`${DOCS}/${POSTS}/${dirName}/index.html`, html);
  }
}
