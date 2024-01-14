import Showdown from "showdown";
import { utilityClassMap } from "../assets/style";
import getClassNameFromHtmlClassAttribute from "../utility/getClassNameFromHtmlAttribute";

const bindings = Object.keys(utilityClassMap).map((key) => ({
  type: "output",
  regex: new RegExp(`<${key}\\b([^>]*)>`, "g"),
  replace: (match: RegExp, group: string) => {
    if (key === "code") {
      const originClass =
        group === "" ? "" : getClassNameFromHtmlClassAttribute(group);
      return `<${key} class="${originClass} ${utilityClassMap[key]}">`;
    }

    return group === ""
      ? `<${key} class="${utilityClassMap[key]}">`
      : `<${key} class="${utilityClassMap[key]}" ${group}>`; // 리팩토링 : class, src, alt 를 분리해서 처리할 필요가 있다.
  },
}));

export default function convertFromMarkdownToHtml(content: string) {
  const converter = new Showdown.Converter({
    headerLevelStart: 3,
    extensions: [...bindings],
    noHeaderId: true,
  });
  return converter.makeHtml(content);
}
