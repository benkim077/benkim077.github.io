import matter from "gray-matter";
import { readFile } from "fs/promises";
import { PostMetadata } from "../interfaces";

export async function getMarkdownMetadata(path: string) {
  const file = await readFile(path);
  return matter(file).data as PostMetadata;
}
