import React from "react";
import Pad from "./Pad";
import DrumContext from "../contexts/DrumContext";

import "./Grid.css";

export default class Grid extends React.Component {
  static contextType = DrumContext;

  state = {
    loadedPads: {},
  };

  addPad = (activePad1, activePad2) => {
    const padDetails1 = activePad1.split(" ");
    const time1 = padDetails1[0];
    const key1 = padDetails1[1];

    let padDetails2, time2, key2;
    if (activePad2) {
      padDetails2 = activePad2.split(" ");
      time2 = padDetails2[0];
      key2 = padDetails2[1];
      this.context.setPads([
        ...this.context.pads,
        [time1, key1],
        [time2, key2],
      ]);
      this.context.addPad(time1, key1);
      this.context.addPad(time2, key2);
    } else {
      this.context.setPads([...this.context.pads, [time1, key1]]);
      this.context.addPad(time1, key1);
    }
  };

  removePad = (inactivePad, inactivePad2) => {
    const padDetails = inactivePad.split(" ");
    const time = padDetails[0];
    const key = padDetails[1];
    const removedPad = [time, key];

    let padDetails2, time2, key2, removedPad2, newPads;
    if (inactivePad2) {
      padDetails2 = inactivePad2.split(" ");
      time2 = padDetails2[0];
      key2 = padDetails2[1];
      removedPad2 = [time2, key2];

      newPads = this.context.pads.filter(
        (pad) =>
          JSON.stringify(pad) !== JSON.stringify(removedPad) &&
          JSON.stringify(pad) !== JSON.stringify(removedPad2)
      );
      this.context.removePad(time, key);
      this.context.removePad(time2, key2);
    } else {
      newPads = this.context.pads.filter(
        (pad) => JSON.stringify(pad) !== JSON.stringify(removedPad)
      );
      this.context.removePad(time, key);
    }

    // context functions
    this.context.setPads(newPads);
  };

  render() {
    const length = 16;
    const tracks = ["A1", "B1", "C1", "D1", "E1", "F1"];
    const activePads = this.context.pads;

    return (
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
