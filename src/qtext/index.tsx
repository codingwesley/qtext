import * as React from "react";
// import * as classnames from "classnames";
import { fontCssUrl } from "./config";
import { loadCSS } from "fg-loadcss";
import "draft-js/dist/Draft.css";
import { ToolBar } from "./ToolBar";
import { Editor, EditorState, RichUtils, ContentBlock } from "draft-js";

const styles = require("./scss/index.scss");

interface QTextProps {
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (editorState: EditorState) => void;
}

interface QTextState {
  editorState: EditorState;
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

function getBlockRender(block: ContentBlock) {
  const type: string = block.getType();
  return type;
}

// https://www.froala.com/wysiwyg-editor
export class QText extends React.Component<QTextProps, QTextState> {
  static defaultProps: QTextProps = {
    readOnly: false,
    placeholder: "Please edit your content..."
  };

  onChange: (editorState: EditorState) => void = editorState => {
    this.setState({ editorState }, () => {
      if (this.props.onChange) {
        this.props.onChange(editorState);
      }
    });
  };

  constructor(props: QTextProps) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  _toggleBlockType = (blockType: string) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  _toggleInlineStyle = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  public render(): JSX.Element {
    const { placeholder, readOnly } = this.props;
    const { editorState } = this.state;
    const className = styles.editor;

    return (
      <div className={className}>
        {readOnly ? null : (
          <ToolBar
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
            blockRendererFn={getBlockRender}
            blockStyleFn={getBlockStyle}
            placeholder={placeholder}
            readOnly={readOnly}
            editorState={editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    loadCSS(fontCssUrl);
  }
}

export default QText;
