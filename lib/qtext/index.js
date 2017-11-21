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
var config_1 = require("./config");
var fg_loadcss_1 = require("fg-loadcss");
require("draft-js/dist/Draft.css");
var ListStyle_1 = require("./ListStyle");
var ToolBar_1 = require("./ToolBar");
var util_1 = require("./util");
var const_1 = require("./const");
var decorator_1 = require("./decorator");
var AtomicBlock_1 = require("./AtomicBlock");
var draft_js_1 = require("draft-js");
var styles = require("./scss/index.scss");
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
var QText = (function (_super) {
    __extends(QText, _super);
    function QText(props) {
        var _this = _super.call(this, props) || this;
        _this.id = 1;
        _this.getBlockRender = function (block) {
            var type = block.getType();
            var editorState = _this.state.editorState;
            if (type === "atomic") {
                return {
                    component: AtomicBlock_1.AtomicBlock,
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
            var data = _this.getEditData().data;
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
            _this.onChange(draft_js_1.RichUtils.toggleBlockType(_this.state.editorState, blockType));
        };
        _this._toggleInlineStyle = function (inlineStyle) {
            _this.onChange(draft_js_1.RichUtils.toggleInlineStyle(_this.state.editorState, inlineStyle));
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
            editorState: draft_js_1.EditorState.createEmpty(decorator_1.decorator),
            readOnly: props.readOnly || false,
            editMode: "desktop"
        };
        return _this;
    }
    QText.prototype.getEditData = function () {
        var editorState = this.state.editorState;
        return { data: draft_js_1.convertToRaw(editorState.getCurrentContent()) };
    };
    QText.prototype.render = function () {
        var _this = this;
        var placeholder = this.props.placeholder;
        var _a = this.state, editorState = _a.editorState, readOnly = _a.readOnly, editMode = _a.editMode;
        var className = classnames(styles.editor, (_b = {},
            _b[styles.desktop] = editMode === "desktop",
            _b[styles.mobile] = !util_1.isMobile() && editMode === "mobile",
            _b));
        return (React.createElement("div", { className: className },
            React.createElement("div", { className: styles.inner },
                React.createElement(ListStyle_1.ListStyle, { className: styles.btnPreview, data: {
                        Preview: {},
                        Edit: {}
                    }, icon: readOnly ? "eye-slash" : "eye", label: "预览效果", width: 80, onToggle: this.toggleEye }),
                readOnly ? null : (React.createElement(ToolBar_1.ToolBar, { editMode: editMode, toggleMode: this.toggleMode, editorState: editorState, changeEditState: this.onChange, onToggle: function (isBlock, style) {
                        if (isBlock) {
                            _this._toggleBlockType(style);
                        }
                        else {
                            _this._toggleInlineStyle(style);
                        }
                    } })),
                React.createElement("div", { className: styles.content },
                    React.createElement(draft_js_1.Editor, { customStyleMap: __assign({}, const_1.colorStyleMap, const_1.fontFamilyStyleMap, const_1.fontSizeStyleMap), blockRendererFn: this.getBlockRender, blockStyleFn: getBlockStyle, placeholder: placeholder, readOnly: readOnly, editorState: editorState, onChange: this.onChange })))));
        var _b;
    };
    QText.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value &&
            draft_js_1.EditorState.createWithContent(draft_js_1.convertFromRaw(nextProps.value)) !==
                this.state.editorState) {
            this.setData(nextProps.value);
        }
    };
    QText.prototype.setData = function (rowData) {
        var contentState = draft_js_1.convertFromRaw(rowData);
        this.onChange(draft_js_1.EditorState.createWithContent(contentState, decorator_1.decorator));
    };
    QText.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, readOnly = _a.readOnly, autoSave = _a.autoSave;
        if (!readOnly) {
            // 编辑模式
            fg_loadcss_1.loadCSS(config_1.fontCssUrl);
            var fn_1 = function () {
                if (_this.id <= 0) {
                    return;
                }
                // 打开编辑器一分钟保存一次数据
                setTimeout(function () {
                    _this.saveData();
                    _this.id += 1;
                    fn_1();
                }, 1000 * 60);
            };
            if (autoSave) {
                fn_1();
            }
            // 取回上次的内容
            var dataStr = localStorage.getItem(LOCALKEY);
            if (!dataStr) {
                return;
            }
            var TIMEBACK_MIN = 20;
            var _b = JSON.parse(dataStr), time = _b.time, editContent = _b.editContent;
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
    QText.prototype.componentWillUnMount = function () {
        this.id = -1;
    };
    QText.defaultProps = {
        readOnly: false,
        autoSave: false,
        placeholder: "Please edit your content..."
    };
    return QText;
}(React.Component));
exports.QText = QText;
exports.default = QText;
