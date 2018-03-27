import * as React from "react";
import * as classnames from "classnames";

export interface TIcon {
  value: string;
  icon: string;
}

export interface ToggleIconProps {
  icons: TIcon[];
  className?: string;
  value?: string;
  onToggle: (value: string) => void;
}

export interface ToggleIconState {
  value: string;
}

export class ToggleIcon extends React.Component<
  ToggleIconProps,
  ToggleIconState
> {
  constructor(props: ToggleIconProps) {
    super(props);
    this.state = {
      value: props.icons[0].value
    };
  }

  onToggle = () => {
    const [first, second] = this.props.icons;
    let value = this.state.value;
    if (first.value === value) {
      value = second.value;
    } else {
      value = first.value;
    }

    this.setState(
      {
        value
      },
      () => {
        this.props.onToggle(value);
      }
    );
  };

  componentWillReceiveProps(nextProps: ToggleIconProps) {
    if (nextProps.value && this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  render(): JSX.Element | null {
    const { icons, className } = this.props;
    const currentIcon = icons.find(ele => ele.value === this.state.value);
    if (!currentIcon) {
      return null;
    }
    const { icon } = currentIcon;

    return (
      <div
        className={classnames("qtext-iconele", {
          [String(className)]: className !== undefined
        })}
      >
        <button
          onClick={this.onToggle}
          title={icons.map(ele => ele.value).join("/")}
          className={classnames("qtext-toolbtn")}
        >
          <i className={`fa fa-${icon}`} />
        </button>
      </div>
    );
  }
}

export default ToggleIcon;
