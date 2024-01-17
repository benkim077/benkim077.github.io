interface ClassMap {
  [key: string]: string;
}

export const utilityClassMap: ClassMap = {
  // h1: "font-bold text-3xl my-3",
  // h2: "text-2xl font-bold my-2",
  h3: "text-4xl font-bold my-1",
  h4: "text-3xl font-bold my-1",
  h5: "text-2xl font-bold my-1",
  h6: "text-xl font-bold my-1",
  p: "my-3",
  hr: "border-gray-400 my-5",
  ul: "list-disc list-outside pl-8 my-3",
  ol: "list-decimal list-outside pl-8 my-3",
  strong: "bg-[#ffce0060]",
  em: "text-[#ff82b2]",
  blockquote: "px-3 text-font-quote my-2 border-l-2 border-[#4d8ce7]",
  pre: "bg-[#282c35] p-3 my-2 overflow-auto",
  code: "bg-[#282c35] p-1 rounded",
  img: "px-4 pt-4 pb-1",
};
