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
  { label: "Monospace", style: "CODE", desc: "等宽字文本", isBlock: false }
];
