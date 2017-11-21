export interface TStyleItem {
    label: string;
    icon?: string;
    desc: string;
    style: string;
    isBlock: boolean;
}
export declare const STYLE_LIST: TStyleItem[];
export declare const colorStyleMap: {
    black: {
        color: string;
    };
    red: {
        color: string;
    };
    orange: {
        color: string;
    };
    yellow: {
        color: string;
    };
    green: {
        color: string;
    };
    blue: {
        color: string;
    };
    indigo: {
        color: string;
    };
    violet: {
        color: string;
    };
};
export interface TSize {
    fontSize: number;
}
export declare const fontSizeStyleMap: {
    [key: string]: TSize;
};
export declare const fontFamilyStyleMap: {
    "Roboto-Regular": {
        fontFamily: string;
    };
    "Roboto-Light": {
        fontFamily: string;
    };
    "Roboto-LightItalic": {
        fontFamily: string;
    };
    "Roboto-Bold": {
        fontFamily: string;
    };
    "Roboto-BoldItalic": {
        fontFamily: string;
    };
    "Roboto-Medium": {
        fontFamily: string;
    };
    "Roboto-MediumItalic": {
        fontFamily: string;
    };
    "Roboto-Thin": {
        fontFamily: string;
    };
    "Roboto-ThinItalic": {
        fontFamily: string;
    };
    "Roboto-Black": {
        fontFamily: string;
    };
    "Roboto-BlackItalic": {
        fontFamily: string;
    };
    "Roboto-Italic": {
        fontFamily: string;
    };
    Arial: {
        fontFamily: string;
    };
    Georgia: {
        fontFamily: string;
    };
    Monospace: {
        fontFamily: string;
    };
    Impact: {
        fontFamily: string;
    };
    Tahoma: {
        fontFamily: string;
    };
    TimesNewRoman: {
        fontFamily: string;
    };
    Verdana: {
        fontFamily: string;
    };
};
