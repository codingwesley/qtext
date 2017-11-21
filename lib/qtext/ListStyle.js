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
var react_dom_1 = require("react-dom");
var contains_1 = require("rc-util/lib/Dom/contains");
var classnames = require("classnames");
var styles = require("./scss/ToolBar.scss");
var ListStyle = (function (_super) {
    __extends(ListStyle, _super);
    function ListStyle(props) {
        var _this = _super.call(this, props) || this;
        _this.documentCancelFunc = function (e) {
            var root = react_dom_1.findDOMNode(_this);
            if (!contains_1.default(root, e.target)) {
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
            });
        };
        _this.state = {
            value: "",
            visible: false
        };
        return _this;
    }
    ListStyle.prototype.initClickEvents = function () {
        document.addEventListener("click", this.documentCancelFunc);
    };
    ListStyle.prototype.componentWillUnmount = function () {
        document.removeEventListener("click", this.documentCancelFunc);
    };
    ListStyle.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value && this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    };
    ListStyle.prototype.componentDidMount = function () {
        this.initClickEvents();
    };
    ListStyle.prototype.render = function () {
        var _this = this;
        var _a = this.props, icon = _a.icon, label = _a.label, width = _a.width, data = _a.data, className = _a.className;
        return (React.createElement("div", { className: classnames(styles.listBox, (_b = {},
                _b[String(className)] = className !== undefined,
                _b)) },
            React.createElement("button", { onClick: this.modalShow, title: label, className: classnames(styles.toolbtn) }, icon ? React.createElement("i", { className: "fa fa-" + icon }) : React.createElement("span", null, label)),
            !this.state.visible ? null : (React.createElement("div", { style: {
                    width: width
                }, className: classnames(styles.listModal, styles.activeList) }, Object.keys(data).map(function (prp) {
                var style = data[prp];
                return (React.createElement("div", { key: prp, onClick: function () {
                        _this.onToggle(prp);
                        _this.modalShow();
                    }, style: style, className: styles.item }, prp));
            })))));
        var _b;
    };
    return ListStyle;
}(React.Component));
exports.ListStyle = ListStyle;
exports.default = ListStyle;
