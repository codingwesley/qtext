import * as React from "react";
import * as classnames from "classnames";
import { fontCssUrl } from "./config";
import { loadCSS } from "fg-loadcss";
import "draft-js/dist/Draft.css";
import { ListStyle } from "./ListStyle";
import { ToolBar } from "./ToolBar";
import { isMobile } from "./util";
import { colorStyleMap, fontFamilyStyleMap, fontSizeStyleMap } from "./const";
import { decorator } from "./decorator";
import { AtomicBlock } from "./AtomicBlock";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentBlock,
  convertToRaw,
  RawDraftContentState,
  convertFromRaw
} from "draft-js";

const styles = require("./scss/index.less");

export interface QTextProps {
  readOnly?: boolean;
  placeholder?: string;
  value?: RawDraftContentState;
  onChange?: (editorState: EditorState) => void;
  autoSave?: boolean;
}

export interface QTextState {
  editorState: EditorState;
  readOnly: boolean;
  editMode: "desktop" | "mobile";
}

export interface TEditData {
  data: RawDraftContentState;
}

function getBlockStyle(block: ContentBlock) {
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

const LOCALKEY = "LASTEST_VERSION";

// https://www.froala.com/wysiwyg-editor
export class QText extends React.Component<QTextProps, QTextState> {
  static defaultProps: QTextProps = {
    readOnly: false,
    autoSave: false,
    placeholder: "Please edit your content..."
  };

  id: number = 1;

  getBlockRender = (block: ContentBlock) => {
    const type = block.getType();
    const { editorState } = this.state;

    if (type === "atomic") {
      return {
        component: AtomicBlock,
        editable: false,
        props: {
          editorState
        }
      };
    }
    return null;
  };

  onChange: (editorState: EditorState) => void = editorState => {
    this.setState({ editorState }, () => {
      if (this.props.onChange) {
        this.props.onChange(editorState);
      }
    });
  };

  saveData = () => {
    const { data } = this.getEditData();
    if (!this.state.editorState.getCurrentContent().hasText()) {
      // 没有内容是不保存的
      return;
    }

    localStorage.setItem(
      LOCALKEY,
      JSON.stringify({
        time: new Date().getTime(),
        editContent: data
      })
    );
  };

  getEditData(): TEditData {
    const { editorState } = this.state;

    return { data: convertToRaw(editorState.getCurrentContent()) };
  }

  constructor(props: QTextProps) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      readOnly: props.readOnly || false,
      editMode: "desktop"
    };
  }

  _toggleBlockType = (blockType: string) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  _toggleInlineStyle = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  toggleMode = (mode: "desktop" | "mobile") => {
    this.setState({
      editMode: mode
    });
  };

  toggleEye = (mode: string) => {
    this.setState({
      readOnly: mode === "Preview"
    });
  };

  public render(): JSX.Element {
    const { placeholder } = this.props;
    const { editorState, readOnly, editMode } = this.state;
    const className = classnames(styles.editor, {
      [styles.desktop]: editMode === "desktop",
      [styles.mobile]: !isMobile() && editMode === "mobile"
    });

    return (
      <div className={className}>
        <div className={styles.inner}>
          <ListStyle
            className={styles.btnPreview}
            data={{
              Preview: {},
              Edit: {}
            }}
            icon={readOnly ? "eye-slash" : "eye"}
            label="预览效果"
            width={80}
            onToggle={this.toggleEye}
          />

          {readOnly ? null : (
            <ToolBar
              editMode={editMode}
              toggleMode={this.toggleMode}
              editorState={editorState}
              changeEditState={this.onChange}
              onToggle={(isBlock, style) => {
                if (isBlock) {
                  this._toggleBlockType(style);
                } else {
                  this._toggleInlineStyle(style);
                }
              }}
            />
          )}
          <div className={styles.content}>
            <Editor
              customStyleMap={{
                ...colorStyleMap,
                ...fontFamilyStyleMap,
                ...fontSizeStyleMap
              }}
              blockRendererFn={this.getBlockRender}
              blockStyleFn={getBlockStyle}
              placeholder={placeholder}
              readOnly={readOnly}
              editorState={editorState}
              onChange={this.onChange}
            />
          </div>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps: QTextProps) {
    if (
      nextProps.value &&
      EditorState.createWithContent(convertFromRaw(nextProps.value)) !==
        this.state.editorState
    ) {
      this.setData(nextProps.value);
    }
  }

  setData(rowData: RawDraftContentState) {
    const contentState = convertFromRaw(rowData);
    this.onChange(EditorState.createWithContent(contentState, decorator));
  }

  componentDidMount() {
    const { readOnly, autoSave } = this.props;
    if (!readOnly) {
      // 编辑模式
      loadCSS(fontCssUrl);

      const fn = () => {
        if (this.id <= 0) {
          return;
        }
        // 打开编辑器一分钟保存一次数据
        setTimeout(() => {
          this.saveData();
          this.id += 1;

          fn();
        }, 1000 * 60);
      };

      if (autoSave) {
        fn();
      }

      // 取回上次的内容
      const dataStr = localStorage.getItem(LOCALKEY);
      if (!dataStr) {
        return;
      }
      const TIMEBACK_MIN = 20;
      const { time, editContent } = JSON.parse(dataStr);
      const t = new Date(time);
      if (new Date().getTime() - t.getTime() > TIMEBACK_MIN * 60 * 1000) {
        // 超过时间就不回来
        return;
      }
      t.toLocaleTimeString();
      const result = confirm(
        `需要继续编辑刚刚[<${TIMEBACK_MIN}min]浏览器保存的数据吗? 保存时间: ${t.toString()}`
      );
      if (result) {
        this.setData(editContent);
      }
    }
  }

  componentWillUnMount() {
    this.id = -1;
  }
}

export default QText;
