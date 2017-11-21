"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Link_1 = require("./Link");
var draft_js_1 = require("draft-js");
exports.decorator = new draft_js_1.CompositeDecorator([
    {
        strategy: Link_1.findLinkEntities,
        component: Link_1.Link
    }
]);
