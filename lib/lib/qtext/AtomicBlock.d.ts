/// <reference types="draft-js" />
/// <reference types="react" />
import * as React from "react";
import { ContentBlock, ContentState } from "draft-js";
export declare const atomicRenderers: {
    [key: string]: any;
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
