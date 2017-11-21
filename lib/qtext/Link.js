"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles = require("./scss/Link.scss");
function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return (entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "LINK");
    }, callback);
}
exports.findLinkEntities = findLinkEntities;
exports.Link = function (props) {
    var _a = props.contentState
        .getEntity(props.entityKey)
        .getData(), url = _a.url, newTarget = _a.newTarget;
    return (React.createElement("a", { href: url, target: newTarget ? "_blank" : "_self", className: styles.link }, props.children));
};
