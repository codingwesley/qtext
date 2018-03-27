import * as React from "react";
import * as classnames from "classnames";
import { getYoutubeVideoId, getVimeoId } from "./../../util";
import { TPliginViewProps } from "./../plugin";

export interface MediaViewProps extends TPliginViewProps {}
export interface TMediaData {
  url: string;
}

const Audio = (props: TMediaData) => {
  return <audio controls={true} src={props.url} className={"qtext-audio"} />;
};

const Image = (props: TMediaData) => {
  return (
    <div className={"qtext-image"}>
      <img src={props.url} />
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
  const { url } = props;
  const testEle = document.createElement("video");
  if (!testEle.canPlayType) {
    return <span>你的浏览器不支持HTML5 video。</span>;
  }
  const id = getYoutubeVideoId(url);
  const cProps = {
    allowFullScreen: true,
    frameBorder: "0",
    className: "qtext-iframe"
  };

  let content: JSX.Element | null = null;
  if (id) {
    content = <iframe src={`${YOUTUBE_PREFIX}${id}`} {...cProps} />;
  } else {
    const vimeoId = getVimeoId(url);
    if (vimeoId) {
      content = <iframe src={`${VIMEO_PREFIX}${vimeoId}`} {...cProps} />;
    }
  }

  return (
    <div className={"qtext-limitSize"}>
      <div className={"qtext-iframeContainer"}>
        {content || (
          <video controls={true} src={url} className={"qtext-video"} />
        )}
      </div>
    </div>
  );
};

export class MediaView extends React.PureComponent<MediaViewProps, {}> {
  render(): JSX.Element {
    const { type, data, className } = this.props;
    const url = data ? data.url : "";
    let s: JSX.Element | null = null;
    switch (type) {
      case "IMAGE":
        s = <Image url={url} />;
        break;
      case "VIDEO":
        s = <Video url={url} />;
        break;
      case "AUDIO":
        s = <Audio url={url} />;
        break;
      default:
        s = <span />;
        break;
    }

    return <div className={classnames(className)}>{s}</div>;
  }
}
