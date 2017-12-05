import * as React from "react";
import { EditorState, AtomicBlockUtils, RichUtils } from "draft-js";
import * as classnames from "classnames";
import * as contains from "rc-util/lib/Dom/contains";
import Upload from "rc-upload";
import { findDOMNode } from "react-dom";
import { TPluginActionProps } from "./../plugin";
import { TMedia } from "./type";

const styles = require("./index.less");

export interface MediaActionProps extends TPluginActionProps {
  type: TMedia;
  className?: string;
  // https://github.com/fis-components/rc-upload
  rcUploadProps?: any;
  rcSuccess?: (data: any) => string | Promise<string>;
}

export interface MediaActionState {
  showURLInput: boolean;
}

function getPlaceholder(type: TMedia = "IMAGE") {
  switch (type) {
    case "AUDIO":
    case "VIDEO":
      return "Paste media url, and press Enter";
    case "LINK":
      return "Add link address to text";
    case "IMAGE":
    default:
      return "";
  }
}
/**
 * 行为
 * 图片: 选择图片上传 必须配置上传文件服务器参数
 * 视频/音频贴链接就好
 */
export class MediaAction extends React.Component<
  MediaActionProps,
  MediaActionState
> {
  input: HTMLInputElement | null = null;
  inputValue: string = "";
  documentCancelFunc: (e: any) => void = e => {
    const root = findDOMNode(this);
    if (!contains(root, e.target)) {
      this.modalShow(false);
    }
  };

  constructor(props: MediaActionProps) {
    super(props);
    this.state = {
      showURLInput: false
    };
  }

  modalShow = (showURLInput: boolean = !this.state.showURLInput) => {
    this.setState(
      {
        showURLInput
      },
      () => {
        if (this.input) {
          this.input.value = "";
        }
        if (showURLInput) {
          this.initClickEvents();
          this.setData();
        } else {
          document.removeEventListener("click", this.documentCancelFunc);
        }
      }
    );
  };

  initClickEvents() {
    document.addEventListener("click", this.documentCancelFunc);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentCancelFunc);
  }

  onChange = (obj: any) => {
    if (obj) {
      this.setState(obj);
    }
  };

  setData = () => {
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
        const { url } = linkInstance.getData();
        this.setUrl(url);
      }
    }
  };

  confirmMedia = () => {
    let urlValue = this.input ? this.input.value : "";
    urlValue = this.props.type === "IMAGE" ? this.inputValue : urlValue;
    if (!urlValue) {
      return;
    }

    const isLINK = this.props.type === "LINK";
    const { editorState, changeEditorState, type } = this.props;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      "IMMUTABLE",
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    changeEditorState(
      isLINK
        ? RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
          )
        : AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );

    this.modalShow(false);
  };

  _onURLInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      this.confirmMedia();
    }
  };

  setUrl = (url: string) => {
    if (this.input) {
      this.input.value = url;
    }
  };

  renderUpload() {
    const { rcSuccess, rcUploadProps } = this.props;
    const self = this;
    const cb = function(url: string) {
      self.inputValue = url;
      self.confirmMedia();
    };

    const UploadProps = {
      ...rcUploadProps,
      onSuccess(data: any) {
        if (rcUploadProps.onSuccess) {
          rcUploadProps.onSuccess(data);
        }
        if (rcSuccess) {
          const res = rcSuccess(data);

          if (typeof res !== "string") {
            res.then(url => {
              cb(url);
            });
            return;
          } else {
            cb(res);
          }
        }
      }
    };
    return (
      <div className={styles.media}>
        <Upload {...UploadProps}>{this.props.children}</Upload>
      </div>
    );
  }

  public render(): JSX.Element {
    const { type, className } = this.props;
    const isUpload = type === "IMAGE";
    if (isUpload) {
      return this.renderUpload();
    }

    return (
      <div className={classnames(styles.media, className)}>
        <span onClick={() => this.modalShow(true)}>{this.props.children}</span>
        {this.state.showURLInput ? (
          <div className={styles.urlInputContainer}>
            <input
              ref={r => (this.input = r)}
              className={styles.urlInput}
              type="text"
              placeholder={getPlaceholder(type)}
              onKeyDown={this._onURLInputKeyDown}
            />
            <span
              className={styles.close}
              onClick={() => this.modalShow(false)}
            >
              x
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}