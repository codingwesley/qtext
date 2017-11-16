export interface TStyleItem {
  label: string;
  icon?: string; // 没有 icon 的时候显示 label http://fontawesome.io/icons/
  desc: string; // 提示信息
  style: string;
  isBlock: boolean;
}

export const STYLE_LIST: TStyleItem[] = [
  { label: "H1", style: "header-one", desc: "1号标题", isBlock: true },
  { label: "H2", style: "header-two", desc: "2好标题", isBlock: true },
  { label: "H3", style: "header-three", desc: "3号标题", isBlock: true },
  { label: "H4", style: "header-four", desc: "4号标题", isBlock: true },
  { label: "H5", style: "header-five", desc: "5号标题", isBlock: true },
  { label: "H6", style: "header-six", desc: "6号标题", isBlock: true },
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
    label: "Underline",
    style: "UNDERLINE",
    desc: "下划线",
    isBlock: false,
    icon: "underline"
  },
  {
    label: "Monospace",
    style: "CODE",
    desc: "等宽字文本",
    isBlock: false,
    icon: "fw"
  }
];

export const colorStyleMap = {
  black: {
    color: "#000"
  },
  red: {
    color: "rgba(255, 0, 0, 1.0)"
  },
  orange: {
    color: "rgba(255, 127, 0, 1.0)"
  },
  yellow: {
    color: "rgba(180, 180, 0, 1.0)"
  },
  green: {
    color: "rgba(0, 180, 0, 1.0)"
  },
  blue: {
    color: "rgba(0, 0, 255, 1.0)"
  },
  indigo: {
    color: "rgba(75, 0, 130, 1.0)"
  },
  violet: {
    color: "rgba(127, 0, 255, 1.0)"
  }
};

interface TSize {
  fontSize: number;
}

export const fontSizeStyleMap = (() => {
  const list = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72];
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
  Arial: {
    fontFamily: "Arial,Helvetica,sans-serif"
  },
  Georgia: {
    fontFamily: "Georgia"
  },
  Impact: {
    fontFamily: "Impact,Charcoal,sans-serif"
  },
  Tahoma: {
    fontFamily: "Tahoma,Geneva,sans-serif"
  },
  "Times New Roman": {
    fontFamily: "Times New Roman,Times,serif,-webkit-standard"
  },
  Verdana: {
    fontFamily: "Verdana,Geneva,sans-serif"
  }
};
