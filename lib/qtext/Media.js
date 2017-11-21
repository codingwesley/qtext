"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames = require("classnames");
var util_1 = require("./util");
var TMedia;
(function (TMedia) {
    TMedia[TMedia["audio"] = 0] = "audio";
    TMedia[TMedia["video"] = 1] = "video";
    TMedia[TMedia["image"] = 2] = "image";
    TMedia[TMedia["link"] = 3] = "link";
})(TMedia = exports.TMedia || (exports.TMedia = {}));
var stylesPa = require("./scss/ToolBar.scss");
var styles = require("./scss/Media.scss");
var Media = (function (_super) {
    __extends(Media, _super);
    function Media(props) {
        var _this = _super.call(this, props) || this;
        _this.checkbox = null;
        _this.modalShow = function () {
            var flag = !_this.state.showURLInput;
            if (flag && _this.props.onClick) {
                _this.props.onClick();
            }
            _this.setState({
                showURLInput: flag
            });
        };
        _this.onChange = function (obj) {
            if (obj) {
                _this.setState(obj);
            }
        };
        _this.confirmMedia = function () {
            var donotName = _this.props.donotName;
            // check 数据
            if ((donotName ? ["showURLValue"] : ["showURLName", "showURLValue"]).some(function (key) { return !_this.state[key]; })) {
                alert("请把信息补充完整！");
            }
            else {
                var type = _this.props.type;
                _this.props.onToggle(type.toString(), _this.state.showURLName, _this.state.showURLValue, _this.checkbox ? _this.checkbox.checked === true : false);
                // 重置信息
                _this.setState({
                    showURLInput: false,
                    showURLName: "",
                    showURLValue: ""
                });
            }
        };
        _this._onURLInputKeyDown = function (e) {
            if (e.which === 13) {
                _this.confirmMedia();
            }
        };
        _this.state = {
            checked: false,
            showURLInput: false,
            showURLType: TMedia.image,
            showURLName: "",
            showURLValue: ""
        };
        return _this;
    }
    Media.prototype.render = function () {
        var _this = this;
        var onChange = this.onChange;
        var _a = this.props, icon = _a.icon, label = _a.label, donotName = _a.donotName, type = _a.type;
        var isLink = type === TMedia.link;
        return (React.createElement("div", { className: styles.media },
            React.createElement("button", { onClick: this.modalShow, title: label, className: classnames(stylesPa.toolbtn) }, icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement("span", null, label)),
            this.state.showURLInput ? (React.createElement("div", { className: styles.mask },
                React.createElement("div", { className: styles.urlInputContainer },
                    donotName ? null : (React.createElement("input", { onChange: function (e) {
                            onChange({
                                showURLName: e.target.value
                            });
                        }, className: styles.nameInput, type: "text", placeholder: "Input Name", value: this.state.showURLName, onKeyDown: this._onURLInputKeyDown })),
                    isLink ? (React.createElement("span", { className: styles.checkboxInput },
                        React.createElement("input", { type: "checkbox", checked: this.state.checked, onChange: function (e) {
                                onChange({
                                    checked: e.target.checked
                                });
                            }, ref: function (r) { return (_this.checkbox = r); } }),
                        "Open in Window")) : null,
                    React.createElement("input", { onChange: function (e) {
                            onChange({ showURLValue: e.target.value });
                        }, className: styles.urlInput, type: "text", placeholder: "Input URL", value: this.state.showURLValue, onKeyDown: this._onURLInputKeyDown }),
                    React.createElement("p", { className: styles.btnLine },
                        React.createElement("button", { onMouseDown: this.modalShow }, "\u53D6\u6D88"),
                        React.createElement("button", { onMouseDown: this.confirmMedia }, "\u786E\u5B9A"))))) : null));
    };
    return Media;
}(React.Component));
exports.Media = Media;
var Audio = function (props) {
    return React.createElement("audio", { controls: true, src: props.src, className: styles.audio });
};
var Image = function (props) {
    return React.createElement("img", { src: props.src, className: styles.image, alt: props.name });
};
/**
 *
 * support youtube & vimeo video paste
 * https://vimeo.com/59265245
 * https://www.youtube.com/watch?v=832DNu0Oh6Y
 */
var YOUTUBE_PREFIX = "https://www.youtube.com/embed/";
var VIMEO_PREFIX = "https://player.vimeo.com/video/";
var Video = function (props) {
    var testEle = document.createElement("video");
    if (!testEle.canPlayType) {
        return React.createElement("span", null, "\u4F60\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301HTML5 video\u3002");
    }
    var id = util_1.getYoutubeVideoId(props.src);
    var cProps = {
        webkitallowfullscreen: true,
        mozallowfullscreen: true,
        allowfullscreen: true,
        frameBorder: "0",
        className: styles.iframe,
        name: props.name
    };
    var content = null;
    if (id) {
        content = React.createElement("iframe", __assign({ src: "" + YOUTUBE_PREFIX + id }, cProps));
    }
    var vimeoId = util_1.getVimeoId(props.src);
    if (vimeoId) {
        content = React.createElement("iframe", __assign({ src: "" + VIMEO_PREFIX + vimeoId }, cProps));
    }
    return (React.createElement("div", { className: styles.limitSize },
        React.createElement("div", { className: styles.iframeContainer }, content || (React.createElement("video", { controls: true, src: props.src, className: styles.video })))));
};
var MediaView = (function (_super) {
    __extends(MediaView, _super);
    function MediaView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MediaView.prototype.render = function () {
        var _a = this.props, type = _a.type, data = _a.data;
        var src = data.src, name = data.name;
        var media = React.createElement("span", null);
        if (type === TMedia.audio.toString()) {
            media = React.createElement(Audio, { src: src, name: name });
        }
        else if (type === TMedia.image.toString()) {
            media = React.createElement(Image, { src: src, name: name });
        }
        else if (type === TMedia.video.toString()) {
            media = React.createElement(Video, { src: src, name: name });
        }
        return media;
    };
    return MediaView;
}(React.PureComponent));
exports.MediaView = MediaView;
exports.default = Media;
