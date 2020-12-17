import React from "react";
import Sequencer from "./routes/Sequencer";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <>
        <header>
          <h1>BAP</h1>
        </header>
        <div className="App">
          <Sequencer />
        </div>
      </>
    );
  }
}

export default App;
