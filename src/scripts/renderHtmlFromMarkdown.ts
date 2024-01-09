import Showdown from "showdown";
import { readFile } from "fs/promises";
import pug from "pug";
import matter from "gray-matter";
import { HtmlTemplateVariables, Post, PostMetadata } from "../interfaces";
import config from "../config";
import convertFromMarkdownToHtml from "./convertHtmlFromMarkdown";

const { SRC, VIEWS } = config.build;

export async function renderHtmlFromMarkdown(
  source: string,
  templateArguments?: HtmlTemplateVariables
) {
  const postFile = await readFile(source);
  const { data, content } = matter(postFile.toString());
  const post: Post = {
    ...(data as PostMetadata),
    content: convertFromMarkdownToHtml(content),
  };
  const templateFilePath = `${SRC}/${VIEWS}/post.pug`;
  const templateFile = await readFile(templateFilePath);
  const createPostHtml = pug.compile(templateFile.toString(), {
    filename: templateFilePath,
  });
  return createPostHtml({
    post,
    site: {
      title: `${post.title} - Ben의 기술 블로그`,
      title_for_sharing: `${post.title}`,
      description: post.summary,
      url: `https://benkim077.github.io/${post.slug}`,
    },
  });
}
