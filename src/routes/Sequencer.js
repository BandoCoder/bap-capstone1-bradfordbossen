import React from "react";
import * as Tone from "tone";
import "./Sequencer.css";
import Grid from "../components/Grid";
import DrumContext from "../contexts/DrumContext";

export default class Sequencer extends React.Component {
  static contextType = DrumContext;

  constructor(props) {
    super(props);
    this.state = {
      bpm: 94,
      pads: [],
      title: "",
      playing: false,
    };
    //setup sampler
    this.drumMachine = new Tone.Sampler({
      urls: {
        A1: "/sounds/Kick.wav",
        B1: "/sounds/snare.wav",
        C1: "/sounds/shaker.wav",
        D1: "/sounds/closed-hat.wav",
        E1: "/sounds/open-hat.wav",
        F1: "/sounds/shout.wav",
      },
    }).toDestination();
    Tone.Transport.start();

    this.part = new Tone.Part((time, note) => {
      this.drumMachine.triggerAttackRelease(note, "16n", time);
    }, this.state.pads);

    this.part.loopEnd = "1m";
    this.part.loop = true;
  }

  componentWillUnmount = () => {
    this.part.stop();
    document.title = "BAP";
  };

  handleBPMChange = (e) => {
    if (e.target.value >= 0) {
      this.setState({ bpm: e.target.value }, () => {
        Tone.Transport.bpm.value = this.state.bpm;
      });
    } else {
      this.setState({ bpm: 0 }, () => {
        Tone.Transport.bpm.value = 0;
      });
    }
  };

  handlePlayToggle = () => {
    console.log(this.state.pads);
    if (Tone.context.state !== "running") Tone.context.resume();
    this.setState({ isPlaying: !this.state.isPlaying }, () => {
      if (this.state.isPlaying) this.part.start();
      else this.part.stop();
    });
  };

  setPads = (pads) => {
    this.setState({ pads });
  };

  addPad = (time, key) => {
    this.part.add(time, key);
  };

  removePad = (time, value) => {
    this.part.remove(time, value);
  };

  render() {
    const names = ["Kick", "Snare", "Shake", "Closed Hat", "Open Hat", "Shout"];
    return (
      <div className="sequencer">
        <label>
          BPM:
          <input
            type="number"
            value={this.state.bpm}
            className="bpm-selector transport__control"
            onChange={(e) => this.handleBPMChange(e)}
            min="40"
            max="360"
          />
        </label>
        <div className="transport">
          <button
            className={this.state.isPlaying ? "playStop" : "play"}
            type="button"
            onClick={(e) => this.handlePlayToggle()}
          >
            {this.state.isPlaying ? "stop" : "play"}
          </button>
        </div>
        <div className="names">
          {" "}
          {names.map((name, i) => {
            return <p key={i}>{name}</p>;
          })}
        </div>

        <DrumContext.Provider
          value={{
            pads: this.state.pads,
            addPad: this.addPad,
            removePad: this.removePad,
            setPads: this.setPads,
          }}
        >
          <Grid />
        </DrumContext.Provider>
      </div>
    );
  }
}
