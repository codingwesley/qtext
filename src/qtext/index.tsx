import * as React from "react";
import { fontCssUrl } from "./config";
import * as load from "load-script";
import "draft-js/dist/Draft.css";
import { Editor, EditorState } from "draft-js";

interface QTextProps {
  readOnly?: boolean;
  placeholder?: string;
}

interface QTextState {
  editorState: EditorState;
}

// https://www.froala.com/wysiwyg-editor
export class QText extends React.Component<QTextProps, QTextState> {
  static defaultProps: QTextProps = {
    readOnly: true,
    placeholder: "Please edit your content..."
  };
  constructor(props: QTextProps) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState
    });
  };

  public render(): JSX.Element {
    const { placeholder, readOnly } = this.props;

    return (
      <Editor
        placeholder={placeholder}
        readOnly={readOnly}
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }

  componentDidMount() {
    load(fontCssUrl);
  }
}

export default QText;
