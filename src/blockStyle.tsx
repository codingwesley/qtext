import { ContentBlock } from "draft-js";

export function getBlockStyle(block: ContentBlock) {
  const type: string = block.getType();

  switch (type) {
    case "header-one":
      return "qtext-titleH1";
    case "header-two":
      return "qtext-titleH2";
    case "header-three":
      return "qtext-titleH3";
    case "header-four":
      return "qtext-titleH4";
    case "header-five":
      return "qtext-titleH5";
    case "header-six":
      return "qtext-titleH6";
    case "blockquote":
      return "qtext-blockquote";
    case "code-block":
      return "qtext-code";
    case "center":
    case "right":
      return `qtext-${type}`;
    default:
      return "";
  }
}
