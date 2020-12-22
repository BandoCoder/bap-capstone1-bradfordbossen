import React from "react";
import * as Tone from "tone";
import "./Sequencer.css";
import Grid from "../components/Grid";
import PatternsApiService from "../services/pat-api-service";
import TokenService from "../services/token-service";
import DrumContext from "../contexts/DrumContext";

export default class Sequencer extends React.Component {
  static contextType = DrumContext;

  constructor(props) {
    super(props);
    this.state = {
      bpm: 87,
      pads: [],
      title: "",
      playing: false,
      disableSave: false,
      saveSuccessful: false,
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

  componentDidMount = () => {
    this._isMounted = true;
    const jwt = TokenService.getAuthToken();
    if (jwt) {
      let base64Url = jwt.split(".")[1];
      let decodedValue = JSON.parse(window.atob(base64Url));
      if (
        this.props.match.params.user_name &&
        decodedValue.sub !== this.props.match.params.user_name
      ) {
        this.props.history.push(
          `/${decodedValue.sub}/patterns/${this.props.match.params.pattern_id}`
        );
      }
    } else {
      this.setState({ disableSave: true });
    }
    const patternIdToLoad = this.props.match.params.pattern_id;
    if (patternIdToLoad != null) {
      PatternsApiService.getPatternById(patternIdToLoad)
        .then((pattern) => {
          document.title = `BAP pattern: ${pattern.title}`;

          this.setState({
            bpm: pattern.pattern_data.bpm,
            title: pattern.title,
          });
          this.setPads(pattern.pattern_data.pads);

          this.addPadsOnLoad(pattern.pattern_data.pads);
        })
        .catch((err) => {
          this.setState({
            error: err.error,
          });
          // this.props.history.push("/page-not-found");
        });
    } else {
      this.setState({ title: "new pattern (click to edit title)" });
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    this.part.stop();
    document.title = "BAP";
  };

  handleSave = () => {
    if (this.props.match.params.pattern_id == null) {
      this.insertNewPattern();
    } else {
      this.saveEditsPattern();
    }
  };

  insertNewPattern = () => {
    let pattern_data = {
      bpm: this.state.bpm,
      pads: this.state.pads,
    };
    PatternsApiService.postPattern({
      title: this.state.title,
      pattern_data,
    })
      .then((res) => {
        this.props.history.push(
          `/${this.context.user_name}/patterns/${res.id}`
        );
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  saveEditsPattern = () => {
    const patternIdToSave = this.props.match.params.pattern_id;
    let patternStorage = {
      title: this.state.title,
      pattern_data: {
        bpm: this.state.bpm,
        pads: this.state.pads,
      },
    };
    PatternsApiService.patchPattern(patternIdToSave, patternStorage)
      .then(() => {
        document.title = `BAP pattern: ${this.state.title}`;
        this.setState({ saveSuccessful: true }, () =>
          setTimeout(() => {
            this.setState({ saveSuccessful: false });
          }, 3000)
        );
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value });
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

  handleEnterOnTitle = (e) => {
    if (e.keyCode === 13 && e.target.checkValidity())
      this.setState({ editingTitle: false });
  };

  handleBlurOnTitle = (e) => {
    if (e.target.checkValidity()) this.setState({ editingTitle: false });
  };

  render() {
    const names = ["Kick", "Snare", "Shake", "Closed Hat", "Open Hat", "Shout"];
    return (
      <>
        {!this.state.editingTitle && (
          <h2
            className="pattern-title"
            onClick={() => this.setState({ editingTitle: true })}
          >
            {this.state.title}
          </h2>
        )}
        {this.state.editingTitle && (
          <input
            type="text"
            value={this.state.title}
            className="pattern-title-input"
            onChange={(e) => this.handleChangeTitle(e)}
            autoFocus="autofocus"
            onBlur={(e) => this.handleBlurOnTitle(e)}
            onKeyDown={(e) => this.handleEnterOnTitle(e)}
            required
          />
        )}
        <div className="transport">
          <label>
            BPM:
            <input
              type="number"
              value={this.state.bpm}
              className="bpm-selector"
              onChange={(e) => this.handleBPMChange(e)}
              min="40"
              max="360"
            />
          </label>

          <button
            className={this.state.isPlaying ? "playStop" : "play"}
            type="button"
            onClick={(e) => this.handlePlayToggle()}
          >
            {this.state.isPlaying ? "stop" : "play"}
          </button>
        </div>
        <div className="sequencer">
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
          <div className="save-block">
            {this.state.saveSuccessful && (
              <div className="save-message">
                <p>Saved Pattern</p>
              </div>
            )}
            {this.state.disableSave && (
              <div className="save-message">
                <p>Must be logged-in in order to save</p>
              </div>
            )}
            <button
              className="save-button"
              type="button"
              onClick={(e) => this.handleSave()}
              disabled={this.state.disableSave}
            >
              Save Pattern
            </button>
          </div>
        </div>
      </>
    );
  }
}
