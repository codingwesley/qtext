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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var draft_js_1 = require("draft-js");
var classnames = require("classnames");
var ListStyle_1 = require("./ListStyle");
var Media_1 = require("./Media");
var const_1 = require("./const");
var styles = require("./scss/ToolBar.scss");
var ToolBtn = (function (_super) {
    __extends(ToolBtn, _super);
    function ToolBtn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onToggle = function (e) {
            e.preventDefault();
            _this.props.onToggle(_this.props.item.isBlock, _this.props.item.style);
        };
        return _this;
    }
    ToolBtn.prototype.render = function () {
        var _a = this.props.item, label = _a.label, icon = _a.icon;
        var disabled = this.props.disabled;
        return (React.createElement("button", { disabled: disabled !== undefined ? disabled : false, onMouseDown: this.onToggle, className: classnames(styles.toolbtn, (_b = {},
                _b[styles.active] = this.props.active,
                _b)) }, icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement("span", null, label)));
        var _b;
    };
    return ToolBtn;
}(React.Component));
var ToolBar = (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.linkStyle = null;
        _this.onToggle = function (isBlock, style) {
            _this.props.onToggle(isBlock, style);
        };
        _this.linkClick = function () {
            var editorState = _this.props.editorState;
            var selection = editorState.getSelection();
            if (!selection.isCollapsed()) {
                var contentState = editorState.getCurrentContent();
                var startKey = editorState.getSelection().getStartKey();
                var startOffset = editorState.getSelection().getStartOffset();
                var blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
                var linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
                if (linkKey) {
                    var linkInstance = contentState.getEntity(linkKey);
                    var _a = linkInstance.getData(), url = _a.url, newTarget = _a.newTarget;
                    if (_this.linkStyle !== null) {
                        // 存在修改链接的情况
                        _this.linkStyle.onChange({
                            showURLValue: url,
                            checked: newTarget
                        });
                    }
                }
            }
        };
        // TODO _removeLink
        _this.linkConfirm = function (name, url, newTarget, style) {
            if (style === void 0) { style = "LINK"; }
            var _a = _this.props, editorState = _a.editorState, changeEditState = _a.changeEditState;
            var contentState = editorState.getCurrentContent();
            var contentStateWithEntity = contentState.createEntity(style, "MUTABLE", {
                url: url,
                name: name,
                newTarget: newTarget
            });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = draft_js_1.EditorState.set(editorState, {
                currentContent: contentStateWithEntity
            });
            changeEditState(draft_js_1.RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
        };
        _this.mediaConfirm = function (style, name, url) {
            var _a = _this.props, editorState = _a.editorState, changeEditState = _a.changeEditState;
            var contentState = editorState.getCurrentContent();
            var contentStateWithEntity = contentState.createEntity(style, "IMMUTABLE", { src: url, name: name });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = draft_js_1.EditorState.set(editorState, {
                currentContent: contentStateWithEntity
            });
            changeEditState(draft_js_1.AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
        };
        _this.togglePrp = function (data, style) {
            var _a = _this.props, editorState = _a.editorState, changeEditState = _a.changeEditState;
            var selection = editorState.getSelection();
            // Let's just allow one color at a time. Turn off all active colors.
            var nextContentState = Object.keys(data).reduce(function (contentState, type) {
                return draft_js_1.Modifier.removeInlineStyle(contentState, selection, type);
            }, editorState.getCurrentContent());
            var nextEditorState = draft_js_1.EditorState.push(editorState, nextContentState, "change-inline-style");
            var currentStyle = editorState.getCurrentInlineStyle();
            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce(function (state, color) {
                    if (!state || !color) {
                        return draft_js_1.EditorState.createEmpty();
                    }
                    return draft_js_1.RichUtils.toggleInlineStyle(state, color);
                }, nextEditorState);
            }
            // If the color is being toggled on, apply it.
            if (!currentStyle.has(style)) {
                nextEditorState = draft_js_1.RichUtils.toggleInlineStyle(nextEditorState, style);
            }
            changeEditState(nextEditorState);
        };
        return _this;
    }
    ToolBar.prototype.render = function () {
        var _this = this;
        var editorState = this.props.editorState;
        return (React.createElement("div", { className: styles.barbox },
            this.modeBtn(),
            this._renderUndoBtn(),
            this._renderRedoBtn(),
            this._renderFamily(),
            this._renderFontSize(),
            this._renderColors(),
            const_1.STYLE_LIST.map(function (item) {
                var currentStyle = editorState.getCurrentInlineStyle();
                var selection = editorState.getSelection();
                var blockType = editorState
                    .getCurrentContent()
                    .getBlockForKey(selection.getStartKey())
                    .getType();
                var active = item.isBlock
                    ? blockType === item.style
                    : currentStyle.has(item.style);
                return (React.createElement(ToolBtn, { key: item.style, item: item, onToggle: _this.onToggle, active: active }));
            }),
            React.createElement(Media_1.Media, { type: Media_1.TMedia.link, icon: "link", ref: function (r) { return (_this.linkStyle = r); }, label: "链接", donotName: true, onClick: this.linkClick, onToggle: function (style, name, value, newTarget) {
                    _this.linkConfirm(name, value, newTarget);
                } }),
            React.createElement(Media_1.Media, { type: Media_1.TMedia.video, icon: "video-camera", label: "视频", onToggle: this.mediaConfirm }),
            React.createElement(Media_1.Media, { type: Media_1.TMedia.audio, icon: "music", label: "音频", onToggle: this.mediaConfirm }),
            React.createElement(Media_1.Media, { type: Media_1.TMedia.image, icon: "picture-o", label: "图片", onToggle: this.mediaConfirm })));
    };
    ToolBar.prototype.modeBtn = function () {
        var _a = this.props, toggleMode = _a.toggleMode, editMode = _a.editMode;
        return (React.createElement(ListStyle_1.ListStyle, { data: {
                desktop: {},
                mobile: {}
            }, icon: editMode, label: "预览窗口调整", width: 100, onToggle: function (mode) {
                toggleMode(mode);
            } }));
    };
    ToolBar.prototype.renderActionBtn = function (label, icon, desc, style, disabled, onToggle, isBlock) {
        if (isBlock === void 0) { isBlock = false; }
        return (React.createElement(ToolBtn, { key: label, item: {
                icon: icon,
                label: label,
                desc: desc,
                isBlock: isBlock,
                style: style
            }, disabled: disabled, active: false, onToggle: onToggle }));
    };
    ToolBar.prototype._renderUndoBtn = function () {
        var _a = this.props, editorState = _a.editorState, changeEditState = _a.changeEditState;
        return this.renderActionBtn("撤销", "undo", "撤销", "undo", editorState.getUndoStack().isEmpty(), function () {
            changeEditState(draft_js_1.EditorState.undo(editorState));
        });
    };
    ToolBar.prototype._renderRedoBtn = function () {
        var _a = this.props, editorState = _a.editorState, changeEditState = _a.changeEditState;
        return this.renderActionBtn("重做", "repeat", "重做", "undo", editorState.getRedoStack().isEmpty(), function () {
            changeEditState(draft_js_1.EditorState.redo(editorState));
        });
    };
    ToolBar.prototype._renderColors = function () {
        var togglePrp = this.togglePrp;
        return (React.createElement(ListStyle_1.ListStyle, { data: const_1.colorStyleMap, icon: "eyedropper", label: "颜色设置", width: 100, onToggle: function (style) {
                togglePrp(const_1.colorStyleMap, style);
            } }));
    };
    ToolBar.prototype._renderFamily = function () {
        var togglePrp = this.togglePrp;
        return (React.createElement(ListStyle_1.ListStyle, { data: const_1.fontFamilyStyleMap, icon: "font", label: "字体设置", width: 160, onToggle: function (style) {
                togglePrp(const_1.fontFamilyStyleMap, style);
            } }));
    };
    ToolBar.prototype._renderFontSize = function () {
        var togglePrp = this.togglePrp;
        return (React.createElement(ListStyle_1.ListStyle, { data: const_1.fontSizeStyleMap, icon: "text-height", label: "字体大小设置", width: 100, onToggle: function (style) {
                togglePrp(const_1.fontSizeStyleMap, style);
            } }));
    };
    return ToolBar;
}(React.PureComponent));
exports.ToolBar = ToolBar;
exports.default = ToolBar;
