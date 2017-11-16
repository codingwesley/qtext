import * as React from "react";
import { EditorState, Modifier, RichUtils } from "draft-js";
import * as classnames from "classnames";
import { CSSProperties } from "react/index";
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

  togglePrp = (data: { [key: string]: CSSProperties }, style: string) => {
    const { editorState, changeEditState } = this.props;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(data).reduce((contentState, type) => {
      return Modifier.removeInlineStyle(contentState, selection, type);
    }, editorState.getCurrentContent());

    let nextEditorState: EditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        if (!state || !color) {
          return EditorState.createEmpty();
        }
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(style)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
    }

    changeEditState(nextEditorState);
  };

  _renderColors() {
    const { togglePrp } = this;

    return (
      <ListStyle
        data={colorStyleMap}
        icon="eyedropper"
        label="颜色设置"
        width={100}
        onToggle={function(style: string) {
          togglePrp(colorStyleMap, style);
        }}
      />
    );
  }
  _renderFamily() {
    const { togglePrp } = this;
    return (
      <ListStyle
        data={fontFamilyStyleMap}
        icon="font"
        label="字体设置"
        width={140}
        onToggle={function(style: string) {
          togglePrp(fontFamilyStyleMap, style);
        }}
      />
    );
  }

  _renderFontSize() {
    const { togglePrp } = this;
    return (
      <ListStyle
        data={fontSizeStyleMap}
        icon="text-height"
        label="字体大小设置"
        width={100}
        onToggle={function(style: string) {
          togglePrp(fontSizeStyleMap, style);
        }}
      />
    );
  }
}

export default ToolBar;
