import { readdir } from "fs/promises";
import { PostMetadata } from "../interfaces";
import { getMarkdownMetadata } from "./getMarkdownMetadata";

export default async function getPostList(path: string) {
  const postFiles = await readdir(path);
  const metadatasPromise = postFiles.map((file) =>
    getMarkdownMetadata("src/contents/" + file)
  );
  const metas = await Promise.all(metadatasPromise);

  metas.sort((a, b) => {
    return -(a.created_at.getTime() - b.created_at.getTime());
  });
  const sortedPost = metas;
  return sortedPost;
}
