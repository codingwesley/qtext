import * as React from "react";
import { ContentState, ContentBlock } from "draft-js";

const styles = require("./scss/Link.scss");

export function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

export interface LinkProps {
  type: string;
  block: ContentBlock;
  entityKey: string;
  contentState: ContentState;
  children: JSX.Element;
}

export const Link = (props: LinkProps) => {
  const { url, newTarget } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  return (
    <a
      href={url}
      target={newTarget ? "_blank" : "_self"}
      className={styles.link}
    >
      {props.children}
    </a>
  );
};
