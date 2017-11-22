"use strict";

exports.__esModule = true;
exports.Link = undefined;
exports.findLinkEntities = findLinkEntities;

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var styles = require("./scss/Link.less");
function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK";
    }, callback);
}
var Link = exports.Link = function Link(props) {
    var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
        url = _props$contentState$g.url,
        newTarget = _props$contentState$g.newTarget;

    return React.createElement(
        "a",
        { href: url, target: newTarget ? "_blank" : "_self", className: styles.link },
        props.children
    );
};