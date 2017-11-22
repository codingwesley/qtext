import { findLinkEntities, Link } from "./Link";
import { CompositeDecorator } from "draft-js";

export const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link
  }
]);
