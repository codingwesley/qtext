function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as React from "react";
import { findDOMNode } from "react-dom";
import { default as contains } from "rc-util/es/Dom/contains";
import * as classnames from "classnames";
var styles = require("./scss/ToolBar.less");
export var ListStyle = function (_React$Component) {
    _inherits(ListStyle, _React$Component);

    function ListStyle(props) {
        _classCallCheck(this, ListStyle);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.documentCancelFunc = function (e) {
            var root = findDOMNode(_this);
            if (!contains(root, e.target)) {
                _this.setState({
                    visible: false
                });
            }
        };
        _this.onToggle = function (style) {
            _this.props.onToggle(style);
        };
        _this.modalShow = function () {
            var flag = !_this.state.visible;
            _this.setState({
                visible: flag
            }, function () {
                if (flag) {
                    _this.initClickEvents();
                } else {
                    document.removeEventListener("click", _this.documentCancelFunc);
                }
            });
        };
        _this.state = {
            value: "",
            visible: false
        };
        return _this;
    }

    ListStyle.prototype.initClickEvents = function initClickEvents() {
        document.addEventListener("click", this.documentCancelFunc);
    };

    ListStyle.prototype.componentWillUnmount = function componentWillUnmount() {
        document.removeEventListener("click", this.documentCancelFunc);
    };

    ListStyle.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.value && this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    };

    ListStyle.prototype.render = function render() {
        var _classnames,
            _this2 = this;

        var _props = this.props,
            icon = _props.icon,
            label = _props.label,
            width = _props.width,
            data = _props.data,
            className = _props.className;

        return React.createElement(
            "div",
            { className: classnames(styles.listBox, (_classnames = {}, _classnames[String(className)] = className !== undefined, _classnames)) },
            React.createElement(
                "button",
                { onClick: this.modalShow, title: label, className: classnames(styles.toolbtn) },
                icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement(
                    "span",
                    null,
                    label
                )
            ),
            !this.state.visible ? null : React.createElement(
                "div",
                { style: {
                        width: width
                    }, className: classnames(styles.listModal, styles.activeList) },
                Object.keys(data).map(function (prp) {
                    var style = data[prp];
                    return React.createElement(
                        "div",
                        { key: prp, onClick: function onClick() {
                                _this2.onToggle(prp);
                                _this2.modalShow();
                            }, style: style, className: styles.item },
                        prp
                    );
                })
            )
        );
    };

    return ListStyle;
}(React.Component);
export default ListStyle;