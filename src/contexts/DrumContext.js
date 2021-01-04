import React from "react";

// ** CONTEXT SERVICING ALL SEQUENCER COMPONENTS **
const DrumContext = React.createContext({
  pads: [],
  addPad: (string) => {},
  removePad: (string) => {},
  setPads: (pads) => {},
  clearPads: () => {},
});

export default DrumContext;
