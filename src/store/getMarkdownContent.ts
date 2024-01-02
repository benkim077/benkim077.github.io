import { readFile } from "fs/promises";
import matter from "gray-matter";

export default async function getMarkdownContent(path: string) {
  const file = await readFile(path);
  const { content } = matter(file);
  return content;
}
