import * as React from "react";
import { EditorState, Modifier, RichUtils, AtomicBlockUtils } from "draft-js";
import * as classnames from "classnames";
import { OrderedSet } from "immutable";
import { CSSProperties } from "react/index";
import { ListStyle, TItem } from "./components/ListStyle";
import { Media, TMedia } from "./Media";
import { ToggleIcon } from "./components/ToggleIcon";
import {
  STYLE_LIST,
  TStyleItem,
  titles,
  fontFamilyStyleMap,
  fontSizeStyleMap,
  colorStyleMap,
  bgColors
} from "./const";

const styles = require("./less/ToolBar.less");

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
  className?: string;
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

  hasInlineStyle(style: string) {
    return this.findInlineStyle().has(style);
  }

  findInlineStyle(): OrderedSet<string> {
    const { editorState } = this.props;
    const currentStyle = editorState.getCurrentInlineStyle();

    return currentStyle;
  }

  hasBlockStyle(style: string): boolean {
    return this.findBlockStyle() === style;
  }

  findBlockStyle(): string {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return blockType;
  }

  public render(): JSX.Element {
    const { className } = this.props;

    return (
      <div className={classnames(styles.barbox, className)}>
        {this.modeBtn()}
        {this._renderUndoBtn()}
        {this._renderRedoBtn()}
        {this._renderFamily()}
        {this._renderFontSize()}
        {this._renderColors("color")}
        {this._renderColors("bgcolor")}

        {STYLE_LIST.map(item => {
          const active = item.isBlock
            ? this.hasBlockStyle(item.style)
            : this.hasInlineStyle(item.style);

          return (
            <ToolBtn
              key={item.style}
              item={item}
              onToggle={this.onToggle}
              active={active}
            />
          );
        })}

        {this._renderTitles()}

        <Media
          type={TMedia.link}
          icon="link"
          ref={r => (this.linkStyle = r)}
          label="链接"
          donotName={true}
          onClick={this.linkClick}
          onToggle={(style, name, value, newTarget) => {
            this.linkConfirm(
              name,
              value,
              newTarget,
              style === TMedia.link.toString() ? "LINK" : style
            );
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
      <ToggleIcon
        value={editMode}
        icons={[
          {
            icon: "desktop",
            value: "desktop"
          },
          {
            icon: "mobile",
            value: "mobile"
          }
        ]}
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

  _renderTitles() {
    const { onToggle } = this;
    const data: TItem[] = [
      { label: "none", style: "unstyle", desc: "Normal", isBlock: true }
    ]
      .concat(titles)
      .map(ele => {
        const { label, desc, style } = ele;
        return {
          value: style,
          label,
          desc
        };
      });
    const valueItem = data.find(ele => this.hasBlockStyle(ele.value));

    return (
      <ListStyle
        data={data}
        width={120}
        value={valueItem ? valueItem.value : "unstyle"}
        onToggle={function(style: string) {
          onToggle(true, style);
        }}
        renderItem={function(item: TItem) {
          return <span>{item.desc}</span>;
        }}
      />
    );
  }

  _renderColors(type: string) {
    const { togglePrp } = this;
    const isColor = type === "color";
    const sdata = isColor ? colorStyleMap : bgColors;
    const data: TItem[] = Object.keys(sdata).map(value => {
      const style = sdata[value];
      const r: TItem = {
        value,
        label: isColor ? style.color : style.backgroundColor,
        style
      };

      return r;
    });
    const valueItem = data.find(ele => this.hasInlineStyle(ele.value));

    return (
      <ListStyle
        isColor={true}
        data={data}
        width={120}
        value={valueItem ? valueItem.value : isColor ? "black" : "white"}
        onToggle={function(style: string) {
          togglePrp(sdata, style);
        }}
        renderItem={function(item: TItem, isHead: boolean) {
          if (isHead === true) {
            return (
              <span
                style={
                  valueItem &&
                  Object.assign({}, valueItem.style, {
                    width: 30,
                    height: 30,
                    display: "inline-block"
                  })
                }
              >
                <i className={`fa fa-${isColor ? "font" : "paint-brush"}`} />
              </span>
            );
          }

          return (
            <span
              key={item.value}
              style={{
                backgroundColor: item.label
              }}
            />
          );
        }}
      />
    );
  }
  _renderFamily() {
    const { togglePrp } = this;
    const data: TItem[] = Object.keys(fontFamilyStyleMap).map(value => {
      const style = fontFamilyStyleMap[value];
      return {
        value,
        label: value,
        style
      };
    });
    const valueItem = data.find(ele => this.hasInlineStyle(ele.value));

    return (
      <ListStyle
        data={data}
        width={160}
        value={valueItem ? valueItem.value : "Roboto-Regular"}
        onToggle={function(style: string) {
          togglePrp(fontFamilyStyleMap, style);
        }}
        renderItem={function(item: TItem) {
          return <span style={item.style}>{item.value}</span>;
        }}
      />
    );
  }

  _renderFontSize() {
    const { togglePrp } = this;
    const data: TItem[] = Object.keys(fontSizeStyleMap).map(value => {
      const style = fontSizeStyleMap[value];
      return {
        value,
        label: value,
        style
      };
    });
    const valueItem = data.find(ele => this.hasInlineStyle(ele.value));

    return (
      <ListStyle
        data={data}
        width={40}
        value={valueItem ? valueItem.value : "14"}
        onToggle={function(style: string) {
          togglePrp(fontSizeStyleMap, style);
        }}
        renderItem={function(item: TItem) {
          return <span>{item.value}</span>;
        }}
      />
    );
  }
}

export default ToolBar;
