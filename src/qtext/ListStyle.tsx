import * as React from "react";
import * as classnames from "classnames";
import { CSSProperties } from "react/index";

interface ListStyleProps {
  data: { [key: string]: CSSProperties };
  icon: string;
  label: string;
  width: number;
  onToggle: (style: string) => void;
}
interface ListStyleState {
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
  onToggle = (style: string) => {
    this.props.onToggle(style);
  };

  modalShow = () => {
    const flag = !this.state.visible;
    this.setState({
      visible: flag
    });
  };

  render(): JSX.Element {
    const { icon, label, width, data } = this.props;

    return (
      <div className={styles.listBox}>
        <button
          onClick={this.modalShow}
          title={label}
          className={classnames(styles.toolbtn)}
        >
          {icon ? <i className={`fa fa-${icon}`} /> : <span>{label}</span>}
        </button>
        <div
          style={{
            width
          }}
          className={classnames(styles.listModal, {
            [styles.activeList]: this.state.visible
          })}
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
      </div>
    );
  }
}

export default ListStyle;
