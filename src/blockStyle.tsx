import { ContentBlock } from "draft-js";

const styles = require("./scss/index.less");

export function getBlockStyle(block: ContentBlock) {
  const type: string = block.getType();

  switch (type) {
    case "blockquote":
      return styles.blockquote;
    case "center":
    case "right":
      return styles[type];
    default:
      return "";
  }
}
