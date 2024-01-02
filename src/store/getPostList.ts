import matter from "gray-matter";
import { readFile, readdir } from "fs/promises";
import { PostMetadata } from "../interfaces";

export default async function getPostList(path: string) {
  const postFiles = await readdir(path);
  const metadatasPromise = postFiles.map((file) =>
    getMarkdownMetadata("src/contents/" + file)
  );
  const metas = await Promise.allSettled(metadatasPromise);

  const posts = metas.map((meta) => {
    if (meta.status === "fulfilled") {
      return {
        slug: meta.value.slug,
        title: meta.value.title,
        summary: meta.value.summary,
        tags: meta.value.tags,
        created_at: meta.value.created_at,
      };
    }
    if (meta.status === "rejected") {
      console.error(meta.reason);
      // TODO: 실패한 경우 다시 요청하는 로직 필요
    }
  });

  const filteredPost = posts.filter(
    (post): post is PostMetadata => post !== undefined
  );

  filteredPost.sort((a, b) => {
    return -(a.created_at.getTime() - b.created_at.getTime());
  });
  const sortedPost = filteredPost;
  return sortedPost;
}

async function getMarkdownMetadata(path: string): Promise<PostMetadata> {
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
