/// <reference types="react" />
import * as React from "react";
export interface ListStyleProps {
    data: {
        [key: string]: any;
    };
    icon: string;
    label: string;
    className?: string;
    value?: string;
    width: number;
    onToggle: (style: string) => void;
}
export interface ListStyleState {
    value: string;
    visible: boolean;
}
export declare class ListStyle extends React.Component<ListStyleProps, ListStyleState> {
    constructor(props: ListStyleProps);
    documentCancelFunc: (e: any) => void;
    onToggle: (style: string) => void;
    modalShow: () => void;
    initClickEvents(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: ListStyleProps): void;
    render(): JSX.Element;
}
export default ListStyle;
