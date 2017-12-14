import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QText, TEditData } from "../src/index";
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

function url(hash: string) {
  return `http://7xiata.com1.z0.glb.clouddn.com/${hash}`;
}

const d = {
  token:
    "LljRgfC0Wlx7ScBAhP_g78WXTYOiuGViAiCMw76V:YUPh7TfD5N96-5-9jhzfgjf8UPI=:eyJzY29wZSI6ImRhaWdvdXRlc3QiLCJkZWFkbGluZSI6MTUxMzA3NTU3NCwidXBob3N0cyI6WyJodHRwOi8vdXAucWluaXUuY29tIiwiaHR0cDovL3VwbG9hZC5xaW5pdS5jb20iLCItSCB1cC5xaW5pdS5jb20gaHR0cDovLzE4My4xMzEuNy4xOCJdfQ==",
  baseUrl: "http://7xiata.com1.z0.glb.clouddn.com/"
};

const TOKEN = d.token;

class App extends React.Component {
  editor: QText | null;
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

          <h2>Test disabled some tools</h2>
          <QText
            ref={r => (this.editor = r)}
            disabled={["heading", "preview"]}
            value={this.state.value}
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
