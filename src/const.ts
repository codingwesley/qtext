export { colorStyleMap, bgColors } from "./colors";

export interface TStyleItem {
  label: string;
  icon?: string; // 没有 icon 的时候显示 label http://fontawesome.io/icons/
  desc: string; // 提示信息
  style: string;
  isBlock: boolean;
}

export const titles = [
  { label: "H1", style: "header-one", desc: "Heading 1", isBlock: true },
  { label: "H2", style: "header-two", desc: "Heading 2", isBlock: true },
  { label: "H3", style: "header-three", desc: "Heading 3", isBlock: true },
  { label: "H4", style: "header-four", desc: "Heading 4", isBlock: true },
  { label: "H5", style: "header-five", desc: "Heading 5", isBlock: true },
  { label: "H6", style: "header-six", desc: "Heading 6", isBlock: true }
];

export const STYLE_LIST: TStyleItem[] = [
  {
    label: "Blockquote",
    style: "blockquote",
    desc: "",
    isBlock: true,
    icon: "quote-left"
  },
  {
    label: "UL",
    style: "unordered-list-item",
    desc: "有序列表",
    isBlock: true,
    icon: "list-ul"
  },
  {
    label: "OL",
    style: "ordered-list-item",
    desc: "有序列表",
    isBlock: true,
    icon: "list-ol"
  },
  {
    label: "left",
    style: "left",
    desc: "向左对齐",
    isBlock: true,
    icon: "align-left"
  },
  {
    label: "center",
    style: "center",
    desc: "居中对齐",
    isBlock: true,
    icon: "align-center"
  },
  {
    label: "right",
    style: "right",
    desc: "向右对齐",
    isBlock: true,
    icon: "align-right"
  },
  {
    label: "Code Block",
    style: "code-block",
    desc: "代码块",
    isBlock: true,
    icon: "code"
  },
  { label: "Bold", style: "BOLD", desc: "加粗", isBlock: false, icon: "bold" },
  {
    label: "Italic",
    style: "ITALIC",
    desc: "斜体",
    isBlock: false,
    icon: "italic"
  },
  {
    label: "strikethrough",
    style: "STRIKETHROUGH",
    desc: "strikethrough",
    isBlock: false,
    icon: "strikethrough"
  },
  {
    label: "Underline",
    style: "UNDERLINE",
    desc: "下划线",
    isBlock: false,
    icon: "underline"
  }
];

export interface TSize {
  fontSize: number;
}

export const fontSizeStyleMap = (() => {
  const list = [8, 9, 10, 11, 12, 14, 15, 16, 18, 24, 30, 36, 48, 60, 72];
  const r: { [key: string]: TSize } = {};
  list.forEach(num => {
    const key = `${num}`;
    r[key] = {
      fontSize: num
    };
  });

  return r;
})();

export const fontFamilyStyleMap = {
  "Roboto-Regular": {
    fontFamily: "Roboto-Regular"
  },
  "Roboto-Light": {
    fontFamily: "Roboto-Light"
  },
  "Roboto-LightItalic": {
    fontFamily: "Roboto-LightItalic"
  },
  "Roboto-Bold": {
    fontFamily: "Roboto-Bold"
  },
  "Roboto-BoldItalic": {
    fontFamily: "Roboto-BoldItalic"
  },
  "Roboto-Medium": {
    fontFamily: "Roboto-Medium"
  },
  "Roboto-MediumItalic": {
    fontFamily: "Roboto-MediumItalic"
  },
  "Roboto-Thin": {
    fontFamily: "Roboto-Thin"
  },
  "Roboto-ThinItalic": {
    fontFamily: "Roboto-ThinItalic"
  },
  "Roboto-Black": {
    fontFamily: "Roboto-Black"
  },
  "Roboto-BlackItalic": {
    fontFamily: "Roboto-BlackItalic"
  },
  "Roboto-Italic": {
    fontFamily: "Roboto-Italic"
  },
  Arial: {
    fontFamily: "Arial,Helvetica,sans-serif"
  },
  Georgia: {
    fontFamily: "Georgia"
  },
  Monospace: {
    fontFamily: "monospace"
  },
  Impact: {
    fontFamily: "Impact,Charcoal,sans-serif"
  },
  Tahoma: {
    fontFamily: "Tahoma,Geneva,sans-serif"
  },
  TimesNewRoman: {
    fontFamily: "Times New Roman,Times,serif,-webkit-standard"
  },
  Verdana: {
    fontFamily: "Verdana,Geneva,sans-serif"
  }
};
