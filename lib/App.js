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
var index_1 = require("./qtext/index");
var util_1 = require("./qtext/util");
require("./App.css");
var logo = require("./logo.svg");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return (React.createElement("div", { className: "App" },
            React.createElement("div", { className: "App-header" },
                React.createElement("img", { src: logo, className: "App-logo", alt: "logo" }),
                React.createElement("h2", null, "Welcome to Qtext")),
            React.createElement("div", { style: {
                    margin: util_1.isMobile() ? 0 : "20px 100px"
                } },
                React.createElement(index_1.QText, null)),
            React.createElement("p", { className: "App-intro" }, "Qtext")));
    };
    return App;
}(React.Component));
exports.default = App;
