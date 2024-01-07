import Showdown from "showdown";
import { readFile } from "fs/promises";
import pug from "pug";
import matter from "gray-matter";
import { HtmlTemplateVariables, Post, PostMetadata } from "../interfaces";
import config from "../config";

const { SRC, VIEWS } = config.build;

export async function renderHtmlFromMarkdown(
  source: string,
  templateArguments?: HtmlTemplateVariables
) {
  const postFile = await readFile(source);
  // TODO: data의 Type 설정은 어떻게 해야 하는가?
  const { data, content } = matter(postFile.toString());
  const converter = new Showdown.Converter({ headerLevelStart: 3 });
  const post: Post = {
    ...(data as PostMetadata),
    content: converter.makeHtml(content),
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
