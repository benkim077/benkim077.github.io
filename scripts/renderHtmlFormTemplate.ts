import { readFile, writeFile } from "fs/promises";
import pug from "pug";
import { HtmlTemplateVariables } from "../src/interfaces";

/** Pug 파일을 읽고 HTML 파일을 렌더링하는 함수 */

export async function renderHtmlFormTemplate(
  source: string,
  templateArguments: HtmlTemplateVariables
) {
  const templateFile = await readFile(source);
  const createHtml = pug.compile(templateFile.toString(), {
    filename: source,
  });

  return createHtml({ ...templateArguments }); // TODO: 동적/정적 값 구분
}
