import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QText, TEditData } from "../src/index";
import "./index.css";
import "./App.css";

const initValue = require("./test.json");

const d = {
  token:
    "LljRgfC0Wlx7ScBAhP_g78WXTYOiuGViAiCMw76V:TPEmRFAbZMWakPqUj4C-u9I28GQ=:eyJzY29wZSI6ImRhb2dvdSIsImRlYWRsaW5lIjoxNTE2OTU2NTI5LCJ1cGhvc3RzIjpbImh0dHA6Ly91cC5xaW5pdS5jb20iLCJodHRwOi8vdXBsb2FkLnFpbml1LmNvbSIsIi1IIHVwLnFpbml1LmNvbSBodHRwOi8vMTgzLjEzMS43LjE4Il19",
  baseUrl: "https://i.ezbuy.sg/"
};

function url(hash: string) {
  return `${d.baseUrl}${hash}`;
}

const TOKEN = d.token;

class App extends React.Component {
  editor: QText | null;
  editorView: QText | null;

  state = {
    value: undefined
  };
  render() {
    return (
      <div className="App">
        <h2>Qtext: React editor base on Draft-js</h2>
        <p>
          <button
            onClick={() => {
              console.log(
                JSON.stringify(
                  this.editor ? this.editor.getEditData() : {},
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
          <QText
            ref={r => (this.editor = r)}
            disabled={[]}
            value={this.state.value}
            onChange={s => {
              // use setData change view
              if (s && s.data && this.editorView) {
                this.editorView.setData(s.data);
              }
            }}
            rcSuccess={data => {
              return url(data.hash);
            }}
            rcUploadProps={{
              data: {
                token: TOKEN
              },
              action:
                location.protocol === "https:"
                  ? "https://up.qbox.me"
                  : "http://upload.qiniu.com/"
            }}
          />

          <h2>Test qtext view</h2>
          <QText
            ref={r => (this.editorView = r)}
            value={this.state.value}
            readOnly={true}
          />
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
