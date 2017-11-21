/// <reference types="react" />
import * as React from "react";
export declare enum TMedia {
    audio = 0,
    video = 1,
    image = 2,
    link = 3,
}
export interface MediaProps {
    icon: string;
    label: string;
    value?: string;
    type: TMedia;
    donotName?: boolean;
    onClick?: () => void;
    onToggle: (style: string, name: string, value: string, check: boolean) => void;
}
export interface MediaState {
    showURLInput: boolean;
    showURLType: TMedia;
    showURLName: string;
    showURLValue: string;
    checked: boolean;
}
export declare class Media extends React.Component<MediaProps, MediaState> {
    checkbox: HTMLInputElement | null;
    constructor(props: MediaProps);
    modalShow: () => void;
    onChange: (obj: any) => void;
    confirmMedia: () => void;
    _onURLInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    render(): JSX.Element;
}
export interface MediaViewProps {
    type: string;
    data: TMediaData;
}
export interface MediaViewState {
}
export interface TMediaData {
    name: string;
    src: string;
}
export declare class MediaView extends React.PureComponent<MediaViewProps, MediaViewState> {
    render(): JSX.Element;
}
export default Media;
