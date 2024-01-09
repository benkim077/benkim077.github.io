import Showdown from "showdown";

interface ClassMap {
  [key: string]: string;
}

const classMap: ClassMap = {
  // h1: "font-bold text-3xl my-3",
  // h2: "text-2xl font-bold my-2",
  h3: "text-4xl font-bold my-1",
  h4: "text-3xl font-bold my-1",
  h5: "text-2xl font-bold my-1 ",
  p: "my-1",
  hr: "border-gray-400 my-5",
  ul: "list-disc list-outside pl-8",
  ol: "list-decimal list-outside pl-8",
  strong: "text-bold",
  em: "text-bold",
  blockquote: "px-3 text-font-quote my-2 border-l-2 border-[#4d8ce7]",
  pre: "bg-[#282c35] p-3 my-2",
};

const bindings = Object.keys(classMap).map((key) => ({
  type: "output",
  regex: new RegExp(`<${key}\\b[^>]*>`, "g"),
  replace: `<${key} class="${classMap[key]}" $1>`,
}));

export default function convertFromMarkdownToHtml(content: string) {
  const converter = new Showdown.Converter({
    headerLevelStart: 3,
    extensions: [...bindings],
    noHeaderId: true,
  });
  return converter.makeHtml(content);
}
