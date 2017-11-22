var _atomicRenderers;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as React from "react";
import { MediaView, TMedia } from "./Media";
var styles = require("./scss/block.less");
export var atomicRenderers = (_atomicRenderers = {}, _atomicRenderers[TMedia.video.toString()] = MediaView, _atomicRenderers[TMedia.image.toString()] = MediaView, _atomicRenderers[TMedia.audio.toString()] = MediaView, _atomicRenderers);
export var AtomicBlock = function (_React$Component) {
    _inherits(AtomicBlock, _React$Component);

    function AtomicBlock() {
        _classCallCheck(this, AtomicBlock);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    AtomicBlock.prototype.render = function render() {
        var _props = this.props,
            contentState = _props.contentState,
            block = _props.block;

        var start = block.getEntityAt(0);
        var entity = contentState.getEntity(start);
        var type = entity.getType();
        var data = entity.getData();
        if (atomicRenderers[type]) {
            var AtComponent = atomicRenderers[type];
            return React.createElement(
                "div",
                { className: styles["block-" + type] },
                React.createElement(AtComponent, { data: data, type: type })
            );
        }
        return React.createElement(
            "p",
            null,
            "Block of type ",
            React.createElement(
                "b",
                null,
                type
            ),
            " is not supported."
        );
    };

    return AtomicBlock;
}(React.Component);
export default AtomicBlock;