import * as React from "react";
import { findDOMNode } from "react-dom";
import * as contains from "rc-util/lib/Dom/contains";
import * as classnames from "classnames";

export interface ListStyleProps {
  data: { [key: string]: any };
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

const styles = require("./scss/ToolBar.scss");

export class ListStyle extends React.Component<ListStyleProps, ListStyleState> {
  constructor(props: ListStyleProps) {
    super(props);
    this.state = {
      value: "",
      visible: false
    };
  }

  documentCancelFunc: (e: any) => void = e => {
    const root = findDOMNode(this);
    if (!contains(root, e.target)) {
      this.setState({
        visible: false
      });
    }
  };

  onToggle = (style: string) => {
    this.props.onToggle(style);
  };

  modalShow = () => {
    const flag = !this.state.visible;
    this.setState({
      visible: flag
    });
  };

  initClickEvents() {
    document.addEventListener("click", this.documentCancelFunc);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentCancelFunc);
  }

  componentWillReceiveProps(nextProps: ListStyleProps) {
    if (nextProps.value && this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentDidMount() {
    this.initClickEvents();
  }

  render(): JSX.Element {
    const { icon, label, width, data, className } = this.props;

    return (
      <div
        className={classnames(styles.listBox, {
          [String(className)]: className !== undefined
        })}
      >
        <button
          onClick={this.modalShow}
          title={label}
          className={classnames(styles.toolbtn)}
        >
          {icon ? <i className={`fa fa-${icon}`} /> : <span>{label}</span>}
        </button>
        {!this.state.visible ? null : (
          <div
            style={{
              width
            }}
            className={classnames(styles.listModal, styles.activeList)}
          >
            {Object.keys(data).map(prp => {
              const style = data[prp];

              return (
                <div
                  key={prp}
                  onClick={() => {
                    this.onToggle(prp);
                    this.modalShow();
                  }}
                  style={style}
                  className={styles.item}
                >
                  {prp}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default ListStyle;
