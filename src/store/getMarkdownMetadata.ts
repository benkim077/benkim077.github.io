import matter from "gray-matter";
import { readFile } from "fs/promises";
import { PostMetadata } from "../interfaces";

export async function getMarkdownMetadata(path: string): Promise<PostMetadata> {
  const file = await readFile(path);
  const {
    data: { slug, title, summary, tags, created_at },
  } = matter(file);
  return {
    slug,
    title,
    summary,
    tags,
    created_at,
  };
}
