var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as React from "react";
import * as classnames from "classnames";
import { fontCssUrl } from "./config";
import { loadCSS } from "fg-loadcss";
import "draft-js/dist/Draft.css";
import { ListStyle } from "./ListStyle";
import { ToolBar } from "./ToolBar";
import { isMobile } from "./util";
import { colorStyleMap, fontFamilyStyleMap, fontSizeStyleMap } from "./const";
import { decorator } from "./decorator";
import { AtomicBlock } from "./AtomicBlock";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
var styles = require("./scss/index.less");
function getBlockStyle(block) {
    var type = block.getType();
    switch (type) {
        case "blockquote":
            return styles.blockquote;
        case "center":
        case "right":
            return styles[type];
        default:
            return "";
    }
}
var LOCALKEY = "LASTEST_VERSION";
// https://www.froala.com/wysiwyg-editor
export var QText = function (_React$Component) {
    _inherits(QText, _React$Component);

    function QText(props) {
        _classCallCheck(this, QText);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.id = 1;
        _this.getBlockRender = function (block) {
            var type = block.getType();
            var editorState = _this.state.editorState;

            if (type === "atomic") {
                return {
                    component: AtomicBlock,
                    editable: false,
                    props: {
                        editorState: editorState
                    }
                };
            }
            return null;
        };
        _this.onChange = function (editorState) {
            _this.setState({ editorState: editorState }, function () {
                if (_this.props.onChange) {
                    _this.props.onChange(editorState);
                }
            });
        };
        _this.saveData = function () {
            var _this$getEditData = _this.getEditData(),
                data = _this$getEditData.data;

            if (!_this.state.editorState.getCurrentContent().hasText()) {
                // 没有内容是不保存的
                return;
            }
            localStorage.setItem(LOCALKEY, JSON.stringify({
                time: new Date().getTime(),
                editContent: data
            }));
        };
        _this._toggleBlockType = function (blockType) {
            _this.onChange(RichUtils.toggleBlockType(_this.state.editorState, blockType));
        };
        _this._toggleInlineStyle = function (inlineStyle) {
            _this.onChange(RichUtils.toggleInlineStyle(_this.state.editorState, inlineStyle));
        };
        _this.toggleMode = function (mode) {
            _this.setState({
                editMode: mode
            });
        };
        _this.toggleEye = function (mode) {
            _this.setState({
                readOnly: mode === "Preview"
            });
        };
        _this.state = {
            editorState: EditorState.createEmpty(decorator),
            readOnly: props.readOnly || false,
            editMode: "desktop"
        };
        return _this;
    }

    QText.prototype.getEditData = function getEditData() {
        var editorState = this.state.editorState;

        return { data: convertToRaw(editorState.getCurrentContent()) };
    };

    QText.prototype.render = function render() {
        var _classnames,
            _this2 = this;

        var placeholder = this.props.placeholder;
        var _state = this.state,
            editorState = _state.editorState,
            readOnly = _state.readOnly,
            editMode = _state.editMode;

        var className = classnames(styles.editor, (_classnames = {}, _classnames[styles.desktop] = editMode === "desktop", _classnames[styles.mobile] = !isMobile() && editMode === "mobile", _classnames));
        return React.createElement(
            "div",
            { className: className },
            React.createElement(
                "div",
                { className: styles.inner },
                React.createElement(ListStyle, { className: styles.btnPreview, data: {
                        Preview: {},
                        Edit: {}
                    }, icon: readOnly ? "eye-slash" : "eye", label: "\u9884\u89C8\u6548\u679C", width: 80, onToggle: this.toggleEye }),
                readOnly ? null : React.createElement(ToolBar, { editMode: editMode, toggleMode: this.toggleMode, editorState: editorState, changeEditState: this.onChange, onToggle: function onToggle(isBlock, style) {
                        if (isBlock) {
                            _this2._toggleBlockType(style);
                        } else {
                            _this2._toggleInlineStyle(style);
                        }
                    } }),
                React.createElement(
                    "div",
                    { className: styles.content },
                    React.createElement(Editor, { customStyleMap: _extends({}, colorStyleMap, fontFamilyStyleMap, fontSizeStyleMap), blockRendererFn: this.getBlockRender, blockStyleFn: getBlockStyle, placeholder: placeholder, readOnly: readOnly, editorState: editorState, onChange: this.onChange })
                )
            )
        );
    };

    QText.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.value && EditorState.createWithContent(convertFromRaw(nextProps.value)) !== this.state.editorState) {
            this.setData(nextProps.value);
        }
    };

    QText.prototype.setData = function setData(rowData) {
        var contentState = convertFromRaw(rowData);
        this.onChange(EditorState.createWithContent(contentState, decorator));
    };

    QText.prototype.componentDidMount = function componentDidMount() {
        var _this3 = this;

        var _props = this.props,
            readOnly = _props.readOnly,
            autoSave = _props.autoSave;

        if (!readOnly) {
            // 编辑模式
            loadCSS(fontCssUrl);
            var fn = function fn() {
                if (_this3.id <= 0) {
                    return;
                }
                // 打开编辑器一分钟保存一次数据
                setTimeout(function () {
                    _this3.saveData();
                    _this3.id += 1;
                    fn();
                }, 1000 * 60);
            };
            if (autoSave) {
                fn();
            }
            // 取回上次的内容
            var dataStr = localStorage.getItem(LOCALKEY);
            if (!dataStr) {
                return;
            }
            var TIMEBACK_MIN = 20;

            var _JSON$parse = JSON.parse(dataStr),
                time = _JSON$parse.time,
                editContent = _JSON$parse.editContent;

            var t = new Date(time);
            if (new Date().getTime() - t.getTime() > TIMEBACK_MIN * 60 * 1000) {
                // 超过时间就不回来
                return;
            }
            t.toLocaleTimeString();
            var result = confirm("\u9700\u8981\u7EE7\u7EED\u7F16\u8F91\u521A\u521A[<" + TIMEBACK_MIN + "min]\u6D4F\u89C8\u5668\u4FDD\u5B58\u7684\u6570\u636E\u5417? \u4FDD\u5B58\u65F6\u95F4: " + t.toString());
            if (result) {
                this.setData(editContent);
            }
        }
    };

    QText.prototype.componentWillUnMount = function componentWillUnMount() {
        this.id = -1;
    };

    return QText;
}(React.Component);
QText.defaultProps = {
    readOnly: false,
    autoSave: false,
    placeholder: "Please edit your content..."
};
export default QText;