import { buildFromMarkdown } from "./buildFromMarkdown";
import { buildFromTemplate } from "./buildFromTemplate";
import config from "./config";

const { SRC, CONTENTS, VIEWS } = config.build;

export async function buildHtmlFiles(path: string) {
  switch (path) {
    case `${SRC}/${VIEWS}`:
      await buildFromTemplate(path);
      break;
    case `${SRC}/${CONTENTS}`:
      await buildFromMarkdown(path);
      break;
  }
}
