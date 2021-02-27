import React from "react";
import * as Tone from "tone";
import "./Sequencer.css";
import Grid from "../components/Grid";
import PatternsApiService from "../services/pat-api-service";
import TokenService from "../services/token-service";
import DrumContext from "../contexts/DrumContext";

// ** SEQUENCER COMPONTENT **

// Using Tone.js to handle the interface to the web audio api.  Tone.js isn't perfect, so be prepared to work out a few bugs.

export default class Sequencer extends React.Component {
  static contextType = DrumContext;

  constructor(props) {
    super(props);
    this.state = {
      bpm: 120,
      pads: [],
      title: "",
      playing: false,
      disableSave: false,
      saveSuccessful: false,
    };

    //Setup sampler insturment from Tone.js library.

    this.drumMachine = new Tone.Sampler({
      // Set URLs of each audio file.  This can be populated by a database; for now we just have it in the project.
      urls: {
        A1: "/sounds/Kick.wav",
        B1: "/sounds/snare.wav",
        C1: "/sounds/shaker.wav",
        D1: "/sounds/closed-hat.wav",
        E1: "/sounds/open-hat.wav",
        F1: "/sounds/shout.wav",
      },
      // Route sampler to master output audio channel.  Other effects and instruments can be added using these functions within Tone.js library.
    }).toDestination();
    Tone.Transport.start();

    // Create loop using Tone.js component "Part".  A new "Part" can be created for each new instrument.
    this.part = new Tone.Part((time, note) => {
      this.drumMachine.triggerAttackRelease(note, "16n", time);
    }, this.state.pads);
    this.part.loopEnd = "1m";
    this.part.loop = true;
  }

  // Stop all audio when user navigates away from sequencer page.
  componentWillUnmount = () => {
    this.part.stop();
    document.title = "BAP";
  };

  // Implement logic to populate pattern from database information, or load new pattern defaults
  componentDidMount = () => {
    // If JWT present, load user pattern
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
      // Disable save when not logged in
      this.setState({ disableSave: true });
    }
    const patternIdToLoad = this.props.match.params.pattern_id;
    // If pattern ID exists, find that pattern and load all parameters of that pattern.
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

          this.setBpmOnLoad();
        })
        .catch((err) => {
          this.setState({
            error: err.error,
          });
        });
      // Load new pattern defaults
    } else {
      this.setState({ title: "Title (click to edit)" });
    }
  };

  // ** HANDLER FUNCTIONS **

  // Handle save new pattern or edit existing pattern (If Null POST, else PATCH)
  handleSave = () => {
    if (this.props.match.params.pattern_id == null) {
      this.insertNewPattern();
    } else {
      this.saveEditsPattern();
    }
  };

  // POST
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

  // PATCH
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
    Tone.start();
    this.setState({ isPlaying: !this.state.isPlaying }, () => {
      if (this.state.isPlaying) this.part.start();
      else this.part.stop();
    });
  };

  setPads = (pads) => {
    this.setState({ pads });
  };

  addPadsOnLoad = (pads) => {
    pads.forEach((pad) => this.part.add(pad[0], pad[1]));
  };

  setBpmOnLoad = () => {
    Tone.Transport.bpm.value = this.state.bpm;
    //Fix Tone.js bug where bpm set moves transport position to random places
    Tone.Transport.position.value = [0, 0, 0];
  };

  addPad = (time, key) => {
    this.part.add(time, key);
  };

  removePad = (time, value) => {
    this.part.remove(time, value);
  };

  clearPads = () => {
    this.part.clear();
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox) => (checkbox.checked = 0));
  };

  handleEnterOnTitle = (e) => {
    if (e.keyCode === 13 && e.target.checkValidity())
      this.setState({ editingTitle: false });
  };

  handleBlurOnTitle = (e) => {
    if (e.target.checkValidity()) this.setState({ editingTitle: false });
  };

  render() {
    const names = ["Kick", "Snare", "Shake", "Hat 1", "Hat 2", "Shout"];
    return (
      <section className="machine">
        {!this.state.editingTitle && (
          <h2
            className="pattern-title"
            onClick={() => this.setState({ editingTitle: true })}
          >
            {this.state.title}
          </h2>
        )}
        {this.state.editingTitle && (
          <div className="titleDiv">
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
            <span className="titleSpan">*Press enter to finish</span>
          </div>
        )}
        <div className="transport-header">
          <div className="transport">
            <div className="transport-item">
              <label>BPM:</label>
              <input
                type="number"
                value={this.state.bpm}
                className="bpm-selector"
                onChange={(e) => this.handleBPMChange(e)}
                min="40"
                max="360"
              />
            </div>
            <div className="transport-item">
              <button
                className={this.state.isPlaying ? "playStop" : "play"}
                type="button"
                onClick={(e) => this.handlePlayToggle()}
              >
                {this.state.isPlaying ? "Stop" : "Play"}
              </button>
            </div>
          </div>
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
              clearPads: this.clearPads,
            }}
          >
            <Grid />
          </DrumContext.Provider>
        </div>
        <article className="sequenceFoot">
          <div className="save-block">
            <button
              className="save-button"
              type="button"
              onClick={(e) => this.handleSave()}
              disabled={this.state.disableSave}
            >
              Save Pattern
            </button>
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
          </div>
          <div className="clearBtn">
            <button
              onClick={() => {
                this.clearPads();
              }}
            >
              Clear Pattern
            </button>
          </div>
        </article>
      </section>
    );
  }
}
