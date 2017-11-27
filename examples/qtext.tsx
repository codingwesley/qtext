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
        text: "You can edit your content!",
        type: "header-one",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 15,
            style: "green"
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
        <h2>Qtext: React editor base on Draft-js</h2>
        <div>
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

ReactDOM.render(<App />, document.getElementById(
  "__react-content"
) as HTMLElement);

registerServiceWorker();
