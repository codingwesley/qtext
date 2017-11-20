import * as React from "react";
import { MediaView, TMedia } from "./Media";
import { ContentBlock, ContentState } from "draft-js";

const styles = require("./scss/block.scss");

export const atomicRenderers = {
  [TMedia.video]: MediaView,
  [TMedia.image]: MediaView,
  [TMedia.audio]: MediaView
};

interface AtomicBlockProps {
  block: ContentBlock;
  contentState: ContentState;
}

interface AtomicBlockState {}

export class AtomicBlock extends React.Component<
  AtomicBlockProps,
  AtomicBlockState
> {
  public render(): JSX.Element {
    const { contentState, block } = this.props;
    const start = block.getEntityAt(0);
    const entity = contentState.getEntity(start);
    const type = entity.getType();
    const data = entity.getData();

    if (atomicRenderers[type]) {
      const AtComponent = atomicRenderers[type];
      return (
        <div className={styles[`block-${type}`]}>
          <AtComponent data={data} type={type} />
        </div>
      );
    }
    return (
      <p>
        Block of type <b>{type}</b> is not supported.
      </p>
    );
  }
}

export default AtomicBlock;
