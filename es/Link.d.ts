/// <reference types="draft-js" />
/// <reference types="react" />
import { ContentState, ContentBlock } from "draft-js";
export declare function findLinkEntities(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState): void;
export interface LinkProps {
    type: string;
    block: ContentBlock;
    entityKey: string;
    contentState: ContentState;
    children: JSX.Element;
}
export declare const Link: (props: LinkProps) => JSX.Element;
