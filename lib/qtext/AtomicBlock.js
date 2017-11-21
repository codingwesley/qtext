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
var Media_1 = require("./Media");
var styles = require("./scss/block.scss");
exports.atomicRenderers = (_a = {},
    _a[Media_1.TMedia.video] = Media_1.MediaView,
    _a[Media_1.TMedia.image] = Media_1.MediaView,
    _a[Media_1.TMedia.audio] = Media_1.MediaView,
    _a);
var AtomicBlock = (function (_super) {
    __extends(AtomicBlock, _super);
    function AtomicBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AtomicBlock.prototype.render = function () {
        var _a = this.props, contentState = _a.contentState, block = _a.block;
        var start = block.getEntityAt(0);
        var entity = contentState.getEntity(start);
        var type = entity.getType();
        var data = entity.getData();
        if (exports.atomicRenderers[type]) {
            var AtComponent = exports.atomicRenderers[type];
            return (React.createElement("div", { className: styles["block-" + type] },
                React.createElement(AtComponent, { data: data, type: type })));
        }
        return (React.createElement("p", null,
            "Block of type ",
            React.createElement("b", null, type),
            " is not supported."));
    };
    return AtomicBlock;
}(React.Component));
exports.AtomicBlock = AtomicBlock;
exports.default = AtomicBlock;
var _a;
