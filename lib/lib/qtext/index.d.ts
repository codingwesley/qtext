/// <reference types="draft-js" />
/// <reference types="react" />
import * as React from "react";
import "draft-js/dist/Draft.css";
import { AtomicBlock } from "./AtomicBlock";
import { EditorState, ContentBlock, RawDraftContentState } from "draft-js";
export interface QTextProps {
    readOnly?: boolean;
    placeholder?: string;
    value?: RawDraftContentState;
    onChange?: (editorState: EditorState) => void;
    autoSave?: boolean;
}
export interface QTextState {
    editorState: EditorState;
    readOnly: boolean;
    editMode: "desktop" | "mobile";
}
export interface TEditData {
    data: RawDraftContentState;
}
export declare class QText extends React.Component<QTextProps, QTextState> {
    static defaultProps: QTextProps;
    id: number;
    getBlockRender: (block: ContentBlock) => {
        component: typeof AtomicBlock;
        editable: boolean;
        props: {
            editorState: EditorState;
        };
    } | null;
    onChange: (editorState: EditorState) => void;
    saveData: () => void;
    getEditData(): TEditData;
    constructor(props: QTextProps);
    _toggleBlockType: (blockType: string) => void;
    _toggleInlineStyle: (inlineStyle: string) => void;
    toggleMode: (mode: "desktop" | "mobile") => void;
    toggleEye: (mode: string) => void;
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: QTextProps): void;
    setData(rowData: RawDraftContentState): void;
    componentDidMount(): void;
    componentWillUnMount(): void;
}
export default QText;
