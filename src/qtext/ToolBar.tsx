import * as React from "react";
import { EditorState } from "draft-js";
import * as classnames from "classnames";
import { ListStyle } from "./ListStyle";
import {
  STYLE_LIST,
  TStyleItem,
  fontFamilyStyleMap,
  fontSizeStyleMap,
  colorStyleMap
} from "./const";

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
        {this._renderFamily()}
        {this._renderFontSize()}
        {this._renderColors()}

        {STYLE_LIST.map(item => {
          const currentStyle = editorState.getCurrentInlineStyle();
          const selection = editorState.getSelection();
          const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
          const active = item.isBlock
            ? blockType === item.style
            : currentStyle.has(item.style);

          return (
            <ToolBtn
              key={item.style}
              item={item}
              onToggle={this.onToggle}
              active={active}
            />
          );
        })}
      </div>
    );
  }

  renderActionBtn(
    label: string,
    icon: string,
    desc: string,
    style: string,
    disabled: boolean,
    onToggle: () => void,
    isBlock: boolean = false
  ) {
    return (
      <ToolBtn
        key={label}
        item={{
          icon,
          label,
          desc,
          isBlock,
          style
        }}
        disabled={disabled}
        active={false}
        onToggle={onToggle}
      />
    );
  }

  _renderUndoBtn() {
    const { editorState, changeEditState } = this.props;
    return this.renderActionBtn(
      "撤销",
      "undo",
      "撤销",
      "undo",
      editorState.getUndoStack().isEmpty(),
      function() {
        changeEditState(EditorState.undo(editorState));
      }
    );
  }

  _renderRedoBtn() {
    const { editorState, changeEditState } = this.props;
    return this.renderActionBtn(
      "重做",
      "repeat",
      "重做",
      "undo",
      editorState.getRedoStack().isEmpty(),
      function() {
        changeEditState(EditorState.redo(editorState));
      }
    );
  }

  _renderColors() {
    return (
      <ListStyle
        data={colorStyleMap}
        icon="eyedropper"
        label="颜色设置"
        width={100}
        onToggle={function(style: string) {}}
      />
    );
  }
  _renderFamily() {
    return (
      <ListStyle
        data={fontFamilyStyleMap}
        icon="font"
        label="字体设置"
        width={140}
        onToggle={function(style: string) {}}
      />
    );
  }

  _renderFontSize() {
    return (
      <ListStyle
        data={fontSizeStyleMap}
        icon="text-height"
        label="字体大小设置"
        width={100}
        onToggle={function(style: string) {}}
      />
    );
  }
}

export default ToolBar;
