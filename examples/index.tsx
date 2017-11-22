import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QText } from "../src/qtext/index";
import { isMobile } from "../src/qtext/util";
import "./index.css";
import "./App.css";

const logo = require("./logo.svg").default;
const logoView = (
  <svg width="80" viewBox={logo.viewBox}>
    <use xlinkHref={`#${logo.id}`} />
  </svg>
);

class App extends React.Component {
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
          <QText />
        </div>
        <p className="App-intro">Qtext</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("qrcode") as HTMLElement);

registerServiceWorker();
