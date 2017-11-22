"use strict";

exports.__esModule = true;
exports.ListStyle = undefined;

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _reactDom = require("react-dom");

var _contains = require("rc-util/lib/Dom/contains");

var _contains2 = _interopRequireDefault(_contains);

var _classnames2 = require("classnames");

var classnames = _interopRequireWildcard(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = require("./scss/ToolBar.less");

var ListStyle = exports.ListStyle = function (_React$Component) {
    _inherits(ListStyle, _React$Component);

    function ListStyle(props) {
        _classCallCheck(this, ListStyle);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.documentCancelFunc = function (e) {
            var root = (0, _reactDom.findDOMNode)(_this);
            if (!(0, _contains2["default"])(root, e.target)) {
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

exports["default"] = ListStyle;