import * as React from "react";
import { CSSProperties } from "react";
import { findDOMNode } from "react-dom";
import { default as contains } from "rc-util/lib/Dom/contains";
import * as classnames from "classnames";

export interface TItem {
  value: string;
  icon?: string;
  label: string;
  desc?: string;
  style?: CSSProperties;
  renderItem?: (ele: TItem) => JSX.Element;
}

export interface ListStyleProps {
  data: TItem[];
  defaultValue?: string;
  className?: string;
  value?: string;
  width: number;
  onToggle: (style: string) => void;
}

export interface ListStyleState {
  value: string;
  visible: boolean;
}

const styles = require("./index.less");

export class ListStyle extends React.Component<ListStyleProps, ListStyleState> {
  constructor(props: ListStyleProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || "",
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
    this.setState(
      {
        visible: flag
      },
      () => {
        if (flag) {
          this.initClickEvents();
        } else {
          document.removeEventListener("click", this.documentCancelFunc);
        }
      }
    );
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

  render(): JSX.Element | null {
    const { width, data, className } = this.props;
    const defaultItem = data.find(ele => ele.value === this.state.value);

    return (
      <div
        className={classnames(styles.listBox, {
          [String(className)]: className !== undefined
        })}
      >
        <div
          onClick={this.modalShow}
          className={classnames(styles.item, {
            [styles.head]: true,
            [styles.active]: this.state.visible
          })}
          style={{
            width
          }}
        >
          {defaultItem && defaultItem.icon ? (
            <i className={`fa fa-${defaultItem.icon}`} />
          ) : (
            <span>
              {defaultItem && defaultItem.renderItem
                ? defaultItem.renderItem(defaultItem)
                : (defaultItem && defaultItem.label) || "  "}
            </span>
          )}
          <i className={"fa fa-angle-right " + styles.rightIcon} />
        </div>

        {!this.state.visible ? null : (
          <div
            style={{
              width
            }}
            className={classnames(styles.listModal, styles.activeList)}
          >
            {data.map(item => {
              const { value, renderItem } = item;
              const text = renderItem ? renderItem(item) : item.label;

              return (
                <div
                  key={value}
                  onClick={() => {
                    this.onToggle(value);
                    this.modalShow();
                  }}
                  className={styles.item}
                >
                  {item.icon ? <i className={`fa fa-${item.icon}`} /> : text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default { ListStyle };
