/// <reference types="draft-js" />
/// <reference types="react" />
import * as React from "react";
import { MediaView } from "./Media";
import { ContentBlock, ContentState } from "draft-js";
export declare const atomicRenderers: {
    [TMedia.video]: typeof MediaView;
    [TMedia.image]: typeof MediaView;
    [TMedia.audio]: typeof MediaView;
};
export interface AtomicBlockProps {
    block: ContentBlock;
    contentState: ContentState;
}
export interface AtomicBlockState {
}
export declare class AtomicBlock extends React.Component<AtomicBlockProps, AtomicBlockState> {
    render(): JSX.Element;
}
export default AtomicBlock;
