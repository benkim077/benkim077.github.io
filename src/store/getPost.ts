import Showdown from "showdown";
import getMarkdownContent from "./getMarkdownContent";
import { getMarkdownMetadata } from "./getMarkdownMetadata";

export default async function getPost(name: string) {
  // 계속 바깥으로 밀어내야 하는 코드(string)인가?
  const meta = getMarkdownMetadata(`src/contents/${name}.md`);
  const content = await getMarkdownContent(`src/contents/${name}.md`);
  // TODO: 이 컨텐트를 HTML로 변환한다.
  const converter = new Showdown.Converter();
  const html = converter.makeHtml(content);
  return await Promise.all([meta, html]);
}
