import * as React from "react";
import { QText } from "./qtext/index";
import "./App.css";

const logo = require("./logo.svg");

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div
          style={{
            margin: "20px 100px"
          }}
        >
          <QText />
        </div>
        <p className="App-intro">QTEXT</p>
      </div>
    );
  }
}

export default App;
