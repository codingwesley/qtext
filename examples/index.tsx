import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QText, TEditData } from "../src/index";
import { isMobile } from "../src/util";
import "./index.css";
import "./App.css";

const initValue: TEditData = {
  data: {
    entityMap: {},
    blocks: [
      {
        key: "92hbu",
        text: "陈欢 编辑内容 开始了",
        type: "header-one",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 11,
            style: "red"
          },
          {
            offset: 0,
            length: 11,
            style: "BOLD"
          }
        ],
        entityRanges: [],
        data: {}
      }
    ]
  }
};

const logo = require("./logo.svg").default;
const logoView = (
  <svg width="80" viewBox={logo.viewBox}>
    <use xlinkHref={`#${logo.id}`} />
  </svg>
);

class App extends React.Component {
  state = {
    value: undefined
  };
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo">{logoView}</div>
          <h2>Welcome to Qtext</h2>
        </div>
        <div
          style={{
            margin: isMobile() ? 0 : "20px 100px"
          }}
        >
          <QText value={this.state.value} />
        </div>
        <p className="App-intro">Qtext</p>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: initValue
      });
    }, 3000);
  }
}

ReactDOM.render(<App />, document.getElementById("qrcode") as HTMLElement);

registerServiceWorker();
