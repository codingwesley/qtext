import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QTextView } from "../src/QtextView";

import "./App.css";
import "./../assets/index.less";
import "./view.less";

const initValue = require("./test.json");

class App extends React.Component {
  editor: QTextView | null;
  state = {
    value: undefined,
    disabled: []
  };

  render() {
    return (
      <div className="App">
        <h2>Qtext: React editor base on Draft-js test render view</h2>
        <p>
          <button
            onClick={() => {
              console.log(
                JSON.stringify(
                  this.editor ? this.editor.getData() : {},
                  null,
                  4
                )
              );
            }}
          >
            log editor data
          </button>
        </p>
        <div>
          <QTextView
            className={"qtext-showbox"}
            ref={r => (this.editor = r)}
            value={initValue.data}
          />
        </div>
        <p className="App-intro">Qtext</p>
      </div>
    );
  }
  componentDidMount() {
    this.setState({
      value: initValue.data
    });
  }
}

ReactDOM.render(<App />, document.getElementById(
  "__react-content"
) as HTMLElement);

registerServiceWorker();
