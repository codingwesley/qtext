import * as React from "react";
import * as classnames from "classnames";
import { getYoutubeVideoId, getVimeoId } from "./util";

export enum TMedia {
  audio,
  video,
  image,
  link
}

export interface MediaProps {
  icon: string;
  label: string;
  value?: string;
  type: TMedia;
  donotName?: boolean;
  onClick?: () => void;
  onToggle: (
    style: string,
    name: string,
    value: string,
    check: boolean
  ) => void;
}

export interface MediaState {
  showURLInput: boolean;
  showURLType: TMedia;
  showURLName: string;
  showURLValue: string;
  checked: boolean;
}

const stylesPa = require("./less/ToolBar.less");
const styles = require("./less/Media.less");

export class Media extends React.Component<MediaProps, MediaState> {
  checkbox: HTMLInputElement | null = null;
  constructor(props: MediaProps) {
    super(props);
    this.state = {
      checked: false,
      showURLInput: false,
      showURLType: TMedia.image,
      showURLName: "",
      showURLValue: ""
    };
  }

  modalShow = () => {
    const flag = !this.state.showURLInput;
    if (flag && this.props.onClick) {
      this.props.onClick();
    }
    this.setState({
      showURLInput: flag
    });
  };

  onChange = (obj: any) => {
    if (obj) {
      this.setState(obj);
    }
  };

  confirmMedia = () => {
    const { donotName } = this.props;
    // check 数据
    if (
      (donotName ? ["showURLValue"] : ["showURLName", "showURLValue"]).some(
        key => !this.state[key]
      )
    ) {
      alert("请把信息补充完整！");
    } else {
      const { type } = this.props;
      this.props.onToggle(
        type.toString(),
        this.state.showURLName,
        this.state.showURLValue,
        this.checkbox ? this.checkbox.checked === true : false
      );

      // 重置信息
      this.setState({
        showURLInput: false,
        showURLName: "",
        showURLValue: ""
      });
    }
  };

  _onURLInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      this.confirmMedia();
    }
  };

  public render(): JSX.Element {
    const { onChange } = this;
    const { icon, label, donotName, type } = this.props;
    const isLink = type === TMedia.link;

    return (
      <div className={styles.media}>
        <button
          onClick={this.modalShow}
          title={label}
          className={classnames(stylesPa.toolbtn)}
        >
          {icon ? <i className={`fa fa-${icon}`} /> : <span>{label}</span>}
        </button>

        {this.state.showURLInput ? (
          <div className={styles.mask}>
            <div className={styles.urlInputContainer}>
              {donotName ? null : (
                <input
                  onChange={function(e: React.ChangeEvent<HTMLInputElement>) {
                    onChange({
                      showURLName: e.target.value
                    });
                  }}
                  className={styles.nameInput}
                  type="text"
                  placeholder="Input Name"
                  value={this.state.showURLName}
                  onKeyDown={this._onURLInputKeyDown}
                />
              )}
              {isLink ? (
                <span className={styles.checkboxInput}>
                  <input
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={e => {
                      onChange({
                        checked: e.target.checked
                      });
                    }}
                    ref={r => (this.checkbox = r)}
                  />
                  Open in Window
                </span>
              ) : null}
              <input
                onChange={function(e: React.ChangeEvent<HTMLInputElement>) {
                  onChange({ showURLValue: e.target.value });
                }}
                className={styles.urlInput}
                type="text"
                placeholder="Input URL"
                value={this.state.showURLValue}
                onKeyDown={this._onURLInputKeyDown}
              />
              <p className={styles.btnLine}>
                <button onMouseDown={this.modalShow}>取消</button>
                <button onMouseDown={this.confirmMedia}>确定</button>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export interface MediaViewProps {
  type: string;
  data: TMediaData;
}

export interface MediaViewState {}

export interface TMediaData {
  name: string;
  src: string;
}

const Audio = (props: TMediaData) => {
  return <audio controls={true} src={props.src} className={styles.audio} />;
};

const Image = (props: TMediaData) => {
  return (
    <div className={styles.image}>
      <img src={props.src} alt={props.name} />
    </div>
  );
};

/**
 *
 * support youtube & vimeo video paste
 * https://vimeo.com/59265245
 * https://www.youtube.com/watch?v=832DNu0Oh6Y
 */
const YOUTUBE_PREFIX = "https://www.youtube.com/embed/";
const VIMEO_PREFIX = "https://player.vimeo.com/video/";
const Video = (props: TMediaData) => {
  const testEle = document.createElement("video");
  if (!testEle.canPlayType) {
    return <span>你的浏览器不支持HTML5 video。</span>;
  }
  const id = getYoutubeVideoId(props.src);
  const cProps = {
    allowFullScreen: true,
    frameBorder: "0",
    className: styles.iframe,
    name: props.name
  };

  let content: JSX.Element | null = null;
  if (id) {
    content = <iframe src={`${YOUTUBE_PREFIX}${id}`} {...cProps} />;
  }
  const vimeoId = getVimeoId(props.src);
  if (vimeoId) {
    content = <iframe src={`${VIMEO_PREFIX}${vimeoId}`} {...cProps} />;
  }
  return (
    <div className={styles.limitSize}>
      <div className={styles.iframeContainer}>
        {content || (
          <video controls={true} src={props.src} className={styles.video} />
        )}
      </div>
    </div>
  );
};

export class MediaView extends React.PureComponent<
  MediaViewProps,
  MediaViewState
> {
  render(): JSX.Element {
    const { type, data } = this.props;
    const { src, name } = data;
    let media = <span />;
    if (type === TMedia.audio.toString()) {
      media = <Audio src={src} name={name} />;
    } else if (type === TMedia.image.toString()) {
      media = <Image src={src} name={name} />;
    } else if (type === TMedia.video.toString()) {
      media = <Video src={src} name={name} />;
    }

    return media;
  }
}

export default Media;
