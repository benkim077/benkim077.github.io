import { readdir } from "fs/promises";
import { getMarkdownMetadata } from "./getMarkdownMetadata";

export default async function getPostList(path: string) {
  const postFiles = await readdir(path);
  const metadatasPromise = postFiles.map((file) =>
    getMarkdownMetadata("src/contents/" + file)
  );
  const metas = await Promise.all(metadatasPromise);

  const publishedPost = metas.filter((meta) => meta.is_published);
  const sortedPost = publishedPost.sort((a, b) => {
    return -(a.created_at.getTime() - b.created_at.getTime());
  });
  return {
    posts: sortedPost,
  };
}
