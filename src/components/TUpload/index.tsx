import * as React from "react";
import * as Upload from "rc-upload";

interface TUploadProps {
  rcUploadProps?: Object;
}

interface TUploadState {}

class TUpload extends React.Component<TUploadProps, TUploadState> {
  public render(): JSX.Element {
    const { rcUploadProps } = this.props;

    return <Upload {...rcUploadProps}>{this.props.children}</Upload>;
  }
}

export default TUpload;
