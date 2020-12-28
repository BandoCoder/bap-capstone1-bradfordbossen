import React from "react";

const DrumContext = React.createContext({
  pads: [],
  addPad: (string) => {},
  removePad: (string) => {},
  setPads: (pads) => {},
});

export default DrumContext;
