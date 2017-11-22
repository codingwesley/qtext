"use strict";

exports.__esModule = true;
exports.decorator = undefined;

var _Link = require("./Link");

var _draftJs = require("draft-js");

var decorator = exports.decorator = new _draftJs.CompositeDecorator([{
    strategy: _Link.findLinkEntities,
    component: _Link.Link
}]);