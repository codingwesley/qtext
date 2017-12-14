import * as React from "react";
import * as classnames from "classnames";
import { InlineStyleMap } from "./const";
import { decorator } from "./decorator";
import { AtomicBlock } from "./AtomicBlock";
import { getBlockStyle } from "./blockStyle";
import {
  Editor,
  EditorProps,
  EditorState,
  ContentBlock,
  convertToRaw,
  RawDraftContentState,
  convertFromRaw
} from "draft-js";
import "draft-js/dist/Draft.css";

const styles = require("./less/QtextView.less");

export interface QTextViewProps {
  readOnly?: boolean;
  onChange?: (editorState: EditorState) => void;
  value?: RawDraftContentState;
  className?: string;
  editorProps?: EditorProps;
}

export interface QTextViewState {
  editorState: EditorState;
}

/**
 * 如果有editorstate传入 就以editorState 的数据为准，其次是value
 * 如果支持render data可以通过value
 */
export class QTextView extends React.Component<QTextViewProps, QTextViewState> {
  static defaultProps: QTextViewProps = {
    readOnly: true
  };

  constructor(props: QTextViewProps) {
    super(props);
    if (props.value) {
      const contentState = convertFromRaw(props.value);
      this.state = {
        editorState: EditorState.createWithContent(contentState, decorator)
      };
      return;
    }

    this.state = {
      editorState: EditorState.createEmpty(decorator)
    };
  }

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

  public render(): JSX.Element {
    const { readOnly, editorProps, className } = this.props;
    const { editorState } = this.state;

    return (
      <div className={classnames(styles.viewcontent, className)}>
        <Editor
          customStyleMap={InlineStyleMap}
          blockRendererFn={this.getBlockRender}
          blockStyleFn={getBlockStyle}
          readOnly={readOnly}
          editorState={editorState}
          onChange={this.onChange}
          {...editorProps}
        />
      </div>
    );
  }

  componentWillReceiveProps(nextProps: QTextViewProps) {
    if (
      nextProps.value &&
      EditorState.createWithContent(convertFromRaw(nextProps.value)) !==
        this.state.editorState
    ) {
      this.setData(nextProps.value);
    }
  }

  getEditorState(): EditorState {
    return this.state.editorState;
  }

  getData(): RawDraftContentState {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }

  setData(rowData: RawDraftContentState) {
    const contentState = convertFromRaw(rowData);
    this.onChange(EditorState.createWithContent(contentState, decorator));
  }
}

export default {
  QTextView
};
