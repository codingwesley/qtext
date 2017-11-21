import * as React from "react";
import { EditorState, Modifier, RichUtils, AtomicBlockUtils } from "draft-js";
import * as classnames from "classnames";
import { CSSProperties } from "react/index";
import { ListStyle } from "./ListStyle";
import { Media, TMedia } from "./Media";
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

class ToolBtn extends React.Component<ToolBtnProps, ToolBtnState> {
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

export type TMode = "desktop" | "mobile";
export interface ToolBarProps {
  editMode: TMode;
  toggleMode: (mode: TMode) => void;
  editorState: EditorState;
  changeEditState: (editorState: EditorState) => void;
  onToggle: (isBlock: boolean, style: string) => void;
}

export interface ToolBarState {}

export class ToolBar extends React.PureComponent<ToolBarProps, ToolBarState> {
  linkStyle: Media | null = null;
  onToggle = (isBlock: boolean, style: string) => {
    this.props.onToggle(isBlock, style);
  };

  public render(): JSX.Element {
    const { editorState } = this.props;
    
    return (
      <div className={styles.barbox}>
        {this.modeBtn()}
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

        <Media
          type={TMedia.link}
          icon="link"
          ref={r => (this.linkStyle = r)}
          label="链接"
          donotName={true}
          onClick={this.linkClick}
          onToggle={(style, name, value, newTarget) => {
            this.linkConfirm(name, value, newTarget);
          }}
        />

        <Media
          type={TMedia.video}
          icon="video-camera"
          label="视频"
          onToggle={this.mediaConfirm}
        />
        <Media
          type={TMedia.audio}
          icon="music"
          label="音频"
          onToggle={this.mediaConfirm}
        />
        <Media
          type={TMedia.image}
          icon="picture-o"
          label="图片"
          onToggle={this.mediaConfirm}
        />
      </div>
    );
  }

  modeBtn() {
    const { toggleMode, editMode } = this.props;

    return (
      <ListStyle
        data={{
          desktop: {},
          mobile: {}
        }}
        icon={editMode}
        label="预览窗口调整"
        width={100}
        onToggle={function(mode: string) {
          toggleMode(mode as TMode);
        }}
      />
    );
  }

  linkClick = () => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        const { url, newTarget } = linkInstance.getData();

        if (this.linkStyle !== null) {
          // 存在修改链接的情况
          this.linkStyle.onChange({
            showURLValue: url,
            checked: newTarget
          });
        }
      }
    }
  };

  // TODO _removeLink
  linkConfirm = (
    name: string,
    url: string,
    newTarget: boolean,
    style = "LINK"
  ) => {
    const { editorState, changeEditState } = this.props;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(style, "MUTABLE", {
      url,
      name,
      newTarget
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    changeEditState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  };

  mediaConfirm = (style: string, name: string, url: string) => {
    const { editorState, changeEditState } = this.props;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      style,
      "IMMUTABLE",
      { src: url, name }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    changeEditState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

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
        width={160}
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
