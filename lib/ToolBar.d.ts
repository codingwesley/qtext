/// <reference types="draft-js" />
/// <reference types="react" />
import * as React from "react";
import { EditorState } from "draft-js";
import { Media } from "./Media";
export declare type TMode = "desktop" | "mobile";
export interface ToolBarProps {
    editMode: TMode;
    toggleMode: (mode: TMode) => void;
    editorState: EditorState;
    changeEditState: (editorState: EditorState) => void;
    onToggle: (isBlock: boolean, style: string) => void;
}
export interface ToolBarState {
}
export declare class ToolBar extends React.PureComponent<ToolBarProps, ToolBarState> {
    linkStyle: Media | null;
    onToggle: (isBlock: boolean, style: string) => void;
    render(): JSX.Element;
    modeBtn(): JSX.Element;
    linkClick: () => void;
    linkConfirm: (name: string, url: string, newTarget: boolean, style?: string) => void;
    mediaConfirm: (style: string, name: string, url: string) => void;
    renderActionBtn(label: string, icon: string, desc: string, style: string, disabled: boolean, onToggle: () => void, isBlock?: boolean): JSX.Element;
    _renderUndoBtn(): JSX.Element;
    _renderRedoBtn(): JSX.Element;
    togglePrp: (data: {
        [key: string]: React.CSSProperties;
    }, style: string) => void;
    _renderColors(): JSX.Element;
    _renderFamily(): JSX.Element;
    _renderFontSize(): JSX.Element;
}
export default ToolBar;
