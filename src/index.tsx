import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classnames from "classnames";
import { fontCssUrl } from "./config";
import { decorator } from "./decorator";
import { ToolBar } from "./ToolBar";
import { isMobile } from "./util";
import { QTextView } from "./QtextView";
import {
  EditorState,
  convertToRaw,
  RawDraftContentState,
  convertFromRaw,
  DraftHandleValue
} from "draft-js";
import { onPasted } from "./onPasted";

const styles = require("./less/index.less");

export interface QTextProps {
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (data: TEditData) => void;
  value?: TEditData;
  disabled?: string[]; // ./tools.ts  disabled tool keys
  rcUploadProps?: any; // 同 rc-upload props image upload
  rcSuccess?: (data: any) => string | Promise<string>;
}

export interface QTextState {
  editorState: EditorState;
  readOnly: boolean;
  editMode: "desktop" | "mobile";
  toolBarHeight: number;
}

export interface TEditData {
  data: RawDraftContentState;
}

const LOCALKEY = "LASTEST_VERSION";

function equalObj(a: any, b: any): boolean {
  if (typeof a !== typeof b) {
    return false;
  }

  if (JSON.stringify(a) !== JSON.stringify(b)) {
    return false;
  }

  return true;
}

// https://www.froala.com/wysiwyg-editor
export class QText extends React.Component<QTextProps, QTextState> {
  static defaultProps: QTextProps = {
    readOnly: false,
    placeholder: "Please edit your content..."
  };

  id: number = 1;

  qtextView: QTextView | null;
  link: HTMLLinkElement;
  toolbar: ToolBar | null;

  constructor(props: QTextProps) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(decorator),
      readOnly: props.readOnly || false,
      editMode: "desktop",
      toolBarHeight: 30
    };
  }

  onChange: (editorState: EditorState) => void = editorState => {
    this.setState(
      {
        editorState
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.getEditData());
        }
      }
    );
  };
  /**
   * 保存数据到localStorage
   */
  saveData = (localKey: string = LOCALKEY) => {
    const { data } = this.getEditData();
    if (!this.state.editorState.getCurrentContent().hasText()) {
      // 没有内容是不保存的
      return;
    }
    localStorage.setItem(
      localKey,
      JSON.stringify({
        time: new Date().getTime(),
        editContent: data
      })
    );
  };

  getEditData(): TEditData {
    return { data: convertToRaw(this.state.editorState.getCurrentContent()) };
  }

  toggleMode = (mode: "desktop" | "mobile") => {
    this.setState(
      {
        editMode: mode
      },
      () => {
        setTimeout(this.setToolBarHeight, 500);
      }
    );
  };

  toggleEye = (mode: string) => {
    this.setState({
      readOnly: mode === "Preview"
    });
  };

  handlePastedFiles = (files: Array<Blob>): DraftHandleValue => {
    onPasted(this, files);

    return "not-handled";
  };

  public render(): JSX.Element {
    const { rcUploadProps, rcSuccess, placeholder } = this.props;
    const { readOnly, editMode, toolBarHeight, editorState } = this.state;
    const className = classnames(styles.editor, {
      [styles.inEditStatus]: !this.props.readOnly,
      [styles.desktop]: editMode === "desktop",
      [styles.mobile]: !isMobile() && editMode === "mobile"
    });

    return (
      <div className={className}>
        <div
          className={styles.inner}
          style={{
            paddingTop: readOnly ? "auto" : toolBarHeight
          }}
        >
          {this.props.readOnly ? null : (
            <ToolBar
              ref={r => (this.toolbar = r)}
              readOnly={readOnly}
              className={styles.header}
              editMode={editMode}
              disabled={this.props.disabled}
              toggleEye={this.toggleEye}
              toggleMode={this.toggleMode}
              editorState={editorState}
              changeEditState={this.onChange}
              rcUploadProps={rcUploadProps}
              rcSuccess={rcSuccess}
            />
          )}
          <div className={styles.content}>
            <QTextView
              ref={r => (this.qtextView = r)}
              readOnly={readOnly}
              editorProps={{
                onChange: this.onChange,
                editorState: this.state.editorState,
                placeholder: readOnly ? "" : placeholder || "",
                handlePastedFiles: this.handlePastedFiles
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps: QTextProps) {
    if (
      nextProps.value &&
      nextProps.value.data &&
      !equalObj(nextProps.value.data, this.getEditData())
    ) {
      this.setData(nextProps.value.data);
    }
  }

  setData(rowData: RawDraftContentState, cb?: Function) {
    this.setState(
      {
        editorState: EditorState.createWithContent(convertFromRaw(rowData))
      },
      () => {
        if (cb) {
          cb();
        }
      }
    );
  }

  setToolBarHeight = () => {
    setTimeout(() => {
      if (this && this.toolbar) {
        const toolBarHeight = ReactDOM.findDOMNode(this.toolbar).clientHeight;
        this.setState({
          toolBarHeight
        });
      }
    }, 1000);
  };

  componentDidMount() {
    const { readOnly, value } = this.props;
    if (value && value.data) {
      this.setData(value.data);
    }

    if (!readOnly) {
      // 编辑模式
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = fontCssUrl;
      document.head.appendChild(link);
      this.link = link;
    }

    this.setToolBarHeight();
  }

  componentWillUnMount() {
    if (this.link) {
      document.head.removeChild(this.link);
    }
  }
}

export default { QText, QTextView };
