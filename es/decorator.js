import { findLinkEntities, Link } from "./Link";
import { CompositeDecorator } from "draft-js";
export var decorator = new CompositeDecorator([{
    strategy: findLinkEntities,
    component: Link
}]);