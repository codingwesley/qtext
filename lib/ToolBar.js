"use strict";

exports.__esModule = true;
exports.ToolBar = undefined;

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _draftJs = require("draft-js");

var _classnames2 = require("classnames");

var classnames = _interopRequireWildcard(_classnames2);

var _ListStyle = require("./ListStyle");

var _Media = require("./Media");

var _const = require("./const");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = require("./scss/ToolBar.less");

var ToolBtn = function (_React$Component) {
    _inherits(ToolBtn, _React$Component);

    function ToolBtn() {
        _classCallCheck(this, ToolBtn);

        var _this = _possibleConstructorReturn(this, _React$Component.apply(this, arguments));

        _this.onToggle = function (e) {
            e.preventDefault();
            _this.props.onToggle(_this.props.item.isBlock, _this.props.item.style);
        };
        return _this;
    }

    ToolBtn.prototype.render = function render() {
        var _classnames;

        var _props$item = this.props.item,
            label = _props$item.label,
            icon = _props$item.icon;
        var disabled = this.props.disabled;

        return React.createElement(
            "button",
            { disabled: disabled !== undefined ? disabled : false, onMouseDown: this.onToggle, className: classnames(styles.toolbtn, (_classnames = {}, _classnames[styles.active] = this.props.active, _classnames)) },
            icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement(
                "span",
                null,
                label
            )
        );
    };

    return ToolBtn;
}(React.Component);

var ToolBar = exports.ToolBar = function (_React$PureComponent) {
    _inherits(ToolBar, _React$PureComponent);

    function ToolBar() {
        _classCallCheck(this, ToolBar);

        var _this2 = _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));

        _this2.linkStyle = null;
        _this2.onToggle = function (isBlock, style) {
            _this2.props.onToggle(isBlock, style);
        };
        _this2.linkClick = function () {
            var editorState = _this2.props.editorState;

            var selection = editorState.getSelection();
            if (!selection.isCollapsed()) {
                var contentState = editorState.getCurrentContent();
                var startKey = editorState.getSelection().getStartKey();
                var startOffset = editorState.getSelection().getStartOffset();
                var blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
                var linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
                if (linkKey) {
                    var linkInstance = contentState.getEntity(linkKey);

                    var _linkInstance$getData = linkInstance.getData(),
                        url = _linkInstance$getData.url,
                        newTarget = _linkInstance$getData.newTarget;

                    if (_this2.linkStyle !== null) {
                        // 存在修改链接的情况
                        _this2.linkStyle.onChange({
                            showURLValue: url,
                            checked: newTarget
                        });
                    }
                }
            }
        };
        // TODO _removeLink
        _this2.linkConfirm = function (name, url, newTarget) {
            var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "LINK";
            var _this2$props = _this2.props,
                editorState = _this2$props.editorState,
                changeEditState = _this2$props.changeEditState;

            var contentState = editorState.getCurrentContent();
            var contentStateWithEntity = contentState.createEntity(style, "MUTABLE", {
                url: url,
                name: name,
                newTarget: newTarget
            });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = _draftJs.EditorState.set(editorState, {
                currentContent: contentStateWithEntity
            });
            changeEditState(_draftJs.RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
        };
        _this2.mediaConfirm = function (style, name, url) {
            var _this2$props2 = _this2.props,
                editorState = _this2$props2.editorState,
                changeEditState = _this2$props2.changeEditState;

            var contentState = editorState.getCurrentContent();
            var contentStateWithEntity = contentState.createEntity(style, "IMMUTABLE", { src: url, name: name });
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = _draftJs.EditorState.set(editorState, {
                currentContent: contentStateWithEntity
            });
            changeEditState(_draftJs.AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
        };
        _this2.togglePrp = function (data, style) {
            var _this2$props3 = _this2.props,
                editorState = _this2$props3.editorState,
                changeEditState = _this2$props3.changeEditState;

            var selection = editorState.getSelection();
            // Let's just allow one color at a time. Turn off all active colors.
            var nextContentState = Object.keys(data).reduce(function (contentState, type) {
                return _draftJs.Modifier.removeInlineStyle(contentState, selection, type);
            }, editorState.getCurrentContent());
            var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, "change-inline-style");
            var currentStyle = editorState.getCurrentInlineStyle();
            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce(function (state, color) {
                    if (!state || !color) {
                        return _draftJs.EditorState.createEmpty();
                    }
                    return _draftJs.RichUtils.toggleInlineStyle(state, color);
                }, nextEditorState);
            }
            // If the color is being toggled on, apply it.
            if (!currentStyle.has(style)) {
                nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, style);
            }
            changeEditState(nextEditorState);
        };
        return _this2;
    }

    ToolBar.prototype.render = function render() {
        var _this3 = this;

        var editorState = this.props.editorState;

        return React.createElement(
            "div",
            { className: styles.barbox },
            this.modeBtn(),
            this._renderUndoBtn(),
            this._renderRedoBtn(),
            this._renderFamily(),
            this._renderFontSize(),
            this._renderColors(),
            _const.STYLE_LIST.map(function (item) {
                var currentStyle = editorState.getCurrentInlineStyle();
                var selection = editorState.getSelection();
                var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
                var active = item.isBlock ? blockType === item.style : currentStyle.has(item.style);
                return React.createElement(ToolBtn, { key: item.style, item: item, onToggle: _this3.onToggle, active: active });
            }),
            React.createElement(_Media.Media, { type: _Media.TMedia.link, icon: "link", ref: function ref(r) {
                    return _this3.linkStyle = r;
                }, label: "\u94FE\u63A5", donotName: true, onClick: this.linkClick, onToggle: function onToggle(style, name, value, newTarget) {
                    _this3.linkConfirm(name, value, newTarget, style);
                } }),
            React.createElement(_Media.Media, { type: _Media.TMedia.video, icon: "video-camera", label: "\u89C6\u9891", onToggle: this.mediaConfirm }),
            React.createElement(_Media.Media, { type: _Media.TMedia.audio, icon: "music", label: "\u97F3\u9891", onToggle: this.mediaConfirm }),
            React.createElement(_Media.Media, { type: _Media.TMedia.image, icon: "picture-o", label: "\u56FE\u7247", onToggle: this.mediaConfirm })
        );
    };

    ToolBar.prototype.modeBtn = function modeBtn() {
        var _props = this.props,
            toggleMode = _props.toggleMode,
            editMode = _props.editMode;

        return React.createElement(_ListStyle.ListStyle, { data: {
                desktop: {},
                mobile: {}
            }, icon: editMode, label: "\u9884\u89C8\u7A97\u53E3\u8C03\u6574", width: 100, onToggle: function onToggle(mode) {
                toggleMode(mode);
            } });
    };

    ToolBar.prototype.renderActionBtn = function renderActionBtn(label, icon, desc, style, disabled, onToggle) {
        var isBlock = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

        return React.createElement(ToolBtn, { key: label, item: {
                icon: icon,
                label: label,
                desc: desc,
                isBlock: isBlock,
                style: style
            }, disabled: disabled, active: false, onToggle: onToggle });
    };

    ToolBar.prototype._renderUndoBtn = function _renderUndoBtn() {
        var _props2 = this.props,
            editorState = _props2.editorState,
            changeEditState = _props2.changeEditState;

        return this.renderActionBtn("撤销", "undo", "撤销", "undo", editorState.getUndoStack().isEmpty(), function () {
            changeEditState(_draftJs.EditorState.undo(editorState));
        });
    };

    ToolBar.prototype._renderRedoBtn = function _renderRedoBtn() {
        var _props3 = this.props,
            editorState = _props3.editorState,
            changeEditState = _props3.changeEditState;

        return this.renderActionBtn("重做", "repeat", "重做", "undo", editorState.getRedoStack().isEmpty(), function () {
            changeEditState(_draftJs.EditorState.redo(editorState));
        });
    };

    ToolBar.prototype._renderColors = function _renderColors() {
        var togglePrp = this.togglePrp;

        return React.createElement(_ListStyle.ListStyle, { data: _const.colorStyleMap, icon: "eyedropper", label: "\u989C\u8272\u8BBE\u7F6E", width: 100, onToggle: function onToggle(style) {
                togglePrp(_const.colorStyleMap, style);
            } });
    };

    ToolBar.prototype._renderFamily = function _renderFamily() {
        var togglePrp = this.togglePrp;

        return React.createElement(_ListStyle.ListStyle, { data: _const.fontFamilyStyleMap, icon: "font", label: "\u5B57\u4F53\u8BBE\u7F6E", width: 160, onToggle: function onToggle(style) {
                togglePrp(_const.fontFamilyStyleMap, style);
            } });
    };

    ToolBar.prototype._renderFontSize = function _renderFontSize() {
        var togglePrp = this.togglePrp;

        return React.createElement(_ListStyle.ListStyle, { data: _const.fontSizeStyleMap, icon: "text-height", label: "\u5B57\u4F53\u5927\u5C0F\u8BBE\u7F6E", width: 100, onToggle: function onToggle(style) {
                togglePrp(_const.fontSizeStyleMap, style);
            } });
    };

    return ToolBar;
}(React.PureComponent);

exports["default"] = ToolBar;