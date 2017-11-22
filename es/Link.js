import * as React from "react";
var styles = require("./scss/Link.less");
export function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK";
    }, callback);
}
export var Link = function Link(props) {
    var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
        url = _props$contentState$g.url,
        newTarget = _props$contentState$g.newTarget;

    return React.createElement(
        "a",
        { href: url, target: newTarget ? "_blank" : "_self", className: styles.link },
        props.children
    );
};