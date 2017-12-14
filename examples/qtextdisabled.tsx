import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { QText, TEditData } from "../src/index";
import { EditorDefaultTools } from "./../src/tools";
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
    value: undefined,
    disabled: []
  };
  render() {
    return (
      <div className="App">
        <h2>Qtext: React editor base on Draft-js test disabled</h2>
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
        <div id="listbox" className="list">
          {EditorDefaultTools.map(ele => {
            return (
              <span
                title={ele.key}
                key={ele.key}
                style={{
                  padding: "5px",
                  display: "inline-block"
                }}
              >
                <input id={ele.key} type="checkbox" value={ele.key} />
                <label htmlFor={ele.key}>{ele.label}</label>
              </span>
            );
          })}
        </div>
        <button onClick={this.refresh}>refresh</button>
        <div>
          <QText
            ref={r => (this.editor = r)}
            disabled={this.state.disabled}
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

  refresh = () => {
    const listbox = document.querySelectorAll("#listbox input");
    const keys: (string | null)[] = [];

    listbox.forEach((ele: HTMLInputElement) => {
      if (ele.checked) {
        keys.push(ele.value);
      }
    });

    this.setState({
      disabled: keys.filter(ele => ele !== null)
    });
  };

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
