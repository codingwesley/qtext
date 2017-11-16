import * as React from "react";
import { EditorState } from "draft-js";
import * as classnames from "classnames";
import { STYLE_LIST, TStyleItem } from "./const";

const styles = require("./scss/ToolBar.scss");

interface ToolBtnProps {
  onToggle: (isBlock: boolean, style: string) => void;
  item: TStyleItem;
  active: boolean;
  disabled?: boolean;
}

interface ToolBtnState {}

export class ToolBtn extends React.Component<ToolBtnProps, ToolBtnState> {
  onToggle = (e: any) => {
    e.preventDefault();
    this.props.onToggle(this.props.item.isBlock, this.props.item.style);
  };

  public render(): JSX.Element {
    const { label, icon } = this.props.item;
    const { disabled } = this.props;
    return (
      <button
        disabled={disabled !== undefined ? disabled : false}
        onMouseDown={this.onToggle}
        className={classnames(styles.toolbtn, {
          [styles.active]: this.props.active
        })}
      >
        {icon ? <i className={`fa fa-${icon}`} /> : <span>{label}</span>}
      </button>
    );
  }
}

interface ToolBarProps {
  editorState: EditorState;
  changeEditState: (editorState: EditorState) => void;
  onToggle: (isBlock: boolean, style: string) => void;
}

interface ToolBarState {}

export class ToolBar extends React.Component<ToolBarProps, ToolBarState> {
  onToggle = (isBlock: boolean, style: string) => {
    this.props.onToggle(isBlock, style);
  };

  public render(): JSX.Element {
    const { editorState } = this.props;
    return (
      <div className={styles.barbox}>
        {this._renderUndoBtn()}
        {this._renderRedoBtn()}

        {STYLE_LIST.map(item => {
          const currentStyle = editorState.getCurrentInlineStyle();
          const selection = editorState.getSelection();
          const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
          const style = item.isBlock ? blockType : currentStyle;

          return (
            <ToolBtn
              key={item.style}
              item={item}
              onToggle={this.onToggle}
              active={style === item.style}
            />
          );
        })}
      </div>
    );
  }

  _renderUndoBtn() {
    const { editorState, changeEditState } = this.props;

    return (
      <ToolBtn
        key="undo"
        item={{
          icon: "undo",
          label: "撤销",
          desc: "撤销",
          isBlock: false,
          style: "undo"
        }}
        disabled={editorState.getUndoStack().isEmpty()}
        active={false}
        onToggle={function() {
          changeEditState(EditorState.undo(editorState));
        }}
      />
    );
  }

  _renderRedoBtn() {
    const { editorState, changeEditState } = this.props;

    return (
      <ToolBtn
        key="redo"
        item={{
          icon: "repeat",
          label: "重做",
          desc: "重做",
          isBlock: false,
          style: "redo"
        }}
        disabled={editorState.getRedoStack().isEmpty()}
        active={false}
        onToggle={function() {
          changeEditState(EditorState.redo(editorState));
        }}
      />
    );
  }
}

export default ToolBar;
