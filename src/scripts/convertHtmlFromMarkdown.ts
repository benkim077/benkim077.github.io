import Showdown from "showdown";
import { utilityClassMap } from "../assets/style";

const bindings = Object.keys(utilityClassMap).map((key) => ({
  type: "output",
  regex: new RegExp(`<${key}\\b([^>]*)>`, "g"),
  replace: `<${key} class="${utilityClassMap[key]}" $1>`,
}));

export default function convertFromMarkdownToHtml(content: string) {
  const converter = new Showdown.Converter({
    headerLevelStart: 3,
    extensions: [...bindings],
    noHeaderId: true,
  });
  return converter.makeHtml(content);
}
