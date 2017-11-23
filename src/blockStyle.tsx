import { ContentBlock } from "draft-js";

const styles = require("./scss/index.less");

export function getBlockStyle(block: ContentBlock) {
  const type: string = block.getType();

  switch (type) {
    case "header-one":
      return styles.titleH1;
    case "header-two":
      return styles.titleH2;
    case "header-three":
      return styles.titleH3;
    case "header-four":
      return styles.titleH4;
    case "header-five":
      return styles.titleH5;
    case "header-six":
      return styles.titleH6;
    case "blockquote":
      return styles.blockquote;
    case "code-block":
      return styles.code;
    case "center":
    case "right":
      return styles[type];
    default:
      return "";
  }
}
