import React from "react";
import DrumContext from "../contexts/DrumContext";
import "./Pad.css";

// ** PAD COMPONENT FOR TRIGGERING SOUNDS **
export default class Pad extends React.Component {
  static contextType = DrumContext;

  //Handle clicking pads
  handleClickPad = (e) => {
    const clickedPad = `${e.target.dataset.beat} ${this.props.pad}`;
    const key = e.target.dataset.pad;

    let currentBeat = e.target.dataset.beat;
    let nextBeat = "1" + currentBeat.substring(1, 6);

    //Add Remove Pads
    if (e.target.checked) {
      this.props.addPad(clickedPad, `${nextBeat} ${key}`);
    } else {
      this.props.removePad(clickedPad, `${nextBeat} ${key}`);
    }
  };

  //Generate proper timecode
  toBarsBeatsSixteenths = (beatCount) => {
    // 9
    let bars, quarterBeat;
    let sixteenthBeat = beatCount % 4; //  1
    let sixteenthCount = beatCount - sixteenthBeat; // 8
    quarterBeat = Math.floor(sixteenthCount / 4);
    if (quarterBeat > 3) {
      let copy = sixteenthCount;
      let times = 0;
      while (copy > 15) {
        copy = copy - 16;
        ++times;
      }
      bars = times;
      quarterBeat = quarterBeat % 4;
    } else {
      bars = 0;
    }

    return `${bars}:${quarterBeat}:${sixteenthBeat}`;
  };
  render() {
    //Generate the number of pads for a row, based on props.count
    let beats = [];

    for (let i = 0; i < this.props.count; i++) {
      const timecode = this.toBarsBeatsSixteenths(i);
      beats.push(
        <input
          key={i}
          type="checkbox"
          className="pad-checkbox"
          id={`beat-tick-${i + 1 + this.props.rownum * this.props.count}`}
          data-beat={timecode}
          data-count={i + 1 + this.props.rownum * this.props.count}
          data-pad={this.props.pad}
          onClick={this.handleClickPad}
          defaultChecked={this.props.activePad.find(
            (pad) => pad[0] === timecode
          )}
        />
      );
    }

    return <>{beats}</>;
  }
}
