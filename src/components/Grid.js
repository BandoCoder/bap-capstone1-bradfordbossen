import React from "react";
import Pad from "./Pad";
import DrumContext from "../contexts/DrumContext";

import "./Grid.css";

// ** GRID COMPONENT RENDERS GRID OF PADS BY ROWS **
export default class Grid extends React.Component {
  static contextType = DrumContext;

  state = {
    pads: [],
  };

  //Pad Logic
  addPad = (activePad) => {
    const padDetails1 = activePad.split(" ");
    const time1 = padDetails1[0];
    const key1 = padDetails1[1];

    this.context.setPads([...this.context.pads, [time1, key1]]);
    this.context.addPad(time1, key1);
  };

  removePad = (inactivePad) => {
    const padDetails = inactivePad.split(" ");
    const time = padDetails[0];
    const key = padDetails[1];
    const removedPad = [time, key];

    let newPads = this.context.pads.filter(
      (pad) => JSON.stringify(pad) !== JSON.stringify(removedPad)
    );
    this.context.removePad(time, key);

    // context functions for Transport
    this.context.setPads(newPads);
  };

  render() {
    const length = 16;
    const tracks = ["A1", "B1", "C1", "D1", "E1", "F1"];
    const activePads = this.context.pads;

    return (
      //Generate rows based on array of tracks
      <div className="container">
        {tracks.map((pad, i) => {
          return (
            <section className="grid" key={i * 100}>
              <Pad
                className={`pad`}
                key={i}
                rownum={i}
                pad={pad}
                count={length}
                addPad={(string, string2) => this.addPad(string, string2)}
                removePad={(string, string2) => this.removePad(string, string2)}
                activePad={activePads.filter(
                  (currentPad) => currentPad[1] === pad
                )}
              />
            </section>
          );
        })}
      </div>
    );
  }
}
