"use strict";

exports.__esModule = true;
exports.MediaView = exports.Media = exports.TMedia = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _classnames = require("classnames");

var classnames = _interopRequireWildcard(_classnames);

var _util = require("./util");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TMedia = exports.TMedia = undefined;
(function (TMedia) {
    TMedia[TMedia["audio"] = 0] = "audio";
    TMedia[TMedia["video"] = 1] = "video";
    TMedia[TMedia["image"] = 2] = "image";
    TMedia[TMedia["link"] = 3] = "link";
})(TMedia || (exports.TMedia = TMedia = {}));
var stylesPa = require("./scss/ToolBar.less");
var styles = require("./scss/Media.less");

var Media = exports.Media = function (_React$Component) {
    _inherits(Media, _React$Component);

    function Media(props) {
        _classCallCheck(this, Media);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

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

            if ((donotName ? ["showURLValue"] : ["showURLName", "showURLValue"]).some(function (key) {
                return !_this.state[key];
            })) {
                alert("请把信息补充完整！");
            } else {
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

    Media.prototype.render = function render() {
        var _this2 = this;

        var _onChange = this.onChange;
        var _props = this.props,
            icon = _props.icon,
            label = _props.label,
            donotName = _props.donotName,
            type = _props.type;

        var isLink = type === TMedia.link;
        return React.createElement(
            "div",
            { className: styles.media },
            React.createElement(
                "button",
                { onClick: this.modalShow, title: label, className: classnames(stylesPa.toolbtn) },
                icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement(
                    "span",
                    null,
                    label
                )
            ),
            this.state.showURLInput ? React.createElement(
                "div",
                { className: styles.mask },
                React.createElement(
                    "div",
                    { className: styles.urlInputContainer },
                    donotName ? null : React.createElement("input", { onChange: function onChange(e) {
                            _onChange({
                                showURLName: e.target.value
                            });
                        }, className: styles.nameInput, type: "text", placeholder: "Input Name", value: this.state.showURLName, onKeyDown: this._onURLInputKeyDown }),
                    isLink ? React.createElement(
                        "span",
                        { className: styles.checkboxInput },
                        React.createElement("input", { type: "checkbox", checked: this.state.checked, onChange: function onChange(e) {
                                _onChange({
                                    checked: e.target.checked
                                });
                            }, ref: function ref(r) {
                                return _this2.checkbox = r;
                            } }),
                        "Open in Window"
                    ) : null,
                    React.createElement("input", { onChange: function onChange(e) {
                            _onChange({ showURLValue: e.target.value });
                        }, className: styles.urlInput, type: "text", placeholder: "Input URL", value: this.state.showURLValue, onKeyDown: this._onURLInputKeyDown }),
                    React.createElement(
                        "p",
                        { className: styles.btnLine },
                        React.createElement(
                            "button",
                            { onMouseDown: this.modalShow },
                            "\u53D6\u6D88"
                        ),
                        React.createElement(
                            "button",
                            { onMouseDown: this.confirmMedia },
                            "\u786E\u5B9A"
                        )
                    )
                )
            ) : null
        );
    };

    return Media;
}(React.Component);

var Audio = function Audio(props) {
    return React.createElement("audio", { controls: true, src: props.src, className: styles.audio });
};
var Image = function Image(props) {
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
var Video = function Video(props) {
    var testEle = document.createElement("video");
    if (!testEle.canPlayType) {
        return React.createElement(
            "span",
            null,
            "\u4F60\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301HTML5 video\u3002"
        );
    }
    var id = (0, _util.getYoutubeVideoId)(props.src);
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
        content = React.createElement("iframe", _extends({ src: "" + YOUTUBE_PREFIX + id }, cProps));
    }
    var vimeoId = (0, _util.getVimeoId)(props.src);
    if (vimeoId) {
        content = React.createElement("iframe", _extends({ src: "" + VIMEO_PREFIX + vimeoId }, cProps));
    }
    return React.createElement(
        "div",
        { className: styles.limitSize },
        React.createElement(
            "div",
            { className: styles.iframeContainer },
            content || React.createElement("video", { controls: true, src: props.src, className: styles.video })
        )
    );
};

var MediaView = exports.MediaView = function (_React$PureComponent) {
    _inherits(MediaView, _React$PureComponent);

    function MediaView() {
        _classCallCheck(this, MediaView);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    MediaView.prototype.render = function render() {
        var _props2 = this.props,
            type = _props2.type,
            data = _props2.data;
        var src = data.src,
            name = data.name;

        var media = React.createElement("span", null);
        if (type === TMedia.audio.toString()) {
            media = React.createElement(Audio, { src: src, name: name });
        } else if (type === TMedia.image.toString()) {
            media = React.createElement(Image, { src: src, name: name });
        } else if (type === TMedia.video.toString()) {
            media = React.createElement(Video, { src: src, name: name });
        }
        return media;
    };

    return MediaView;
}(React.PureComponent);

exports["default"] = Media;