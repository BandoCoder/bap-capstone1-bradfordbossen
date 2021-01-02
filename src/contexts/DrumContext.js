import React from "react";

// ** CONTEXT SERVICING ALL SEQUENCER COMPONENTS **
const DrumContext = React.createContext({
  pads: [],
  addPad: (string) => {},
  removePad: (string) => {},
  setPads: (pads) => {},
});

export default DrumContext;
